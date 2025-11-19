# MultiDownloads Backend - Deployment Guide

## Current Issue with Railway
Railway free tier has limitations and the "Application failed to respond" error suggests:
- Container might be crashing on startup
- Port binding issues
- Resource limits exceeded
- Health check timing out

## ✅ RECOMMENDED: Option 1 - Fly.io (Best Free Tier)

**Why Fly.io?**
- ✅ Better free tier than Railway
- ✅ Supports Docker with FFmpeg
- ✅ 3GB RAM, more reliable
- ✅ Better health checks
- ✅ Automatic scaling

### Deploy to Fly.io:
```bash
# 1. Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# 2. Login
fly auth login

# 3. Deploy (from project root)
fly launch --no-deploy
fly deploy

# 4. Set environment variables
fly secrets set YOUTUBE_COOKIES="your-cookies-here"
fly secrets set SUPABASE_URL="your-supabase-url"
fly secrets set SUPABASE_ANON_KEY="your-key"
fly secrets set CORS_ORIGIN="https://multidownloads.vercel.app"

# 5. Check status
fly status
fly logs
```

Your app will be at: `https://multidownloads-backend.fly.dev`

---

## Option 2 - Keep Render.com (Current)

**Pros:** Already working for downloaders
**Cons:** No FFmpeg on free tier (converters disabled)

**Keep using:** `https://multidownloads-backend.onrender.com/api`

---

## Option 3 - Fix Railway Deployment

### Troubleshooting Steps:

1. **Check Railway Logs:**
   - Go to Railway dashboard
   - Click on your service → Deployments → View Logs
   - Look for errors during startup

2. **Common Issues:**
   - Build failing (check Dockerfile)
   - Port not binding (ensure PORT env var)
   - Health check failing (increase timeout)
   - Out of memory (reduce processes)

3. **Railway Environment Variables Needed:**
```bash
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://multidownloads.vercel.app
YOUTUBE_COOKIES=<your-cookies>
SUPABASE_URL=<your-url>
SUPABASE_ANON_KEY=<your-key>
```

---

## Quick Decision Matrix

| Feature | Render | Railway | Fly.io |
|---------|--------|---------|--------|
| **Free Tier RAM** | 512MB | 512MB | 256MB-3GB |
| **FFmpeg Support** | ❌ | ❌ | ✅ |
| **Docker Support** | Paid only | ✅ | ✅ |
| **Reliability** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Setup Difficulty** | Easy | Easy | Medium |
| **Current Status** | ✅ Working | ❌ Error | 🔄 Not tried |

---

## 🎯 My Recommendation

**Use Fly.io** - It's the best free option with FFmpeg support and better reliability than Railway.

1. Keep your downloaders on Render (working now)
2. Deploy converters to Fly.io (with FFmpeg)
3. Use different API endpoints for each service

OR simply use **Fly.io for everything** and abandon Railway.

---

## Need Help?

Let me know which option you want to try, and I'll help you deploy step by step!
