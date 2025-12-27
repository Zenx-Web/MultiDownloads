import { Router } from 'express';
import { getSystemStatsHandler } from '../controllers/adminController';

const router = Router();

router.get('/stats', getSystemStatsHandler);

export default router;
