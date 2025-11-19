# Deploy to Fly.io

## Prerequisites
- Fly.io account (sign up at https://fly.io)
- Fly CLI installed

## Installation Steps

### 1. Install Fly CLI (Windows PowerShell)
```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2. Login to Fly.io
```bash
fly auth login
```

### 3. Launch your app
```bash
cd "c:\Users\Maac Panbazar\Desktop\multidowload tool"
fly launch --no-deploy
```

When prompted:
- App name: `multidownloads-backend` (or choose your own)
- Region: Choose closest to you (e.g., `iad` for US East)
- Database: No
- Redis: No

### 4. Set Environment Variables
```bash
fly secrets set YOUTUBE_COOKIES="paste-your-cookies-here"
fly secrets set SUPABASE_URL="https://rqptbifhpooswbyeqdmv.supabase.co"
fly secrets set SUPABASE_ANON_KEY="your-supabase-anon-key"
fly secrets set CORS_ORIGIN="https://multidownloads.vercel.app"
```

### 5. Deploy
```bash
fly deploy
```

### 6. Check Status
```bash
fly status
fly logs
fly open
```

## Your API URL
After deployment, your API will be available at:
```
https://multidownloads-backend.fly.dev/api
```

## Update Frontend
Update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://multidownloads-backend.fly.dev/api
```

## Useful Commands
```bash
# View logs
fly logs

# Check app status
fly status

# SSH into your app
fly ssh console

# Scale app (if needed)
fly scale count 1

# Restart app
fly apps restart multidownloads-backend
```

## Troubleshooting
If deployment fails:
1. Check logs: `fly logs`
2. Verify Dockerfile builds: `docker build -f Dockerfile .`
3. Check fly.toml configuration
4. Ensure all secrets are set: `fly secrets list`
