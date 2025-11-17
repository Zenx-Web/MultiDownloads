# MultiDownloader Backend API

Backend API for the MultiDownloader web application - A comprehensive media downloader and converter supporting multiple platforms.

## Features

- **Multi-Platform Downloads**: YouTube, Instagram, Facebook, Pinterest support
- **Format Conversion**: Video, audio, and image conversion using FFmpeg and Sharp
- **Progress Tracking**: Real-time job status updates
- **Rate Limiting**: IP-based rate limiting for API protection
- **Tier System**: Free tier with daily limits, premium tier support (future)
- **Type-Safe**: Full TypeScript implementation

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Media Processing**:
  - `ytdl-core`: YouTube video downloads
  - `axios` + `cheerio`: Web scraping for Instagram/Facebook
  - `fluent-ffmpeg`: Video/audio conversion
  - `sharp`: Image processing
- **Middleware**:
  - `express-rate-limit`: Rate limiting
  - `cors`: Cross-origin resource sharing
  - `multer`: File upload handling

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── index.ts      # App configuration
│   ├── controllers/      # Request handlers
│   │   ├── downloadController.ts
│   │   └── convertController.ts
│   ├── middlewares/      # Express middlewares
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── tierLimits.ts
│   ├── routes/           # API routes
│   │   ├── index.ts
│   │   ├── downloadRoutes.ts
│   │   └── convertRoutes.ts
│   ├── services/         # Business logic
│   │   ├── jobService.ts
│   │   ├── urlService.ts
│   │   ├── downloaderService.ts
│   │   └── converterService.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── index.ts          # App entry point
├── temp/                 # Temporary file storage
├── .env.example          # Environment variables template
├── package.json
└── tsconfig.json
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- FFmpeg installed and accessible in PATH (required for video/audio conversion)
- Git (optional)

### Installation Steps

1. **Navigate to backend directory**:
   ```powershell
   cd backend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Configure environment variables**:
   ```powershell
   Copy-Item .env.example .env
   ```
   
   Edit `.env` and configure:
   - `PORT`: Server port (default: 5000)
   - `CORS_ORIGIN`: Frontend URL (default: http://localhost:3000)
   - `FFMPEG_PATH`: Path to FFmpeg binary
   - `TEMP_STORAGE_DIR`: Temporary file storage directory
   - Rate limiting and tier limits

4. **Ensure temp directory exists**:
   ```powershell
   New-Item -ItemType Directory -Force -Path temp
   ```

## Running the Server

### Development Mode
```powershell
npm run dev
```
Server runs with hot-reload on `http://localhost:5000`

### Production Build
```powershell
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Download Media
```
POST /api/download
Body: {
  "url": "https://www.youtube.com/watch?v=...",
  "quality": "720",        // "360", "480", "720", "1080", "1440", "2160"
  "format": "mp4",         // "mp4", "webm", "mkv"
  "platform": "auto"       // "youtube", "instagram", "facebook", "auto"
}
Response: {
  "success": true,
  "data": { "jobId": "uuid" }
}
```

### Check Job Status
```
GET /api/status/:jobId
Response: {
  "success": true,
  "data": {
    "id": "uuid",
    "status": "processing",  // "pending", "processing", "completed", "failed"
    "progress": 45,          // 0-100
    "message": "Downloading...",
    "downloadUrl": "/api/download/file/uuid"
  }
}
```

### Convert Video
```
POST /api/convert/video
Content-Type: multipart/form-data
Body:
  - file: (video file)
  - targetFormat: "mp4"
  - targetResolution: "1920x1080" (optional)
```

### Convert Audio
```
POST /api/convert/audio
Content-Type: multipart/form-data
Body:
  - file: (video/audio file)
  - targetFormat: "mp3"
  - bitrate: "256k" (optional)
```

### Convert Image
```
POST /api/convert/image
Content-Type: multipart/form-data
Body:
  - file: (image file)
  - targetFormat: "png"
  - width: 1920 (optional)
  - height: 1080 (optional)
  - quality: 80 (optional, 1-100)
```

## Free Tier Limits (Default)

- **Downloads per day**: 5
- **Max resolution**: 720p
- **Concurrent downloads**: 2
- **Rate limit**: 100 requests per 15 minutes

These can be adjusted in `.env` file.

## Architecture & Design

### Service Layer Pattern
Business logic is separated into service modules:
- `jobService`: Manages job lifecycle and status tracking
- `downloaderService`: Handles platform-specific download logic
- `converterService`: Wraps FFmpeg and Sharp for media conversion
- `urlService`: URL validation and platform detection

### Middleware Stack
1. **CORS**: Allows frontend origin
2. **Rate Limiter**: Global and endpoint-specific limits
3. **Tier Limits**: Enforces free/premium tier constraints
4. **Error Handler**: Centralized error handling

### Progress Tracking
Jobs are tracked in-memory with unique IDs. Frontend polls `/api/status/:jobId` for updates. Progress is updated during download/conversion.

## TODO: Future Enhancements

### Database Integration
```typescript
// Currently using in-memory storage
// TODO: Implement with PostgreSQL + Prisma
// - User accounts and authentication
// - Job history persistence
// - Usage analytics
```

### Authentication & Authorization
```typescript
// TODO: Add JWT-based auth
// - User registration/login
// - Premium subscription management
// - Protected endpoints
```

### Payment Integration
```typescript
// TODO: Integrate Stripe for subscriptions
// - Premium tier checkout
// - Subscription webhooks
// - Usage-based billing
```

### Enhanced Platform Support
```typescript
// TODO: Add yt-dlp wrapper for broader platform coverage
// - TikTok, Twitter, Reddit support
// - Batch downloads
// - Playlist support
```

## Development

### Linting
```powershell
npm run lint
```

### Formatting
```powershell
npm run format
```

### Building
```powershell
npm run build
# Output in dist/
```

## Troubleshooting

### FFmpeg Not Found
Ensure FFmpeg is installed and in PATH:
```powershell
ffmpeg -version
```
Or set `FFMPEG_PATH` in `.env` to the absolute path.

### Port Already in Use
Change `PORT` in `.env` or stop the process using port 5000:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Errors
Ensure `CORS_ORIGIN` in `.env` matches your frontend URL exactly.

## License

MIT
