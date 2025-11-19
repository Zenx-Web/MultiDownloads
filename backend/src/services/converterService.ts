import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import * as path from 'path';
import { config } from '../config';
import { updateJob } from './jobService';

// Set FFmpeg paths from config
if (config.ffmpeg.path) {
  ffmpeg.setFfmpegPath(config.ffmpeg.path);
}
if (config.ffmpeg.probePath) {
  ffmpeg.setFfprobePath(config.ffmpeg.probePath);
}

/**
 * Convert video format using FFmpeg
 */
export const convertVideo = async (
  inputPath: string,
  targetFormat: string,
  targetResolution: string | undefined,
  jobId: string
): Promise<string> => {
  // Check if FFmpeg is available
  if (!config.ffmpeg.path) {
    throw new Error('FFmpeg is not installed. Video conversion is not available on free hosting tier. Please upgrade to enable converters.');
  }

  const outputPath = path.join(
    config.storage.tempDir,
    `${jobId}_converted.${targetFormat}`
  );

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    // Set resolution if specified
    if (targetResolution) {
      command = command.size(targetResolution);
    }

    command
      .output(outputPath)
      .on('start', () => {
        updateJob(jobId, { progress: 10, status: 'processing', message: 'Starting video conversion...' });
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          const percent = Math.min(Math.floor(progress.percent), 99);
          updateJob(jobId, { progress: percent, message: `Converting video: ${percent}%` });
        }
      })
      .on('end', () => {
        updateJob(jobId, { progress: 100, message: 'Conversion complete!' });
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(new Error(`Video conversion failed: ${err.message}`));
      })
      .run();
  });
};

/**
 * Convert video to audio (extract audio track)
 */
export const convertVideoToAudio = async (
  inputPath: string,
  targetFormat: string,
  bitrate: string | undefined,
  jobId: string
): Promise<string> => {
  // Check if FFmpeg is available
  if (!config.ffmpeg.path) {
    throw new Error('FFmpeg is not installed. Audio conversion is not available on free hosting tier. Please upgrade to enable converters.');
  }

  const outputPath = path.join(
    config.storage.tempDir,
    `${jobId}_audio.${targetFormat}`
  );

  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath)
      .noVideo()
      .audioCodec(targetFormat === 'mp3' ? 'libmp3lame' : 'aac');

    // Set bitrate if specified
    if (bitrate) {
      command = command.audioBitrate(bitrate);
    }

    command
      .output(outputPath)
      .on('start', () => {
        updateJob(jobId, { progress: 10, status: 'processing', message: 'Extracting audio...' });
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          const percent = Math.min(Math.floor(progress.percent), 99);
          updateJob(jobId, { progress: percent, message: `Extracting audio: ${percent}%` });
        }
      })
      .on('end', () => {
        updateJob(jobId, { progress: 100, message: 'Audio extraction complete!' });
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(new Error(`Audio extraction failed: ${err.message}`));
      })
      .run();
  });
};

/**
 * Convert image format using Sharp
 */
export const convertImage = async (
  inputPath: string,
  targetFormat: string,
  width: number | undefined,
  height: number | undefined,
  quality: number | undefined,
  jobId: string
): Promise<string> => {
  try {
    updateJob(jobId, { progress: 10, status: 'processing', message: 'Starting image conversion...' });

    const outputPath = path.join(
      config.storage.tempDir,
      `${jobId}_converted.${targetFormat}`
    );

    let image = sharp(inputPath);

    // Resize if dimensions specified
    if (width || height) {
      updateJob(jobId, { progress: 30, message: 'Resizing image...' });
      image = image.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    updateJob(jobId, { progress: 60, message: 'Converting format...' });

    // Convert to target format
    switch (targetFormat) {
      case 'jpg':
      case 'jpeg':
        image = image.jpeg({ quality: quality || 80 });
        break;
      case 'png':
        image = image.png({ quality: quality || 80 });
        break;
      case 'webp':
        image = image.webp({ quality: quality || 80 });
        break;
      case 'avif':
        image = image.avif({ quality: quality || 80 });
        break;
      case 'gif':
        image = image.gif();
        break;
      case 'bmp':
        // Sharp doesn't support BMP output, convert to PNG instead
        image = image.png();
        break;
      default:
        throw new Error(`Unsupported image format: ${targetFormat}`);
    }

    await image.toFile(outputPath);

    updateJob(jobId, { progress: 100, message: 'Image conversion complete!' });

    return outputPath;
  } catch (error) {
    throw new Error(`Image conversion failed: ${(error as Error).message}`);
  }
};
