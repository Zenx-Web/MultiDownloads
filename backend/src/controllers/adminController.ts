import { Request, Response } from 'express';
import { getSystemStats } from '../services/jobService';

export const getSystemStatsHandler = (_req: Request, res: Response): void => {
  try {
    const stats = getSystemStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Unable to fetch system stats' });
  }
};
