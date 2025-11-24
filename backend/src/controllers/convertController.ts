import { Request, Response } from 'express';
import multer from 'multer';
import * as path from 'path';
import { ConvertVideoRequest, ConvertAudioRequest, ConvertImageRequest, ApiResponse } from '../types';
import { createJob, updateJob } from '../services/jobService';
import { convertVideo, convertVideoToAudio, convertImage } from '../services/converterService';
import { ApiError } from '../middlewares/errorHandler';
import { config } from '../config';
import { incrementDownloadCount, decrementConcurrentCount } from '../middlewares/tierLimits';
import { JOB_FAILURE_MESSAGE, logAndExtractError } from '../utils/errorUtils';

const RESOLUTION_PRESETS: Record<string, string> = {
  '360p': '640x360',
  '480p': '854x480',
  '720p': '1280x720',
  '1080p': '1920x1080',
  '1440p': '2560x1440',
  '2160p': '3840x2160',
};

const normalizeResolution = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.toString().trim();
  const lower = trimmed.toLowerCase();

  if (RESOLUTION_PRESETS[lower]) {
    return RESOLUTION_PRESETS[lower];
  }

  if (/^\d{2,4}x\d{2,4}$/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: config.storage.tempDir,
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: config.storage.maxFileSize,
  },
});

/**
 * POST /api/convert/video
 * Convert video format/quality
 */
export const convertVideoHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { targetFormat, targetResolution } = req.body as ConvertVideoRequest;
    const file = (req as any).file;

    if (!file) {
      throw new ApiError(400, 'No file uploaded');
    }

    if (!targetFormat) {
      throw new ApiError(400, 'Target format is required');
    }

    const job = createJob();
    incrementDownloadCount(req);

    // Process conversion asynchronously
    const normalizedResolution = normalizeResolution(targetResolution);

    processVideoConversion(job.id, file.path, targetFormat, normalizedResolution, req).catch(
      (error) => {
        logAndExtractError('convertController.processVideoConversionUncaught', error);
        updateJob(job.id, {
          status: 'failed',
          error: JOB_FAILURE_MESSAGE,
        });
      }
    );

    res.json({
      success: true,
      data: {
        jobId: job.id,
        message: 'Video conversion initiated. Use the job ID to check status.',
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logAndExtractError('convertController.convertVideoHandler', error);
    throw new ApiError(500, 'Video conversion could not be completed. Please try again later.');
  }
};

const processVideoConversion = async (
  jobId: string,
  inputPath: string,
  targetFormat: string,
  targetResolution: string | undefined,
  req: Request
) => {
  try {
    const outputPath = await convertVideo(inputPath, targetFormat, targetResolution, jobId);

    updateJob(jobId, {
      status: 'completed',
      progress: 100,
      filePath: outputPath,
      downloadUrl: `/api/download/file/${jobId}`,
      message: 'Video conversion completed!',
    });
  } catch (error) {
    logAndExtractError('convertController.processVideoConversion', error);
    updateJob(jobId, {
      status: 'failed',
      error: JOB_FAILURE_MESSAGE,
    });
  } finally {
    decrementConcurrentCount(req);
  }
};

/**
 * POST /api/convert/audio
 * Convert video to audio or audio format conversion
 */
export const convertAudioHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { targetFormat, bitrate } = req.body as ConvertAudioRequest;
    const file = (req as any).file;

    if (!file) {
      throw new ApiError(400, 'No file uploaded');
    }

    if (!targetFormat) {
      throw new ApiError(400, 'Target format is required');
    }

    const job = createJob();
    incrementDownloadCount(req);

    // Process conversion asynchronously
    processAudioConversion(job.id, file.path, targetFormat, bitrate, req).catch((error) => {
      logAndExtractError('convertController.processAudioConversionUncaught', error);
      updateJob(job.id, {
        status: 'failed',
        error: JOB_FAILURE_MESSAGE,
      });
    });

    res.json({
      success: true,
      data: {
        jobId: job.id,
        message: 'Audio conversion initiated. Use the job ID to check status.',
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logAndExtractError('convertController.convertAudioHandler', error);
    throw new ApiError(500, 'Audio conversion could not be completed. Please try again later.');
  }
};

const processAudioConversion = async (
  jobId: string,
  inputPath: string,
  targetFormat: string,
  bitrate: string | undefined,
  req: Request
) => {
  try {
    const outputPath = await convertVideoToAudio(inputPath, targetFormat, bitrate, jobId);

    updateJob(jobId, {
      status: 'completed',
      progress: 100,
      filePath: outputPath,
      downloadUrl: `/api/download/file/${jobId}`,
      message: 'Audio conversion completed!',
    });
  } catch (error) {
    logAndExtractError('convertController.processAudioConversion', error);
    updateJob(jobId, {
      status: 'failed',
      error: JOB_FAILURE_MESSAGE,
    });
  } finally {
    decrementConcurrentCount(req);
  }
};

/**
 * POST /api/convert/image
 * Convert image format/size
 */
export const convertImageHandler = async (
  req: Request,
  res: Response<ApiResponse>
) => {
  try {
    const { targetFormat, width, height, quality } = req.body as ConvertImageRequest;
    const file = (req as any).file;

    if (!file) {
      throw new ApiError(400, 'No file uploaded');
    }

    if (!targetFormat) {
      throw new ApiError(400, 'Target format is required');
    }

    const job = createJob();
    incrementDownloadCount(req);

    // Process conversion asynchronously
    processImageConversion(
      job.id,
      file.path,
      targetFormat,
      width ? parseInt(width as any) : undefined,
      height ? parseInt(height as any) : undefined,
      quality ? parseInt(quality as any) : undefined,
      req
    ).catch((error) => {
      logAndExtractError('convertController.processImageConversionUncaught', error);
      updateJob(job.id, {
        status: 'failed',
        error: JOB_FAILURE_MESSAGE,
      });
    });

    res.json({
      success: true,
      data: {
        jobId: job.id,
        message: 'Image conversion initiated. Use the job ID to check status.',
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logAndExtractError('convertController.convertImageHandler', error);
    throw new ApiError(500, 'Image conversion could not be completed. Please try again later.');
  }
};

const processImageConversion = async (
  jobId: string,
  inputPath: string,
  targetFormat: string,
  width: number | undefined,
  height: number | undefined,
  quality: number | undefined,
  req: Request
) => {
  try {
    const outputPath = await convertImage(inputPath, targetFormat, width, height, quality, jobId);

    updateJob(jobId, {
      status: 'completed',
      progress: 100,
      filePath: outputPath,
      downloadUrl: `/api/download/file/${jobId}`,
      message: 'Image conversion completed!',
    });
  } catch (error) {
    logAndExtractError('convertController.processImageConversion', error);
    updateJob(jobId, {
      status: 'failed',
      error: JOB_FAILURE_MESSAGE,
    });
  } finally {
    decrementConcurrentCount(req);
  }
};
