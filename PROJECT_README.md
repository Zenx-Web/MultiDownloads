# MultiDownloader Web App

A comprehensive, modern web application for downloading and converting media from multiple platforms including YouTube, Instagram, Facebook, Pinterest, and more. Built with a Next.js frontend and Node.js backend, featuring a freemium monetization model.

![MultiDownloader](https://img.shields.io/badge/status-development-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### Multi-Platform Downloads
- **YouTube**: Videos, playlists, shorts with quality selection up to 4K
- **Instagram**: Posts, Reels, IGTV, Stories
- **Facebook**: Public/private videos, stories
- **Pinterest**: Idea pins, videos
- More platforms coming soon!

### Media Conversion Tools
- **Video Conversion**: MP4, AVI, MKV, WebM with quality/resolution control
- **Audio Extraction**: Convert video to MP3, WAV, AAC, FLAC, OGG
- **Image Conversion**: JPG, PNG, WebP, AVIF, GIF, BMP with resizing

### Freemium Model
- **Free Tier**: 5 downloads/day, up to 720p, 2 concurrent downloads
- **Premium Tier**: Unlimited downloads, up to 4K, 10 concurrent downloads, no ads, priority support

### Real-time Progress Tracking
- Live job status updates
- Progress bars showing download/conversion completion
- Error handling and retry mechanisms

## 🏗️ Architecture

```
multidowload tool/
├── frontend/          # Next.js 14 + TypeScript + Tailwind CSS
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   └── ...
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── middlewares/  # Express middlewares
│   │   ├── routes/       # API routes
│   │   └── ...
│   └── ...
└── readme.md          # This file
```

### Technology Stack

**Frontend:**
- Next.js 14 (React framework with App Router)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Axios (HTTP client)

**Backend:**
- Node.js + Express (REST API)
- TypeScript (type safety)
- ytdl-core (YouTube downloads)
- Axios + Cheerio (web scraping for Instagram/Facebook)
- FFmpeg via fluent-ffmpeg (video/audio conversion)
- Sharp (image processing)
- express-rate-limit (rate limiting)
- Multer (file uploads)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **FFmpeg** (required for video/audio conversion)
  - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `choco install ffmpeg`
  - Add to PATH or set `FFMPEG_PATH` in backend `.env`
- **Git** (optional, for cloning)

### Installing FFmpeg on Windows

Using Chocolatey:
```powershell
choco install ffmpeg
```

Or download manually and add to PATH:
1. Download from [ffmpeg.org](https://ffmpeg.org/download.html)
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to System PATH

Verify installation:
```powershell
ffmpeg -version
```

## 🚦 Quick Start

### 1. Clone or Navigate to Project
```powershell
cd "c:\Users\Maac Panbazar\Desktop\multidowload tool"
```

### 2. Setup Backend

```powershell
cd backend

# Install dependencies
npm install

# Configure environment
Copy-Item .env.example .env
# Edit .env with your settings (FFmpeg path, etc.)

# Create temp directory
New-Item -ItemType Directory -Force -Path temp

# Run in development mode
npm run dev
```

Backend will start on `http://localhost:5000`

### 3. Setup Frontend

Open a **new terminal**:

```powershell
cd frontend

# Install dependencies
npm install

# Configure environment
Copy-Item .env.local.example .env.local
# Edit if backend is not on localhost:5000

# Run in development mode
npm run dev
```

Frontend will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📚 Usage Guide

### Downloading a Video

1. Navigate to the home page (`http://localhost:3000`)
2. Paste a media URL (e.g., YouTube link) into the input field
3. Select action:
   - **Download Video**: Choose quality (360p-4K) and format (MP4, WebM, MKV)
   - **Extract Audio (MP3)**: Convert video to audio
4. Click "Start Download" or "Start Audio Extraction"
5. Watch the progress bar as the job processes
6. Click "Download File" when complete

### Using Conversion Tools

1. Navigate to `/tools` page
2. Select a conversion tool (Video Converter, Audio Converter, Image Converter)
3. Upload a file
4. Select target format and options
5. Start conversion and download result

### Checking Pricing & Limits

Visit `/pricing` to see:
- Free tier limits (5 downloads/day, 720p max)
- Premium tier benefits (unlimited, 4K, no ads)
- FAQ section

## 🔧 Configuration

### Backend Configuration (`.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# FFmpeg
FFMPEG_PATH=/usr/bin/ffmpeg       # Or C:\ffmpeg\bin\ffmpeg.exe on Windows
FFPROBE_PATH=/usr/bin/ffprobe

# Storage
TEMP_STORAGE_DIR=./temp
MAX_FILE_SIZE=524288000           # 500MB

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000       # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Free Tier Limits
FREE_TIER_MAX_DOWNLOADS_PER_DAY=5
FREE_TIER_MAX_RESOLUTION=720
FREE_TIER_MAX_CONCURRENT_DOWNLOADS=2
```

### Frontend Configuration (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🛠️ Development

### Project Structure

#### Backend (`/backend`)
```
src/
├── config/              # App configuration
├── controllers/         # Request handlers
│   ├── downloadController.ts
│   └── convertController.ts
├── services/            # Business logic
│   ├── jobService.ts
│   ├── downloaderService.ts
│   ├── converterService.ts
│   └── urlService.ts
├── middlewares/         # Express middlewares
│   ├── errorHandler.ts
│   ├── rateLimiter.ts
│   └── tierLimits.ts
├── routes/              # API routes
└── types/               # TypeScript types
```

#### Frontend (`/frontend`)
```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── tools/page.tsx       # Tools listing
├── pricing/page.tsx     # Pricing page
└── globals.css          # Global styles
components/
├── Navbar.tsx           # Navigation
├── Footer.tsx           # Footer
├── DownloadForm.tsx     # Main download form
└── ProgressTracker.tsx  # Progress display
```

### Building for Production

**Backend:**
```powershell
cd backend
npm run build
npm start
```

**Frontend:**
```powershell
cd frontend
npm run build
npm start
```

### Code Quality

Both frontend and backend have linting and formatting:

```powershell
npm run lint      # Check for issues
npm run format    # Auto-format code
```

## 📡 API Reference

### Key Endpoints

#### POST `/api/download`
Initiate a media download.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "quality": "720",
  "format": "mp4",
  "platform": "auto"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "jobId": "uuid-here" }
}
```

#### GET `/api/status/:jobId`
Get job status.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "processing",
    "progress": 45,
    "message": "Downloading video...",
    "downloadUrl": "/api/download/file/uuid"
  }
}
```

See `backend/README.md` for full API documentation.

## 🚀 Deployment

### Backend Deployment

Deploy to platforms like:
- **Heroku**: `git push heroku main`
- **DigitalOcean**: Use App Platform or Droplet
- **AWS**: EC2 or Elastic Beanstalk
- **Railway**: Connect GitHub repo

**Important**: Ensure FFmpeg is installed on the deployment server.

### Frontend Deployment

Deploy to:
- **Vercel**: `vercel --prod` (recommended for Next.js)
- **Netlify**: Connect GitHub repo
- **AWS Amplify**: Use console or CLI

**Note**: Update `NEXT_PUBLIC_API_URL` in environment variables to your production backend URL.

## 🔮 Future Enhancements (TODO)

### High Priority
- [ ] **User Authentication**: JWT-based login/signup with user accounts
- [ ] **Database Integration**: PostgreSQL + Prisma for user data and job history
- [ ] **Payment Integration**: Stripe for premium subscriptions
- [ ] **Enhanced Platform Support**: TikTok, Twitter, Reddit using yt-dlp

### Medium Priority
- [ ] **Batch Downloads**: Download multiple URLs at once
- [ ] **Playlist Support**: Download entire YouTube playlists
- [ ] **Cloud Storage**: Save to Google Drive, Dropbox
- [ ] **Download History**: View past downloads in user dashboard
- [ ] **Dark Mode**: Theme toggle

### Low Priority
- [ ] **Mobile Apps**: React Native versions
- [ ] **Browser Extensions**: Chrome/Firefox extensions
- [ ] **API Keys for Developers**: Public API with rate limits
- [ ] **Analytics Dashboard**: Admin panel for usage stats

## 🐛 Troubleshooting

### Backend won't start
- Check FFmpeg is installed: `ffmpeg -version`
- Verify `.env` file exists with correct values
- Check port 5000 is not in use: `netstat -ano | findstr :5000`

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify CORS is enabled on backend

### Download fails
- Check internet connection
- Verify URL is publicly accessible
- Check backend logs for specific errors
- Some platforms may block scraping attempts

### TypeScript errors after cloning
Run `npm install` in both `frontend` and `backend` directories.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact & Support

- **Issues**: Open a GitHub issue
- **Email**: support@multidownloader.com (placeholder)
- **Documentation**: See `backend/README.md` and `frontend/README.md`

## 🙏 Acknowledgments

- **ytdl-core**: YouTube download functionality
- **FFmpeg**: Video/audio processing
- **Sharp**: Image processing
- **Next.js**: React framework
- **Tailwind CSS**: Styling framework

---

**Built with ❤️ by your development team**

**Status**: 🚧 Active Development
