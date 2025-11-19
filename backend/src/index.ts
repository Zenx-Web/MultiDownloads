import express, { Application } from 'express';
import cors from 'cors';
import * as fs from 'fs';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';

/**
 * Initialize Express application
 */
const app: Application = express();

/**
 * Middleware setup
 */

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - simplified to allow all origins for now
app.use(
  cors({
    origin: true, // Allow all origins temporarily
    credentials: true,
  })
);

// Rate limiting
app.use('/api', apiLimiter);

// Trust proxy (for accurate IP detection behind reverse proxies)
app.set('trust proxy', 1);

/**
 * Ensure temp directory exists
 */
if (!fs.existsSync(config.storage.tempDir)) {
  fs.mkdirSync(config.storage.tempDir, { recursive: true });
  console.log(`Created temp directory: ${config.storage.tempDir}`);
}

/**
 * Routes
 */
app.use('/api', routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'MultiDownloader API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      download: 'POST /api/download',
      status: 'GET /api/status/:jobId',
      convertVideo: 'POST /api/convert/video',
      convertAudio: 'POST /api/convert/audio',
      convertImage: 'POST /api/convert/image',
    },
  });
});

/**
 * Error handling
 */
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Start server
 */
const PORT = config.port;
const HOST = '0.0.0.0'; // Bind to all interfaces for Railway

const server = app.listen(PORT, HOST, () => {
  console.log('=================================');
  console.log(`🚀 MultiDownloader API Server`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`🌐 Host: ${HOST}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`📁 Temp storage: ${config.storage.tempDir}`);
  console.log('=================================');
  
  // Log successful binding
  const address = server.address();
  if (address && typeof address === 'object') {
    console.log(`✅ Server is listening on ${address.address}:${address.port}`);
  }
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`❌ Permission denied to bind to port ${PORT}`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

export default app;
