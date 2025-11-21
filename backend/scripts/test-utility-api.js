const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const backendDir = path.resolve(__dirname, '..');
const baseUrl = 'http://localhost:5000';
const serverStartPattern = 'Server is listening';

const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startServer = () => {
  const child = spawn('node', ['dist/index.js'], {
    cwd: backendDir,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return new Promise((resolve, reject) => {
    let resolved = false;

    const cleanup = (error) => {
      child.stdout.off('data', handleStdout);
      child.stderr.off('data', handleStderr);
      child.off('error', handleError);
      child.off('exit', handleExit);
      if (error && !resolved) {
        reject(error);
      } else if (!resolved) {
        resolve(child);
      }
      resolved = true;
    };

    const handleStdout = (chunk) => {
      const text = chunk.toString();
      process.stdout.write(text);
      if (text.includes(serverStartPattern) || text.includes('Port:')) {
        cleanup();
      }
    };

    const handleStderr = (chunk) => {
      process.stderr.write(chunk.toString());
    };

    const handleError = (error) => {
      cleanup(error);
    };

    const handleExit = (code) => {
      cleanup(new Error(`Server exited with code ${code ?? 'unknown'}`));
    };

    child.stdout.on('data', handleStdout);
    child.stderr.on('data', handleStderr);
    child.once('error', handleError);
    child.once('exit', handleExit);

    setTimeout(() => {
      if (!resolved) {
        cleanup(new Error('Timed out waiting for server to start'));
      }
    }, 20000);
  }).then(() => child);
};

const stopServer = async (child) => {
  if (!child || child.killed) {
    return;
  }

  return new Promise((resolve) => {
    const handleExit = () => resolve();
    child.once('exit', handleExit);

    if (!child.kill('SIGINT')) {
      child.kill('SIGTERM');
    }

    setTimeout(() => {
      if (!child.killed) {
        child.kill('SIGKILL');
      }
    }, 5000);
  });
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }
  return response.json();
};

const pollJobStatus = async (jobId, label) => {
  const deadline = Date.now() + 2 * 60 * 1000;
  let lastStatus;

  while (Date.now() < deadline) {
    const statusResponse = await fetchJson(`${baseUrl}/api/status/${jobId}`);
    lastStatus = statusResponse.data;

    if (!lastStatus) {
      throw new Error(`${label}: status response missing data`);
    }

    if (lastStatus.status === 'completed') {
      return lastStatus;
    }

    if (lastStatus.status === 'failed') {
      throw new Error(`${label}: job failed - ${lastStatus.error || 'Unknown error'}`);
    }

    await waitFor(2000);
  }

  throw new Error(`${label}: job polling timed out`);
};

const SAMPLE_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mNk+M+ABAwMjIABAAC+AAHNzJGnAAAAAElFTkSuQmCC';

const createSampleBlob = () => {
  const buffer = Buffer.from(SAMPLE_PNG_BASE64, 'base64');
  return new Blob([buffer], { type: 'image/png' });
};

const cleanupFileIfExists = (filePath) => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.warn(`Warning: failed to delete ${filePath}:`, error.message);
  }
};

const runTests = async () => {
  const results = [];

  // QR Code
  const qrBody = { text: 'Hello QR', size: 256 };
  const qrResponse = await fetchJson(`${baseUrl}/api/utility/qr-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(qrBody),
  });
  const qrJob = await pollJobStatus(qrResponse.jobId, 'QR code');
  cleanupFileIfExists(qrJob.filePath);
  results.push('QR code generation succeeded');

  // Hash generation (text)
  const hashForm = new FormData();
  hashForm.append('text', 'hash me');
  hashForm.append('algorithm', 'sha256');
  const hashResponse = await fetchJson(`${baseUrl}/api/utility/hash`, {
    method: 'POST',
    body: hashForm,
  });
  const hashJob = await pollJobStatus(hashResponse.jobId, 'Hash');
  cleanupFileIfExists(hashJob.filePath);
  results.push('Hash generation succeeded');

  // Text formatting
  const formatResponse = await fetchJson(`${baseUrl}/api/utility/format-text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'hello world', operation: 'uppercase' }),
  });
  const formatJob = await pollJobStatus(formatResponse.jobId, 'Text formatting');
  cleanupFileIfExists(formatJob.filePath);
  results.push('Text formatting succeeded');

  // Color palette
  const paletteForm = new FormData();
  paletteForm.append('file', createSampleBlob(), 'palette.png');
  paletteForm.append('colorCount', '3');
  const paletteResponse = await fetchJson(`${baseUrl}/api/utility/color-palette`, {
    method: 'POST',
    body: paletteForm,
  });
  const paletteJob = await pollJobStatus(paletteResponse.jobId, 'Color palette');
  cleanupFileIfExists(paletteJob.filePath);
  results.push('Color palette extraction succeeded');

  // Favicon
  const faviconForm = new FormData();
  faviconForm.append('file', createSampleBlob(), 'favicon.png');
  const faviconResponse = await fetchJson(`${baseUrl}/api/utility/favicon`, {
    method: 'POST',
    body: faviconForm,
  });
  const faviconJob = await pollJobStatus(faviconResponse.jobId, 'Favicon');
  cleanupFileIfExists(faviconJob.filePath);
  results.push('Favicon generation succeeded');

  return results;
};

(async () => {
  let serverProcess;

  try {
    console.log('Starting backend server for utility API tests...');
    serverProcess = await startServer();

    await waitFor(2000);

    console.log('Running utility API tests...');
    const results = await runTests();
    results.forEach((line) => console.log(`✓ ${line}`));

    console.log('Utility API tests passed.');
    process.exitCode = 0;
  } catch (error) {
    console.error('Utility API tests failed:', error);
    process.exitCode = 1;
  } finally {
    await stopServer(serverProcess);
  }
})();
