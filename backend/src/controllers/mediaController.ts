import { Request, Response } from 'express';
import multer from 'multer';
import { createJob } from '../services/jobService';
import * as mediaService from '../services/mediaService';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

/**
 * Trim Video
 */
export const trimVideoHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { startTime, endTime } = req.body;

      if (!file || !startTime || !endTime) {
        res.status(400).json({ success: false, error: 'File, startTime, and endTime are required' });
        return;
      }

      const job = createJob();
      res.json({ success: true, jobId: job.id });

      // Process in background
      mediaService.trimVideo(file.path, startTime, endTime, job.id).catch((error) => {
        console.error('Video trim error:', error);
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to trim video' });
    }
  },
];

/**
 * Add Watermark
 */
export const addWatermarkHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { watermarkText, position = 'bottom-right', opacity = 0.5 } = req.body;

      if (!file || !watermarkText) {
        res.status(400).json({ success: false, error: 'File and watermarkText are required' });
        return;
      }

      const job = createJob();
      res.json({ success: true, jobId: job.id });

      // Process in background
      mediaService
        .addWatermark(file.path, watermarkText, position, Number(opacity), job.id)
        .catch((error) => {
          console.error('Watermark error:', error);
        });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to add watermark' });
    }
  },
];

/**
 * Remove Background
 */
export const removeBackgroundHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;

      if (!file) {
        res.status(400).json({ success: false, error: 'Image file is required' });
        return;
      }

      const job = createJob();
      res.json({ success: true, jobId: job.id });

      // Process in background
      mediaService.removeBackground(file.path, job.id).catch((error) => {
        console.error('Background removal error:', error);
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to remove background' });
    }
  },
];

/**
 * Capture Screenshot
 */
export const captureScreenshotHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, fullPage = true, width = 1920, height = 1080 } = req.body;

    if (!url) {
      res.status(400).json({ success: false, error: 'URL is required' });
      return;
    }

    const job = createJob();
    res.json({ success: true, jobId: job.id });

    // Process in background
    mediaService
      .captureScreenshot(url, fullPage === 'true' || fullPage === true, Number(width), Number(height), job.id)
      .catch((error) => {
        console.error('Screenshot error:', error);
      });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to capture screenshot' });
  }
};

/**
 * Text to Speech
 */
export const textToSpeechHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text) {
      res.status(400).json({ success: false, error: 'Text is required' });
      return;
    }

    const job = createJob();
    res.json({ success: true, jobId: job.id });

    // Process in background
    mediaService.textToSpeech(text, language, job.id).catch((error) => {
      console.error('Text to speech error:', error);
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to convert text to speech' });
  }
};
