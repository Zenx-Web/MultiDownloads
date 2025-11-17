import { Router } from 'express';
import downloadRoutes from './downloadRoutes';
import convertRoutes from './convertRoutes';
import { getJobStatus } from '../controllers/downloadController';

const router = Router();

// Mount route modules
router.use('/download', downloadRoutes);
router.use('/convert', convertRoutes);

// Status endpoint at root level
router.get('/status/:jobId', getJobStatus);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'MultiDownloader API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
