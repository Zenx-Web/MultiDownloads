import { Request, Response } from 'express';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { createJob, updateJob } from '../services/jobService';
import * as utilityService from '../services/utilityService';

// Multer storage configuration
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
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
 * Generate QR Code
 */
export const generateQRCodeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, size = 300 } = req.body;

    if (!text) {
      res.status(400).json({ success: false, error: 'Text is required' });
      return;
    }

    const job = createJob();
    res.json({ success: true, jobId: job.id });

    // Process in background
    utilityService.generateQRCode(text, Number(size), job.id).catch((error: Error) => {
      console.error('QR generation error:', error);
      updateJob(job.id, {
        status: 'failed',
        error: error.message,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate QR code' });
  }
};

/**
 * Generate Hash
 */
export const generateHashHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, algorithm = 'sha256' } = req.body;
      const file = req.file;

      if (!file && !text) {
        res.status(400).json({ success: false, error: 'File or text is required' });
        return;
      }

      const job = createJob();
      res.json({ success: true, jobId: job.id });

      // Process in background
      utilityService
        .generateHash(file?.path || null, text || null, algorithm, job.id)
        .catch((error: Error) => {
          console.error('Hash generation error:', error);
          updateJob(job.id, {
            status: 'failed',
            error: error.message,
          });
        });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to generate hash' });
    }
  },
];

/**
 * Format Text
 */
export const formatTextHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, operation = 'uppercase' } = req.body;

    if (!text) {
      res.status(400).json({ success: false, error: 'Text is required' });
      return;
    }

    const job = createJob();
    res.json({ success: true, jobId: job.id });

    // Process in background
    utilityService.formatText(text, operation, job.id).catch((error: Error) => {
      console.error('Text formatting error:', error);
      updateJob(job.id, {
        status: 'failed',
        error: error.message,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to format text' });
  }
};

/**
 * Extract Color Palette
 */
export const extractColorPaletteHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const file = req.file;
      const { colorCount = 5 } = req.body;

      if (!file) {
        res.status(400).json({ success: false, error: 'Image file is required' });
        return;
      }

      const job = createJob();
      res.json({ success: true, jobId: job.id });

      // Process in background
      utilityService
        .extractColorPalette(file.path, Number(colorCount), job.id)
        .catch((error: Error) => {
          console.error('Color extraction error:', error);
          updateJob(job.id, {
            status: 'failed',
            error: error.message,
          });
        });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to extract colors' });
    }
  },
];

/**
 * Generate Favicon
 */
export const generateFaviconHandler = [
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
      utilityService.generateFavicon(file.path, job.id).catch((error: Error) => {
        console.error('Favicon generation error:', error);
        updateJob(job.id, {
          status: 'failed',
          error: error.message,
        });
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to generate favicon' });
    }
  },
];
