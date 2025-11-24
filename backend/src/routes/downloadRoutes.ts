import { Router } from 'express';
import { initiateDownload, downloadFile, getVideoInfo } from '../controllers/downloadController';
import { downloadLimiter } from '../middlewares/rateLimiter';
import { checkFreeTierLimits } from '../middlewares/tierLimits';
import { optionalAuth } from '../middlewares/auth';

const router = Router();

/**
 * POST /api/download/info
 * Get video information
 */
router.post('/info', optionalAuth, getVideoInfo);

/**
 * POST /api/download
 * Initiate a media download
 */
router.post('/', optionalAuth, downloadLimiter, checkFreeTierLimits, initiateDownload);

/**
 * GET /api/download/file/:jobId
 * Download completed file
 */
router.get('/file/:jobId', downloadFile);

export default router;
