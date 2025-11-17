# MultiDownloader Frontend

Modern Next.js frontend for the MultiDownloader application - Download and convert media from any platform with ease.

## Features

- **Clean Modern UI**: Built with Tailwind CSS
- **Real-time Progress**: Live job status updates with progress bars
- **Multi-Platform**: Support for YouTube, Instagram, Facebook, Pinterest, and more
- **Quality Selection**: Choose video quality from 360p to 4K
- **Format Options**: Download as video or extract audio to MP3
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Type-Safe**: Full TypeScript implementation

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Fonts**: Inter (Google Fonts)

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with navbar/footer
│   ├── page.tsx            # Home page
│   ├── tools/
│   │   └── page.tsx        # Tools listing page
│   ├── pricing/
│   │   └── page.tsx        # Pricing plans page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation header
│   ├── Footer.tsx          # Footer component
│   ├── DownloadForm.tsx    # Main download form
│   └── ProgressTracker.tsx # Job progress component
├── public/                 # Static assets
├── .env.local.example      # Environment variables template
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5000` (or configure different URL)

### Installation Steps

1. **Navigate to frontend directory**:
   ```powershell
   cd frontend
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Configure environment variables**:
   ```powershell
   Copy-Item .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Run development server**:
   ```powershell
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## Running the Application

### Development Mode
```powershell
npm run dev
```
Hot-reload enabled at `http://localhost:3000`

### Production Build
```powershell
npm run build
npm start
```

### Linting
```powershell
npm run lint
```

### Formatting
```powershell
npm run format
```

## Pages

### Home Page (`/`)
- **Hero Section**: Eye-catching title and description
- **Download Form**: Paste URL, select quality/format, initiate download
- **Progress Tracker**: Real-time job status with progress bar
- **Features Section**: 3-card grid showcasing key features

### Tools Page (`/tools`)
- Grid of available conversion tools
- Video Downloader, Video to MP3, Video Converter
- Image Converter, Audio Converter, Image Resizer
- Call-to-action for Premium upgrade

### Pricing Page (`/pricing`)
- Side-by-side comparison of Free vs Premium tiers
- Feature lists with checkmarks
- Upgrade button (TODO: integrate payment)
- FAQ section

## Components

### DownloadForm
Main form for initiating downloads. Features:
- URL input with validation
- Action selection (Download Video / Extract Audio)
- Quality and format dropdowns
- Error handling and loading states
- Calls `/api/download` endpoint

### ProgressTracker
Displays job progress. Features:
- Polls `/api/status/:jobId` every 2 seconds
- Progress bar (0-100%)
- Status messages
- Download button when complete
- Error handling

### Navbar
Top navigation bar with:
- Logo/brand
- Links to Downloader, Tools, Pricing
- Login/Sign Up buttons (TODO: implement auth)
- Mobile menu toggle

### Footer
Footer with:
- Brand description
- Links to Products, Support, Legal
- Copyright notice

## Styling

Built with **Tailwind CSS**. Key design choices:
- **Color Scheme**: Blue primary (`blue-600`), purple accents
- **Typography**: Inter font family
- **Shadows**: Subtle shadows on cards (`shadow-lg`)
- **Hover Effects**: Scale transforms, color transitions
- **Responsive**: Mobile-first with `md:` breakpoints

### Custom Scrollbar
Styled scrollbar in `globals.css`:
```css
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { @apply bg-gray-200; }
::-webkit-scrollbar-thumb { @apply bg-gray-400 rounded-full; }
```

## API Integration

All API calls go through `axios` to backend at `NEXT_PUBLIC_API_URL`.

### Example: Initiating Download
```typescript
const response = await axios.post(`${API_URL}/download`, {
  url: 'https://youtube.com/watch?v=...',
  quality: '720',
  format: 'mp4',
  platform: 'auto',
});
const jobId = response.data.data.jobId;
```

### Example: Polling Status
```typescript
const interval = setInterval(async () => {
  const response = await axios.get(`${API_URL}/status/${jobId}`);
  setJob(response.data.data);
  if (response.data.data.status === 'completed') {
    clearInterval(interval);
  }
}, 2000);
```

## TODO: Future Enhancements

### Authentication
```typescript
// TODO: Implement user authentication
// - Login/Sign Up modals
// - JWT token storage
// - Protected routes
// - User dashboard
```

### Payment Integration
```typescript
// TODO: Integrate Stripe for premium subscriptions
// - Checkout flow
// - Subscription management
// - Usage tracking display
```

### Advanced Features
```typescript
// TODO: Additional features
// - Batch downloads
// - Download history
// - Favorite/saved URLs
// - Dark mode toggle
// - Language selection
```

### File Management
```typescript
// TODO: Better file handling
// - Direct file streaming
// - ZIP multiple downloads
// - Cloud storage integration
```

## Responsive Design

Breakpoints (Tailwind):
- **Mobile**: Default (< 768px)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)

Key responsive features:
- Stacked layout on mobile, grid on desktop
- Hidden navigation links on mobile (hamburger menu)
- Flexible card grids
- Responsive typography

## Performance Optimization

- **Next.js Image**: Use `next/image` for optimized images
- **Code Splitting**: Automatic with Next.js App Router
- **Static Generation**: Pages pre-rendered at build time
- **API Route Caching**: Configure in `next.config.js`

## Troubleshooting

### Cannot Connect to Backend
- Ensure backend is running on `http://localhost:5000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled on backend

### TypeScript Errors
The lint errors shown are due to missing `node_modules`. Run:
```powershell
npm install
```

### Build Fails
Clear cache and rebuild:
```powershell
Remove-Item -Recurse -Force .next
npm run build
```

### Port 3000 In Use
Change port:
```powershell
$env:PORT=3001; npm run dev
```

## License

MIT
