# Vercel Deployment Guide

## Frontend Deployment (Already Done ✓)

Your frontend is deployed on Vercel. Here's what you need to configure:

### Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
NEXT_PUBLIC_SUPABASE_URL=https://rqptbifhpooswbyeqdmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxcHRiaWZocG9vc3dieWVxZG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzkxOTEsImV4cCI6MjA3ODk1NTE5MX0.jr0cVEf77MZl9ls4uMKfVn1vGefOwrft55Pw50hSozY
```

### Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain: `multidownload.in`
3. Configure DNS records as instructed by Vercel
4. Vercel will automatically provision SSL certificate

## Backend Deployment Options

### Option 1: Deploy Backend to Vercel (Recommended for your setup)

**Note**: Vercel serverless functions have limitations:
- Max execution time: 10 seconds (Hobby), 60 seconds (Pro)
- Not ideal for long-running video processing tasks

**Alternative for Backend**: Use Railway, Render, or DigitalOcean

### Option 2: Deploy Backend to Railway

1. Visit https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://multidownload.in
   SUPABASE_URL=https://rqptbifhpooswbyeqdmv.supabase.co
   SUPABASE_ANON_KEY=<your-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-key>
   ```
6. Railway will automatically deploy
7. Get your backend URL (e.g., `https://your-app.up.railway.app`)
8. Update frontend env: `NEXT_PUBLIC_API_URL=https://your-app.up.railway.app/api`

### Option 3: Deploy Backend to Render

1. Visit https://render.com
2. Sign up and click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
5. Add environment variables (same as above)
6. Deploy and get your URL

### Option 4: Deploy Backend to DigitalOcean App Platform

1. Visit https://cloud.digitalocean.com/apps
2. Click "Create App" → "GitHub"
3. Select repository and backend folder
4. Configure environment variables
5. Deploy

## Supabase Configuration for Vercel

### Update Redirect URLs in Supabase

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL**: `https://multidownload.in` (or your Vercel URL)
3. Add **Redirect URLs**:
   ```
   https://multidownload.in/*
   https://multidownload.in/auth/callback
   https://your-app.vercel.app/*
   https://your-app.vercel.app/auth/callback
   http://localhost:3000/* (for development)
   ```

## Update Your Configuration

### After Backend Deployment

1. Get your backend URL from Railway/Render/DO
2. Update in Vercel environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```
3. Update backend CORS:
   ```
   CORS_ORIGIN=https://multidownload.in
   ```
4. Redeploy both frontend and backend

## Vercel-Specific Files

### vercel.json (Optional - for advanced routing)

Create `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Current Setup Status

✅ Frontend deployed to Vercel
✅ Supabase configured
✅ All static assets created
✅ SEO optimized
⏳ Backend deployment needed
⏳ Environment variables need updating after backend deployment

## Quick Deploy Commands

### Frontend (Vercel CLI)
```bash
cd frontend
vercel --prod
```

### Backend (Railway CLI)
```bash
cd backend
railway up
```

## Important Notes

1. **File Processing**: Video downloads and conversions are CPU/memory intensive. Consider:
   - Railway/Render for better resource limits
   - Separate worker services for heavy processing
   - Cloud storage (S3, R2) for temporary files

2. **Environment Variables**: Never commit `.env` files!
   - Use Vercel/Railway dashboard to set them
   - Keep production and development separate

3. **CORS**: After backend deployment, update `CORS_ORIGIN` to your Vercel frontend URL

4. **Monitoring**: 
   - Vercel: Built-in analytics
   - Railway/Render: Built-in metrics
   - Consider Sentry for error tracking

## Testing Checklist

After deployment:
- [ ] Frontend loads at your domain
- [ ] User signup/login works
- [ ] Video download functionality works
- [ ] File conversion tools work
- [ ] All 29 tools accessible
- [ ] Privacy/Terms pages load
- [ ] Contact form works
- [ ] Mobile responsive
- [ ] SSL certificate active

## Need Help?

Check logs:
- Vercel: Dashboard → Deployments → View Function Logs
- Railway: Dashboard → Deployments → View Logs
- Render: Dashboard → Logs tab

Your frontend is already deployed! Just need to deploy the backend and update the API URL. 🚀
