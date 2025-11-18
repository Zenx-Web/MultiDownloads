import { Request, Response } from 'express';
import multer from 'multer';
import { createJob } from '../services/jobService';
import * as documentService from '../services/documentService';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB limit

/**
 * DOCX to PDF converter
 */
export const docxToPdfHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const job = createJob();

      documentService
        .docxToPdf(req.file.path, job.id)
        .catch((error) => {
          console.error('DOCX to PDF error:', error);
        });

      res.json({ success: true, jobId: job.id });
    } catch (error) {
      console.error('DOCX to PDF handler error:', error);
      res.status(500).json({ success: false, message: 'Conversion failed' });
    }
  },
];

/**
 * PDF to DOCX converter
 */
export const pdfToDocxHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const job = createJob();

      documentService
        .pdfToDocx(req.file.path, job.id)
        .catch((error) => {
          console.error('PDF to DOCX error:', error);
        });

      res.json({ success: true, jobId: job.id });
    } catch (error) {
      console.error('PDF to DOCX handler error:', error);
      res.status(500).json({ success: false, message: 'Conversion failed' });
    }
  },
];

/**
 * Image resizer
 */
export const resizeImageHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { width, height, maintainAspectRatio = 'true' } = req.body;
      const job = createJob();

      documentService
        .resizeImage(
          req.file.path,
          width ? parseInt(width) : undefined,
          height ? parseInt(height) : undefined,
          maintainAspectRatio === 'true',
          job.id
        )
        .catch((error) => {
          console.error('Image resize error:', error);
        });

      res.json({ success: true, jobId: job.id });
    } catch (error) {
      console.error('Image resize handler error:', error);
      res.status(500).json({ success: false, message: 'Resize failed' });
    }
  },
];

/**
 * Image compressor
 */
export const compressImageHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { quality = '80' } = req.body;
      const job = createJob();

      documentService
        .compressImage(req.file.path, parseInt(quality), job.id)
        .catch((error) => {
          console.error('Image compress error:', error);
        });

      res.json({ success: true, jobId: job.id });
    } catch (error) {
      console.error('Image compress handler error:', error);
      res.status(500).json({ success: false, message: 'Compression failed' });
    }
  },
];

/**
 * PDF merger
 */
export const mergePdfsHandler = [
  upload.array('files', 10),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length < 2) {
        res.status(400).json({ success: false, message: 'At least 2 files required' });
        return;
      }

      const job = createJob();
      const outputPath = `uploads/merged_${job.id}.pdf`;

      documentService
        .mergePdfs(
          files.map((f) => f.path),
          outputPath,
          job.id
        )
        .catch((error) => {
          console.error('PDF merge error:', error);
        });

      res.json({ success: true, jobId: job.id });
    } catch (error) {
      console.error('PDF merge handler error:', error);
      res.status(500).json({ success: false, message: 'Merge failed' });
    }
  },
];

/**
 * PDF splitter
 */
export const splitPdfHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const job = createJob();

      documentService
        .splitPdf(req.file.path, job.id)
        .catch((error) => {
          console.error('PDF split error:', error);
        });

      res.json({ success: true, jobId: job.id });
    } catch (error) {
      console.error('PDF split handler error:', error);
      res.status(500).json({ success: false, message: 'Split failed' });
    }
  },
];

/**
 * Thumbnail creator
 */
export const createThumbnailHandler = [
  upload.single('file'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { maxSize = '200' } = req.body;
      const job = createJob();

      documentService
        .createThumbnail(req.file.path, parseInt(maxSize), job.id)
        .catch((error) => {
          console.error('Thumbnail creation error:', error);
        });

      res.json({ success: true, jobId: job.id });
    } catch (error) {
      console.error('Thumbnail handler error:', error);
      res.status(500).json({ success: false, message: 'Thumbnail creation failed' });
    }
  },
];
