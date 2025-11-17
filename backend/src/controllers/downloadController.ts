import { Request, Response } from 'express';
import { DownloadRequest, ApiResponse } from '../types';
import { createJob, getJob, updateJob } from '../services/jobService';
import { detectPlatform, isValidUrl } from '../services/urlService';
import { downloadMedia, getMediaInfo } from '../services/downloaderService';
import { ApiError } from '../middlewares/errorHandler';
import { incrementDownloadCount, decrementConcurrentCount, validateQualityLimit } from '../middlewares/tierLimits';
import * as fs from 'fs';
import * as path from 'path';

/**
 * POST /api/download/info
 * Get video information and available formats
 */
export const getVideoInfo = async (
  req: Request,
  res: Response
) => {
  try {
    const { url } = req.body;

    if (!url || !isValidUrl(url)) {
      throw new ApiError(400, 'Valid URL is required');
    }

    const platform = detectPlatform(url);
    const info = await getMediaInfo(url, platform);

    res.json({
      success: true,
      data: info,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Failed to fetch video info: ${(error as Error).message}`);
  }
};

/**
 * POST /api/download
 * Initiate a media download from supported platforms
 */
export const initiateDownload = async (
  req: Request<{}, {}, DownloadRequest>,
  res: Response<ApiResponse>
) => {
  try {
    const { url, platform: requestedPlatform, quality = '720', format = 'mp4' } = req.body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      throw new ApiError(400, 'Invalid URL provided');
    }

    // Get user limits from middleware
    const userLimits = (req as any).userLimits;

    // Validate quality against user's tier limits
    if (!validateQualityLimit(quality, userLimits.maxResolution)) {
      throw new ApiError(
        403,
        `Quality ${quality}p exceeds your tier limit of ${userLimits.maxResolution}p. Upgrade to premium for higher quality downloads.`
      );
    }

    // Detect platform
    const platform = requestedPlatform === 'auto' || !requestedPlatform
      ? detectPlatform(url)
      : requestedPlatform;

    // Create job
    const job = createJob();

    // Increment counters
    incrementDownloadCount(req);

    // Start download asynchronously
    processDownload(job.id, url, platform, quality, format, req)
      .catch((error) => {
        updateJob(job.id, {
          status: 'failed',
          error: error.message,
        });
      });

    // Return job ID immediately
    res.json({
      success: true,
      data: {
        jobId: job.id,
        message: 'Download initiated. Use the job ID to check status.',
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, `Download initiation failed: ${(error as Error).message}`);
  }
};

/**
 * Process download in background
 */
const processDownload = async (
  jobId: string,
  url: string,
  platform: any,
  quality: string,
  format: string,
  req: Request
) => {
  try {
    updateJob(jobId, { status: 'processing', progress: 5 });

    const filePath = await downloadMedia(url, platform, quality, format, jobId);

    updateJob(jobId, {
      status: 'completed',
      progress: 100,
      filePath,
      downloadUrl: `/api/download/file/${jobId}`,
      message: 'Download completed successfully!',
    });
  } catch (error) {
    updateJob(jobId, {
      status: 'failed',
      error: (error as Error).message,
    });
  } finally {
    // Decrement concurrent counter
    decrementConcurrentCount(req);
  }
};

/**
 * GET /api/status/:jobId
 * Get the status of a download/conversion job
 */
export const getJobStatus = async (
  req: Request<{ jobId: string }>,
  res: Response<ApiResponse>
) => {
  try {
    const { jobId } = req.params;

    const job = getJob(jobId);

    if (!job) {
      throw new ApiError(404, 'Job not found');
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to fetch job status');
  }
};

/**
 * GET /api/download/file/:jobId
 * Download the completed file
 */
export const downloadFile = async (
  req: Request<{ jobId: string }>,
  res: Response
) => {
  try {
    const { jobId } = req.params;

    const job = getJob(jobId);

    if (!job) {
      throw new ApiError(404, 'Job not found');
    }

    if (job.status !== 'completed') {
      throw new ApiError(400, 'Job is not completed yet');
    }

    if (!job.filePath) {
      throw new ApiError(500, 'File path not found in job');
    }

    // Check if file exists
    if (!fs.existsSync(job.filePath)) {
      throw new ApiError(404, 'File not found on server');
    }

    // Get file info
    const fileName = path.basename(job.filePath);
    const stat = fs.statSync(job.filePath);

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', stat.size);

    // Stream the file
    const fileStream = fs.createReadStream(job.filePath);
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Error streaming file' });
      }
    });

    fileStream.pipe(res);

    // Optional: Clean up file after download (with delay)
    fileStream.on('end', () => {
      setTimeout(() => {
        try {
          if (fs.existsSync(job.filePath!)) {
            fs.unlinkSync(job.filePath!);
            console.log(`Cleaned up file: ${job.filePath}`);
          }
        } catch (cleanupError) {
          console.error('Cleanup error:', cleanupError);
        }
      }, 5000); // 5 second delay before cleanup
    });

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'File download failed');
  }
};
