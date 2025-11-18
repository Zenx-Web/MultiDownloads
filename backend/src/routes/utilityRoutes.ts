import { Router } from 'express';
import {
  generateQRCodeHandler,
  generateHashHandler,
  formatTextHandler,
  extractColorPaletteHandler,
  generateFaviconHandler,
} from '../controllers/utilityController';

const router = Router();

// QR Code Generator
router.post('/qr-code', generateQRCodeHandler);

// Hash Generator
router.post('/hash', generateHashHandler);

// Text Formatter
router.post('/format-text', formatTextHandler);

// Color Palette Extractor
router.post('/color-palette', extractColorPaletteHandler);

// Favicon Generator
router.post('/favicon', generateFaviconHandler);

export default router;
