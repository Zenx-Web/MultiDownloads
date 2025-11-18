import { Router } from 'express';
import {
  docxToPdfHandler,
  pdfToDocxHandler,
  resizeImageHandler,
  compressImageHandler,
  mergePdfsHandler,
  splitPdfHandler,
  createThumbnailHandler,
} from '../controllers/documentController';

const router = Router();

// Document converters
router.post('/docx-to-pdf', ...docxToPdfHandler);
router.post('/pdf-to-docx', ...pdfToDocxHandler);

// Image tools
router.post('/resize-image', ...resizeImageHandler);
router.post('/compress-image', ...compressImageHandler);
router.post('/create-thumbnail', ...createThumbnailHandler);

// PDF tools
router.post('/merge-pdfs', ...mergePdfsHandler);
router.post('/split-pdf', ...splitPdfHandler);

export default router;
