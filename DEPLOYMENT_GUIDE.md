# Production Deployment Configuration Guide

## Domain Setup: multidownload.in

### 1. DNS Configuration

Set up the following DNS records in your domain registrar:

```
Type    Name    Value                           TTL
A       @       <your-server-ip>                3600
A       www     <your-server-ip>                3600
CNAME   api     <backend-server-domain>         3600
```

### 2. SSL/TLS Certificates

Install SSL certificates for:
- `multidownload.in`
- `www.multidownload.in`
- `api.multidownload.in`

Using Certbot (Let's Encrypt):
```bash
sudo certbot --nginx -d multidownload.in -d www.multidownload.in -d api.multidownload.in
```

### 3. Supabase Configuration

Your Supabase project is already configured:
- **Project URL**: `https://rqptbifhpooswbyeqdmv.supabase.co`
- **Anon Key**: Already set in environment files
- **Service Role Key**: Configured in backend `.env`

#### Supabase Authentication Settings

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL**: `https://multidownload.in`
3. Add **Redirect URLs**:
   - `https://multidownload.in/*`
   - `https://www.multidownload.in/*`
   - `http://localhost:3000/*` (for development)

#### Email Templates

Configure email templates in Supabase Dashboard → Authentication → Email Templates:
- Confirmation email
- Magic link email
- Password recovery email
- Email change notification

Use your domain in all email links: `https://multidownload.in`

### 4. Environment Configuration

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://multidownload.in
SUPABASE_URL=https://rqptbifhpooswbyeqdmv.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.multidownload.in/api
NEXT_PUBLIC_SUPABASE_URL=https://rqptbifhpooswbyeqdmv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 5. Server Setup

#### Backend Server (Node.js/Express)

**Install PM2** (Process Manager):
```bash
npm install -g pm2
```

**Start Backend**:
```bash
cd backend
npm install
npm run build
pm2 start dist/index.js --name "multidownload-api"
pm2 save
pm2 startup
```

**Nginx Configuration** (for backend at api.multidownload.in):
```nginx
server {
    listen 80;
    server_name api.multidownload.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.multidownload.in;

    ssl_certificate /etc/letsencrypt/live/api.multidownload.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.multidownload.in/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend Server (Next.js)

**Build Frontend**:
```bash
cd frontend
npm install
npm run build
```

**Start with PM2**:
```bash
pm2 start npm --name "multidownload-web" -- start
pm2 save
```

**Nginx Configuration** (for frontend at multidownload.in):
```nginx
server {
    listen 80;
    server_name multidownload.in www.multidownload.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name multidownload.in www.multidownload.in;

    ssl_certificate /etc/letsencrypt/live/multidownload.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/multidownload.in/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Database Setup (Supabase)

#### Required Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free',
    downloads_today INTEGER DEFAULT 0,
    downloads_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Download history
CREATE TABLE public.download_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    url TEXT NOT NULL,
    platform TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT,
    resolution TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
    ON public.download_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads"
    ON public.download_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Conversion history
CREATE TABLE public.conversion_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    tool_name TEXT NOT NULL,
    input_format TEXT NOT NULL,
    output_format TEXT NOT NULL,
    file_size BIGINT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.conversion_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversions"
    ON public.conversion_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversions"
    ON public.conversion_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 7. Google AdSense Setup

1. **Apply for AdSense**:
   - Visit https://www.google.com/adsense
   - Submit your website: `https://multidownload.in`
   - Wait for approval (typically 1-2 weeks)

2. **Add AdSense Code**:
   - Once approved, add the AdSense script to `app/layout.tsx`:

```tsx
<head>
  {/* ... existing head content ... */}
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-PUBLISHER-ID"
    crossOrigin="anonymous"
  />
</head>
```

3. **Create Ad Units**:
   - Display ads on homepage
   - In-article ads on tool pages
   - Sidebar ads (if applicable)

### 8. SEO Verification

Add verification meta tags to `app/layout.tsx`:

```tsx
verification: {
  google: 'your-google-search-console-verification-code',
  yandex: 'your-yandex-verification-code',
  bing: 'your-bing-verification-code',
}
```

**Google Search Console**:
1. Visit https://search.google.com/search-console
2. Add property: `https://multidownload.in`
3. Submit sitemap: `https://multidownload.in/sitemap.xml`

**Bing Webmaster Tools**:
1. Visit https://www.bing.com/webmasters
2. Add site: `https://multidownload.in`
3. Submit sitemap

### 9. Monitoring & Analytics

#### Google Analytics 4
Add to `app/layout.tsx`:

```tsx
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-YOUR-MEASUREMENT-ID"
/>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YOUR-MEASUREMENT-ID');
    `,
  }}
/>
```

#### PM2 Monitoring
```bash
pm2 monit
pm2 logs multidownload-api
pm2 logs multidownload-web
```

### 10. Security Checklist

- [x] SSL certificates installed
- [x] HTTPS redirect enabled
- [x] CORS configured properly
- [x] Rate limiting enabled
- [x] File size limits set
- [x] Supabase RLS policies enabled
- [x] Environment variables secured
- [x] API keys not exposed to client
- [ ] Security headers configured (add to Nginx)
- [ ] Regular backups scheduled

**Add Security Headers** (Nginx):
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### 11. Performance Optimization

#### Enable Caching (Nginx):
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Enable Gzip Compression:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

### 12. Maintenance Scripts

Create `scripts/maintenance.sh`:
```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Restart services
pm2 restart all

# Renew SSL certificates
sudo certbot renew

# Clean temp files
rm -rf /path/to/backend/temp/*

# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

echo "Maintenance complete!"
```

### 13. Deployment Checklist

- [x] Domain DNS configured
- [x] SSL certificates installed
- [x] Environment files updated with production URLs
- [x] Supabase redirect URLs configured
- [x] Backend deployed and running
- [x] Frontend deployed and running
- [x] Database tables created
- [ ] Google AdSense applied
- [ ] Google Analytics added
- [ ] Search Console configured
- [ ] Sitemap submitted
- [ ] Privacy policy live
- [ ] Terms & conditions live
- [ ] Contact form tested

### 14. Going Live

```bash
# Backend
cd backend
npm run build
pm2 start dist/index.js --name multidownload-api
pm2 save

# Frontend
cd frontend
npm run build
pm2 start npm --name multidownload-web -- start
pm2 save

# Verify services
pm2 status
```

### 15. Post-Launch Monitoring

Check these URLs after deployment:
- https://multidownload.in (homepage)
- https://multidownload.in/about
- https://multidownload.in/contact
- https://multidownload.in/privacy
- https://multidownload.in/terms
- https://multidownload.in/sitemap.xml
- https://multidownload.in/robots.txt
- https://api.multidownload.in/api/health (health check endpoint)

Test functionality:
- User registration/login
- Video download
- File conversion
- All 29 tools

---

## Quick Start Commands

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Build both
cd backend && npm run build
cd ../frontend && npm run build

# Start with PM2
pm2 start ecosystem.config.js
```

---

**Your site is now configured for production at https://multidownload.in!** 🚀
