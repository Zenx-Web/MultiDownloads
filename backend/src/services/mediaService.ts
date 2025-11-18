import * as fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import puppeteer from 'puppeteer';
import { updateJob } from './jobService';

// Set FFmpeg path
const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Trim/Cut Video
 */
export const trimVideo = async (
  inputPath: string,
  startTime: string, // Format: "00:00:10" (HH:MM:SS)
  endTime: string,
  jobId: string
): Promise<string> => {
  const outputPath = path.join('uploads', `trimmed-${jobId}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(calculateDuration(startTime, endTime))
      .output(outputPath)
      .on('start', () => {
        updateJob(jobId, { status: 'processing', message: 'Trimming video...' });
      })
      .on('progress', (progress: { percent?: number }) => {
        if (progress.percent) {
          updateJob(jobId, {
            progress: Math.floor(progress.percent),
            message: `Trimming: ${Math.floor(progress.percent)}%`,
          });
        }
      })
      .on('end', () => {
        const downloadUrl = `http://localhost:5000/uploads/${path.basename(outputPath)}`;
        updateJob(jobId, {
          status: 'completed',
          filePath: outputPath,
          downloadUrl,
        });
        resolve(outputPath);
      })
      .on('error', (err: Error) => {
        updateJob(jobId, {
          status: 'failed',
          error: err.message,
        });
        reject(err);
      })
      .run();
  });
};

/**
 * Add Watermark to Image
 */
export const addWatermark = async (
  inputPath: string,
  watermarkText: string,
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center',
  opacity: number, // 0-1
  jobId: string
): Promise<string> => {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const width = metadata.width || 800;
  const height = metadata.height || 600;

  // Create watermark text as SVG
  const fontSize = Math.floor(width / 20);
  const padding = 20;

  let x: number, y: number;
  let anchor = 'start';

  switch (position) {
    case 'top-left':
      x = padding;
      y = fontSize + padding;
      break;
    case 'top-right':
      x = width - padding;
      y = fontSize + padding;
      anchor = 'end';
      break;
    case 'bottom-left':
      x = padding;
      y = height - padding;
      break;
    case 'bottom-right':
      x = width - padding;
      y = height - padding;
      anchor = 'end';
      break;
    case 'center':
    default:
      x = width / 2;
      y = height / 2;
      anchor = 'middle';
      break;
  }

  const svgWatermark = Buffer.from(`
    <svg width="${width}" height="${height}">
      <text
        x="${x}"
        y="${y}"
        font-size="${fontSize}"
        fill="white"
        fill-opacity="${opacity}"
        text-anchor="${anchor}"
        font-family="Arial, sans-serif"
        font-weight="bold"
        stroke="black"
        stroke-width="1"
        stroke-opacity="${opacity * 0.5}"
      >${watermarkText}</text>
    </svg>
  `);

  const outputPath = path.join('uploads', `watermarked-${jobId}.${metadata.format || 'jpg'}`);

  await image
    .composite([{ input: svgWatermark, blend: 'over' }])
    .toFile(outputPath);

  const downloadUrl = `http://localhost:5000/uploads/${path.basename(outputPath)}`;
  updateJob(jobId, {
    status: 'completed',
    filePath: outputPath,
    downloadUrl,
  });

  return outputPath;
};

/**
 * Remove Background from Image (Basic approach using Sharp)
 * Note: For better results, integrate with remove.bg API or ML model
 */
export const removeBackground = async (
  inputPath: string,
  jobId: string
): Promise<string> => {
  const outputPath = path.join('uploads', `no-bg-${jobId}.png`);

  // Simple approach: Convert white/light backgrounds to transparent
  // For production, integrate with remove.bg API or use ML models
  await sharp(inputPath)
    .removeAlpha()
    .threshold(240) // Make light pixels white
    .negate() // Invert to make background black
    .toColorspace('b-w')
    .toFile(outputPath + '.mask.png');

  // Apply mask (simplified - in production use better algorithms)
  const image = sharp(inputPath);
  const mask = sharp(outputPath + '.mask.png');

  await image
    .composite([
      {
        input: await mask.toBuffer(),
        blend: 'dest-in',
      },
    ])
    .png()
    .toFile(outputPath);

  // Clean up mask file
  fs.unlinkSync(outputPath + '.mask.png');

  const downloadUrl = `http://localhost:5000/uploads/${path.basename(outputPath)}`;
  updateJob(jobId, {
    status: 'completed',
    filePath: outputPath,
    downloadUrl,
    metadata: {
      note: 'Basic background removal. For best results, use images with clear backgrounds.',
    },
  });

  return outputPath;
};

/**
 * Capture Screenshot of Website
 */
export const captureScreenshot = async (
  url: string,
  fullPage: boolean,
  width: number,
  height: number,
  jobId: string
): Promise<string> => {
  const outputPath = path.join('uploads', `screenshot-${jobId}.png`);

  updateJob(jobId, { status: 'processing', message: 'Launching browser...' });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height });

    updateJob(jobId, { message: 'Loading page...' });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    updateJob(jobId, { message: 'Capturing screenshot...' });
    const screenshotBuffer = await page.screenshot({
      fullPage,
    });

    // Write buffer to file
    fs.writeFileSync(outputPath, screenshotBuffer);

    await browser.close();

    const downloadUrl = `http://localhost:5000/uploads/${path.basename(outputPath)}`;
    updateJob(jobId, {
      status: 'completed',
      filePath: outputPath,
      downloadUrl,
    });

    return outputPath;
  } catch (error) {
    await browser.close();
    throw error;
  }
};

/**
 * Text to Speech
 */
export const textToSpeech = async (
  text: string,
  language: string,
  jobId: string
): Promise<string> => {
  const gtts = require('node-gtts')(language);
  const outputPath = path.join('uploads', `tts-${jobId}.mp3`);

  return new Promise((resolve, reject) => {
    gtts.save(outputPath, text, (err: Error) => {
      if (err) {
        updateJob(jobId, {
          status: 'failed',
          error: err.message,
        });
        reject(err);
      } else {
        const downloadUrl = `http://localhost:5000/uploads/${path.basename(outputPath)}`;
        updateJob(jobId, {
          status: 'completed',
          filePath: outputPath,
          downloadUrl,
        });
        resolve(outputPath);
      }
    });
  });
};

/**
 * Helper: Calculate duration between two time strings
 */
function calculateDuration(startTime: string, endTime: string): string {
  const start = timeToSeconds(startTime);
  const end = timeToSeconds(endTime);
  const duration = end - start;

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function timeToSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0];
}
