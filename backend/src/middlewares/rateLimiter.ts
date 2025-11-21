import rateLimit from 'express-rate-limit';
import { Request } from 'express';
import { config } from '../config';

const shouldSkipGeneralLimiter = (req: Request) => {
  const path = req.path || '';
  // Allow frequent polling of job status without tripping the limiter
  return path.startsWith('/status/');
};

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkipGeneralLimiter,
});

/**
 * Stricter rate limiter for download/conversion endpoints
 */
export const downloadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: {
    success: false,
    error: 'Too many download requests, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
