import { Platform } from '../types';

/**
 * Detect platform from URL
 */
export const detectPlatform = (url: string): Platform => {
  const urlLower = url.toLowerCase();

  if (
    urlLower.includes('youtube.com') ||
    urlLower.includes('youtu.be') ||
    urlLower.includes('youtube-nocookie.com') ||
    urlLower.includes('music.youtube.com')
  ) {
    return Platform.YOUTUBE;
  }

  if (urlLower.includes('instagram.com')) {
    return Platform.INSTAGRAM;
  }

  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com') || urlLower.includes('fb.watch')) {
    return Platform.FACEBOOK;
  }

  if (urlLower.includes('pinterest.com') || urlLower.includes('pin.it')) {
    return Platform.PINTEREST;
  }

  return Platform.UNKNOWN;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize filename for safe storage
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 200);
};
