import { Router } from 'express';
import {
  convertVideoHandler,
  convertAudioHandler,
  convertImageHandler,
  upload,
} from '../controllers/convertController';
import { downloadLimiter } from '../middlewares/rateLimiter';
import { checkFreeTierLimits } from '../middlewares/tierLimits';

const router = Router();

/**
 * POST /api/convert/video
 * Convert video format/quality
 */
router.post(
  '/video',
  downloadLimiter,
  checkFreeTierLimits,
  upload.single('file'),
  convertVideoHandler
);

/**
 * POST /api/convert/audio
 * Extract audio or convert audio format
 */
router.post(
  '/audio',
  downloadLimiter,
  checkFreeTierLimits,
  upload.single('file'),
  convertAudioHandler
);

/**
 * POST /api/convert/image
 * Convert image format/size
 */
router.post(
  '/image',
  downloadLimiter,
  checkFreeTierLimits,
  upload.single('file'),
  convertImageHandler
);

export default router;
