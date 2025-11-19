import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { UserLimits } from '../types';
import { ApiError } from './errorHandler';

/**
 * In-memory store for tracking user limits (per IP)
 * TODO: Replace with database when implementing user accounts
 */
const userLimitsStore = new Map<string, UserLimits>();
const dailyResetTimers = new Map<string, NodeJS.Timeout>();

/**
 * Get user identifier (IP address for now)
 * TODO: Use user ID from JWT when auth is implemented
 */
const getUserIdentifier = (req: Request): string => {
  return req.ip || req.socket.remoteAddress || 'unknown';
};

/**
 * Get or initialize user limits
 */
const getUserLimits = (userId: string): UserLimits => {
  if (!userLimitsStore.has(userId)) {
    const limits: UserLimits = {
      maxDownloadsPerDay: config.freeTier.maxDownloadsPerDay,
      maxResolution: config.freeTier.maxResolution,
      maxConcurrentDownloads: config.freeTier.maxConcurrentDownloads,
      currentDownloadsToday: 0,
      currentConcurrentDownloads: 0,
    };
    userLimitsStore.set(userId, limits);

    // Reset daily counter after 24 hours
    const timer = setTimeout(() => {
      const userLimits = userLimitsStore.get(userId);
      if (userLimits) {
        userLimits.currentDownloadsToday = 0;
      }
      dailyResetTimers.delete(userId);
    }, 24 * 60 * 60 * 1000);

    dailyResetTimers.set(userId, timer);
  }

  return userLimitsStore.get(userId)!;
};

/**
 * Middleware to check free tier limits
 * TODO: Check user subscription status from database when auth is implemented
 */
export const checkFreeTierLimits = (req: Request, _res: Response, next: NextFunction) => {
  const userId = getUserIdentifier(req);
  const limits = getUserLimits(userId);

  // Check daily download limit
  if (limits.currentDownloadsToday >= limits.maxDownloadsPerDay) {
    throw new ApiError(
      429,
      `Free tier limit reached: ${limits.maxDownloadsPerDay} downloads per day. Upgrade to premium for unlimited downloads.`
    );
  }

  // Check concurrent downloads limit
  if (limits.currentConcurrentDownloads >= limits.maxConcurrentDownloads) {
    throw new ApiError(
      429,
      `Maximum concurrent downloads reached. Please wait for current downloads to complete.`
    );
  }

  // Attach limits to request for use in controllers
  (req as any).userLimits = limits;

  next();
};

/**
 * Increment download counter
 */
export const incrementDownloadCount = (req: Request) => {
  const userId = getUserIdentifier(req);
  const limits = getUserLimits(userId);
  limits.currentDownloadsToday++;
  limits.currentConcurrentDownloads++;
};

/**
 * Decrement concurrent download counter
 */
export const decrementConcurrentCount = (req: Request) => {
  const userId = getUserIdentifier(req);
  const limits = getUserLimits(userId);
  if (limits.currentConcurrentDownloads > 0) {
    limits.currentConcurrentDownloads--;
  }
};

/**
 * Validate requested quality against user limits
 */
export const validateQualityLimit = (requestedQuality: string, maxResolution: number): boolean => {
  const qualityMap: { [key: string]: number } = {
    '360': 360,
    '360p': 360,
    '480': 480,
    '480p': 480,
    '720': 720,
    '720p': 720,
    '1080': 1080,
    '1080p': 1080,
    '1440': 1440,
    '1440p': 1440,
    '2160': 2160,
    '2160p': 2160,
  };

  const quality = qualityMap[requestedQuality] || 720;
  return quality <= maxResolution;
};
