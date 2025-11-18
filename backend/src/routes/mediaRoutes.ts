import { Router } from 'express';
import {
  trimVideoHandler,
  addWatermarkHandler,
  removeBackgroundHandler,
  captureScreenshotHandler,
  textToSpeechHandler,
} from '../controllers/mediaController';

const router = Router();

// Video Trimmer
router.post('/trim-video', trimVideoHandler);

// Watermark Tool
router.post('/add-watermark', addWatermarkHandler);

// Background Remover
router.post('/remove-background', removeBackgroundHandler);

// Screenshot Capture
router.post('/screenshot', captureScreenshotHandler);

// Text to Speech
router.post('/text-to-speech', textToSpeechHandler);

export default router;
