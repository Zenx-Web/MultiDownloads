const { spawn } = require('child_process');

const path = require('path');
const axios = require('axios');
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

const pollJobStatus = async (jobId) => {
  const deadline = Date.now() + 3 * 60 * 1000;
  let lastStatus;

  while (Date.now() < deadline) {
    const response = await axios.get(`${baseUrl}/api/status/${jobId}`, { timeout: 20000 });
    lastStatus = response.data?.data;

    if (!lastStatus) {
      throw new Error('Status response missing data');
    }

    if (lastStatus.status === 'completed') {
      return lastStatus;
    }

    if (lastStatus.status === 'failed') {
      throw new Error(lastStatus.error || 'Job failed');
    }

    await waitFor(5000);
  }

  throw new Error('Job polling timed out');
};

const runTest = async () => {
  const payload = {
    url: process.env.TEST_VIDEO_URL || 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    platform: 'auto',
    quality: '720',
    format: 'mp4',
  };

  const response = await axios.post(`${baseUrl}/api/download`, payload, {
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' },
  });

  const jobId = response.data?.data?.jobId;

  if (!jobId) {
    throw new Error('Download API did not return a jobId');
  }

  console.log(`Download job queued with ID: ${jobId}`);

  const job = await pollJobStatus(jobId);

  console.log(`Job ${jobId} completed. File: ${job.filePath}`);

  if (job.filePath && fs.existsSync(job.filePath)) {
    try {
      fs.unlinkSync(job.filePath);
      console.log('Cleaned up downloaded file.');
    } catch (error) {
      console.warn('Failed to clean up downloaded file:', error);
    }
  }
};

(async () => {
  let serverProcess;

  try {
    console.log('Starting backend server for API test...');
    serverProcess = await startServer();

    await waitFor(2000);

    console.log('Running download API test...');
    await runTest();

    console.log('Download API test passed.');
    process.exitCode = 0;
  } catch (error) {
    console.error('Download API test failed:', error);
    process.exitCode = 1;
  } finally {
    await stopServer(serverProcess);
  }
})();
