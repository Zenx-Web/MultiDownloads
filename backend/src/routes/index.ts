import { Router } from 'express';
import downloadRoutes from './downloadRoutes';
import convertRoutes from './convertRoutes';
import authRoutes from './authRoutes';
import documentRoutes from './documentRoutes';
import utilityRoutes from './utilityRoutes';
import mediaRoutes from './mediaRoutes';
import { getJobStatus } from '../controllers/downloadController';

const router = Router();

// Mount route modules
router.use('/download', downloadRoutes);
router.use('/convert', convertRoutes);
router.use('/auth', authRoutes);
router.use('/document', documentRoutes);
router.use('/utility', utilityRoutes);
router.use('/media', mediaRoutes);

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
