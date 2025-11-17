import dotenv from 'dotenv';

dotenv.config();

/**
 * Central configuration for the application
 */
export const config = {
  // Server
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // FFmpeg
  ffmpeg: {
    path: process.env.FFMPEG_PATH || 'ffmpeg',
    probePath: process.env.FFPROBE_PATH || 'ffprobe',
  },

  // Storage
  storage: {
    tempDir: process.env.TEMP_STORAGE_DIR || './temp',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '524288000', 10), // 500MB
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Free tier limits
  freeTier: {
    maxDownloadsPerDay: parseInt(process.env.FREE_TIER_MAX_DOWNLOADS_PER_DAY || '5', 10),
    maxResolution: parseInt(process.env.FREE_TIER_MAX_RESOLUTION || '720', 10),
    maxConcurrentDownloads: parseInt(
      process.env.FREE_TIER_MAX_CONCURRENT_DOWNLOADS || '2',
      10
    ),
  },

  // Premium tier (TODO: integrate with payment/subscription system)
  premiumTier: {
    maxDownloadsPerDay: parseInt(process.env.PREMIUM_TIER_MAX_DOWNLOADS_PER_DAY || '999999', 10),
    maxResolution: parseInt(process.env.PREMIUM_TIER_MAX_RESOLUTION || '2160', 10),
    maxConcurrentDownloads: parseInt(
      process.env.PREMIUM_TIER_MAX_CONCURRENT_DOWNLOADS || '10',
      10
    ),
  },

  // TODO: Add database config when implementing user accounts
  // database: {
  //   url: process.env.DATABASE_URL,
  // },

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // TODO: Add JWT config when implementing auth
  // jwt: {
  //   secret: process.env.JWT_SECRET,
  //   expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // },

  // TODO: Add payment config when implementing subscriptions
  // stripe: {
  //   secretKey: process.env.STRIPE_SECRET_KEY,
  //   webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  // },
};
