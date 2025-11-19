# 🚀 MultiDownloads - All-in-One Media Tool

A powerful web application for downloading videos, converting media, and using various utility tools.

## ✨ Features

### 📥 Downloaders
- ✅ YouTube Video Downloader (with quality selection)
- ✅ YouTube Music Downloader
- ✅ Instagram Downloader
- ✅ Facebook Video Downloader

### 🔄 Converters
- 🎬 Video Converter (MP4, AVI, MOV, MKV)
- 🎵 Audio Converter (MP3, WAV, AAC, FLAC, OGG)
- 🖼️ Image Converter (JPG, PNG, WebP, AVIF, GIF, BMP)

### 🛠️ Utility Tools
- 📱 QR Code Generator
- 🎨 Color Palette Extractor
- 🔐 Hash Generator
- 🖼️ Image Compressor & Resizer
- 📄 PDF Tools (Merge, Split, Convert)
- 🎤 Text to Speech
- 📸 Screenshot Tool
- 🖌️ Watermark Tool
- 🎯 Favicon Generator
- ✂️ Background Remover
- And more...

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **State Management:** React Hooks

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Media Processing:** FFmpeg, yt-dlp
- **Deployment:** Fly.io
- **Storage:** Supabase (optional)

## 📦 Project Structure

```
multidowload tool/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   └── public/              # Static assets
├── backend/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   └── routes/         # API routes
│   └── temp/               # Temporary file storage
├── Dockerfile              # Docker configuration for Fly.io
├── fly.toml                # Fly.io deployment config
└── .dockerignore          # Docker ignore file
```

## 🚀 Deployment

### Backend (Fly.io)

**Prerequisites:**
- Fly.io account (https://fly.io)
- Fly CLI installed

**Installation:**
```powershell
# Install Fly CLI (Windows)
iwr https://fly.io/install.ps1 -useb | iex

# Login
fly auth login

# Deploy
cd "c:\Users\Maac Panbazar\Desktop\multidowload tool"
fly launch --no-deploy

# Set secrets
fly secrets set YOUTUBE_COOKIES="your-cookies"
fly secrets set SUPABASE_URL="your-url"
fly secrets set SUPABASE_ANON_KEY="your-key"
fly secrets set CORS_ORIGIN="https://multidownloads.vercel.app"

# Deploy
fly deploy
```

**Your API:** `https://multidownloads-backend.fly.dev/api`

For detailed instructions, see [.fly/deploy.md](.fly/deploy.md)

### Frontend (Vercel)

1. **Update `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://multidownloads-backend.fly.dev/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

2. **Deploy:**
- Connect GitHub repo to Vercel
- Auto-deploys on push to main branch

## 🔧 Local Development

### Backend
```bash
cd backend
npm install
npm run dev  # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

## 🌐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
YOUTUBE_COOKIES=your-youtube-cookies
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## 📝 API Endpoints

### Core
- `GET /` - API information
- `GET /api/health` - Health check

### Downloads
- `POST /api/download` - Start download
- `GET /api/status/:jobId` - Job status
- `GET /api/download/file/:jobId` - Download file

### Conversions
- `POST /api/convert/video` - Convert video
- `POST /api/convert/audio` - Convert audio
- `POST /api/convert/image` - Convert image

## 🔒 Features

- ✅ Two-click download system (fetch info → download)
- ✅ Job polling with progress updates
- ✅ Quality selection for videos
- ✅ Format conversion
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Health checks

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and open PR

## 📄 License

MIT License - Free for personal and commercial use

## 🙏 Credits

- **FFmpeg** - Media processing
- **yt-dlp** - Video downloading
- **Fly.io** - Backend hosting
- **Vercel** - Frontend deployment
- **Next.js** - React framework
- **Tailwind CSS** - Styling

---

Made with ❤️ by Zenx-Web

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

## ✨ Features

### 📥 Video Downloaders
- **YouTube Downloader** - Download videos in multiple resolutions (144p - 4K)
- **Instagram Downloader** - Download Reels, Stories, IGTV videos
- **Facebook Downloader** - Download Facebook videos and Facebook Watch content
- **TikTok Downloader** - Download TikTok videos without watermark

### 🔄 Media Converters
- **Video Converter** - Convert between MP4, AVI, MOV, MKV, WebM, FLV, WMV formats
- **Audio Converter** - Convert between MP3, WAV, FLAC, AAC, OGG, M4A formats
- **Image Converter** - Convert and resize JPG, PNG, WebP, AVIF, GIF, BMP images

### 👤 User Management
- Supabase authentication (Sign up, Login, Password reset)
- User profiles with subscription tiers
- Download history tracking
- Usage statistics and analytics

### 🎯 Subscription Tiers
- **Free Tier**: 5 downloads/day, 720p max resolution
- **Premium Tier**: Unlimited downloads, 4K resolution, priority processing
- **Enterprise Tier**: API access, custom branding, dedicated support

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **yt-dlp-wrap** - For reliable video downloads
- **FFmpeg** - For video/audio conversion
- **Sharp** - For image processing
- **Supabase** - Authentication and PostgreSQL database
- **Multer** - File upload handling

### Frontend
- **Next.js 14** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS**
- **Supabase SSR** - Client-side authentication

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- FFmpeg (for media conversion)
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/multidownloader.git
cd multidownloader
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
```

### 4. Supabase Setup
Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
1. Create a Supabase project
2. Run the database schema SQL
3. Set up Row Level Security policies
4. Get your API credentials

### 5. Install FFmpeg (Required for converters)

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

## 📁 Project Structure

```
multidownloader/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── types/           # TypeScript types
│   └── package.json
├── frontend/
│   ├── app/                 # Next.js pages
│   ├── components/          # React components
│   ├── contexts/            # React contexts
│   ├── lib/                 # Utility functions
│   └── package.json
├── SUPABASE_SETUP.md        # Database setup guide
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# FFmpeg (optional, auto-detects)
FFMPEG_PATH=ffmpeg
FFPROBE_PATH=ffprobe
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `POST /api/auth/reset-password` - Request password reset
- `GET /api/auth/me` - Get current user (protected)

### Download Endpoints
- `POST /api/download` - Start download job
- `POST /api/download/info` - Get video info without downloading
- `GET /api/download/file/:jobId` - Download completed file
- `GET /api/status/:jobId` - Get job status

### Conversion Endpoints
- `POST /api/convert/video` - Convert video format
- `POST /api/convert/audio` - Convert audio format
- `POST /api/convert/image` - Convert image format

## 🎨 Features in Detail

### Download Flow
1. User pastes URL
2. Click "Get Info" to preview video details
3. Select quality/format options
4. Download starts with progress tracking
5. File is streamed to browser

### Conversion Flow
1. User uploads file (drag & drop or click)
2. Select target format and quality
3. Conversion happens server-side with FFmpeg/Sharp
4. Progress updates in real-time
5. Converted file downloads automatically

### Authentication Flow
1. User signs up with email/password
2. Email verification sent (optional)
3. User can login and access premium features
4. Session managed via Supabase JWT tokens

## 🔒 Security Features

- Row Level Security (RLS) on all database tables
- JWT token verification for protected routes
- Rate limiting on API endpoints
- File size restrictions
- CORS configuration
- Environment variable protection

## 📊 Database Schema

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete schema including:
- User profiles
- Download history
- Conversion history
- Usage statistics

## 🚦 Rate Limiting

- Free tier: 100 requests per 15 minutes
- Downloads tracked per user per day
- Conversion limits based on subscription tier

## 🐛 Troubleshooting

### yt-dlp not found
yt-dlp is auto-downloaded on first use. If issues occur:
```bash
cd backend
npm install yt-dlp-wrap
```

### FFmpeg not found
Install FFmpeg system-wide or set `FFMPEG_PATH` in `.env`

### Port already in use
```bash
# Kill processes on ports 3000 and 5000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### Supabase connection issues
- Verify credentials in `.env` files
- Check Supabase project is active
- Ensure RLS policies are set up correctly

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Video download engine
- [FFmpeg](https://ffmpeg.org/) - Media conversion
- [Sharp](https://sharp.pixelplumbing.com/) - Image processing
- [Supabase](https://supabase.com/) - Authentication and database
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## ⚠️ Disclaimer

This tool is for personal use only. Please respect copyright laws and platform terms of service. Users are responsible for ensuring they have the right to download and convert content.

---

Made with ❤️ using Next.js, Express, and Supabase

Features & Functionality

Multi-Platform Downloads: Support video and media downloads from popular social media sites: YouTube (videos, playlists, shorts), Facebook (public and private videos, stories), Instagram (posts, Reels, IGTV), Pinterest (idea pins, videos), and others. Modern downloader projects support a wide range of platforms (e.g. YouTube, Facebook, Instagram, TikTok, Twitter, etc.)
dev.to
. Users just paste a public media URL and choose download options.

Quality & Format Options: After fetching a link, allow users to choose quality (up to 4K) and format. Provide format conversion for media: e.g. converting video to MP4 (or MKV/AVI), extracting audio to MP3, etc. Tools typically offer “quality selection (up to 4K)”, format conversion, and audio extraction
dev.to
. For example, allow YouTube video download in 720p, 1080p, or audio-only MP3.

Image Conversion Tools: Include image-format converters (e.g. JPG ⇄ PNG, BMP, GIF, WebP, AVIF). We can use Node image libraries like Sharp, which “converts large images in common formats to JPEG, PNG, WebP, GIF and AVIF” efficiently
github.com
. This enables features like resizing or format-change of uploaded or downloaded images.

Video/Audio Conversion: Integrate a video processing library (e.g. FFmpeg, via a Node wrapper like fluent-ffmpeg) to transcode media. FFmpeg is a powerful open-source framework for video/audio manipulation
medium.com
. For example, using fluent-ffmpeg in Node provides a fluent API to convert videos (change codecs, resolution) or extract audio
medium.com
medium.com
. This supports converting any downloaded or uploaded video into user-chosen formats (e.g. MP4 → AVI, or video → MP3).

Additional Tools: We can also bundle other popular utilities (PDF/image converters, meme generators, etc.) if desired. Any commonly used tool can be added similarly (e.g. PDF to Word conversion, image compression). Each tool is a separate API endpoint or microservice, but the overall UI will unify them under one “toolbox” interface.

Technology Stack

Frontend: React (preferably Next.js) for a responsive UI. Next.js offers server-side rendering and TypeScript support, but a plain React SPA is also fine. The UI will have input fields for links, quality selectors, and status/progress displays (e.g. using WebSockets or polling to show download progress).

Backend: Node.js with Express or NestJS. Use TypeScript for type safety (as done in similar projects
dev.to
). The backend exposes REST or GraphQL APIs. Key libraries include:

yt-dlp / youtube-dl / ytdl-core: For downloading videos. The ytdl-core Node module lets you download YouTube videos
singh-sandeep.medium.com
. For broader support (Instagram, Facebook, etc.), yt-dlp (a maintained fork of youtube-dl) can handle many sites. In fact, one project integrates yt-dlp for multi-site downloading
dev.to
.

Axios + Cheerio: For scraping media links when no API is available. For example, Instagram pages embed a direct MP4 URL in their HTML. A Node backend can fetch the page HTML via Axios and use Cheerio to parse it. (As one tutorial notes, viewing an Instagram page’s HTML reveals an MP4 link on Instagram’s CDN
adebola-niran.medium.com
.) Similarly, Pinterest and Facebook content may be scraped or accessed via data extractors.

Database (optional): If supporting user accounts or logging downloads, use a DB (PostgreSQL with an ORM like Prisma, as in example projects
dev.to
). Account data can track usage quotas, premium status, etc.

Conversion Libraries: Use Sharp for images
github.com
 and fluent-ffmpeg for video/audio
medium.com
. For audio-specific conversions (e.g. WAV ↔ MP3), FFmpeg handles all formats. These tasks run on the server, returning the converted file URL or directly streaming back to the client.

Architecture & Data Flow

Frontend Input: User pastes a link and selects desired action (download or conversion tool). For downloads, may select quality/format.

API Request: Frontend calls backend API (e.g. /api/download) with the URL and options. For conversion, calls relevant endpoint (e.g. /api/convert/image with an uploaded file).

Backend Processing:

Media Download: Depending on the domain, the backend uses the appropriate method:

YouTube: Use ytdl-core or yt-dlp to fetch video info and stream the video.

Instagram/Facebook/Pinterest: Scrape the page (Axios+Cheerio) to extract the direct media URL
adebola-niran.medium.com
, then download it. Or use API wrappers/actors (like Apify actors) that provide such links.

The server streams or buffers the media. For large files, consider streaming directly to the client or storing temporarily.

Format Conversion: After download (or with an uploaded file), run FFmpeg/Sharp as needed:

E.g. fluent-ffmpeg converts the video/audio with .output(outputPath).run().

Sharp resizes or re-encodes images (e.g., sharp(input).png().toFile(output)).

Progress & Response: The backend sends progress updates (via WebSocket or repeated GET requests) so the UI can show download/convert status. Once done, it provides a download link or initiates the file download for the user.

Security & Limits: Implement rate limiting on the API (e.g., max requests per minute) and per-user quotas (daily download limit, concurrent downloads)
dev.to
. Optionally require user accounts/API keys. Use IP throttling or session tracking to enforce free-tier limits (e.g. “free users get 5 downloads per day at 720p” – a common model). Use CORS and headers to secure the APIs.


Figure: High-level architecture – React/Next frontend calls Node.js API, which uses tools like yt-dlp, FFmpeg, and Sharp to process downloads and conversions.

Usage Flow

Download a Video: On the homepage, paste a YouTube/Instagram/etc link into the input box. The app queues the download. The user selects quality/format if applicable. Click “Download” and watch progress. When complete, the file (e.g. MP4 or MP3) is downloaded.

Convert a File: Navigate to a tool (e.g. “Image Converter” or “Video to MP3”). Upload the file or provide a link. Choose output format (e.g. JPG→PNG, MP4→MP3). Submit and download the converted file when ready.

Limits and Accounts: As a free user, you may only download a limited number of files per day (and limited resolution/speed). The site shows usage counters. Users can register or subscribe for a premium plan, which removes these limits (no ads, faster speeds, 1080p+ support).

Monetization

The site will use a freemium model. Free users see ads and face usage caps (downloads per day, speed or resolution caps). Premium subscribers pay a monthly fee to get unlimited downloads (higher resolutions like 1080p/4K), no ads, and faster bandwidth. Optionally offer one-off purchases or affiliate links. Collect analytics to monitor usage and guide tier limits.

Key Libraries & References

ytdl-core / yt-dlp: E.g., ytdl-core lets Node download YouTube videos
singh-sandeep.medium.com
. For broad support, yt-dlp (via a Node wrapper) can handle many platforms
dev.to
.

Sharp: “High speed Node-API module” for converting images (JPEG, PNG, WebP, GIF, AVIF)
github.com
. Use it for image format changes or resizing.

FFmpeg (fluent-ffmpeg): “Free and open-source” tool for video/audio encoding
medium.com
. In Node, fluent-ffmpeg provides a JS API to FFmpeg for conversions
medium.com
.

Axios & Cheerio: For sites without a clean API (like Instagram), scrape HTML: retrieve it with Axios and parse with Cheerio to extract media URLs
adebola-niran.medium.com
.

NestJS/Prisma (optional): Example backends use NestJS (a Node framework) with TypeScript and Prisma ORM for database
dev.to
. You can use plain Express instead, but TypeScript + an ORM can speed development and ensure data integrity.

Security Tools: Use Express/NestJS middleware for rate-limiting (e.g., express-rate-limit), CORS, and input sanitization.

Conclusion

This web app will serve as a unified downloader/converter toolbox, replacing legacy sites like multidownload.in with a modern, maintainable stack. Users benefit from a simple “paste URL → get file” interface and a variety of media tools. With a solid backend (handling the heavy lifting of downloads and conversion using proven libraries
dev.to
medium.com
github.com
) and a polished React frontend, the service will be robust and user-friendly. Proper rate-limiting and a premium option ensure sustainability and security