# Proxy Setup Guide for YouTube Downloads

## Problem
YouTube blocks requests from datacenter IPs (Fly.io, Railway, AWS, etc.) to prevent bot scraping. This is why it worked on Render initially but then got blocked.

## Permanent Solution: Use Proxies

### Option 1: Free Proxy Rotation (Quick Test)
Use free proxy lists (unreliable but free):

```bash
# Set proxy in Fly.io
flyctl secrets set PROXY_URL="http://proxy-ip:port" --app multidownloads-backend

# Example with free proxy
flyctl secrets set PROXY_URL="http://185.199.229.156:7492" --app multidownloads-backend
```

**Free Proxy Sources:**
- https://free-proxy-list.net/
- https://www.proxy-list.download/
- https://www.sslproxies.org/

⚠️ **Warning:** Free proxies are slow, unreliable, and may not work

### Option 2: Paid Residential Proxy Services (Recommended)

#### 1. **Bright Data (formerly Luminati)** - Best Quality
- Cost: $500/mo for 20GB (residential)
- Setup:
```bash
flyctl secrets set PROXY_URL="http://username-session-rand:password@zproxy.lum-superproxy.io:22225" --app multidownloads-backend
```

#### 2. **Smartproxy** - Affordable
- Cost: $50/mo for 5GB (residential)
- Setup:
```bash
flyctl secrets set PROXY_URL="http://username:password@gate.smartproxy.com:7000" --app multidownloads-backend
```

#### 3. **Webshare.io** - Budget Friendly
- Cost: $5/mo for 250 proxies (datacenter)
- Setup:
```bash
flyctl secrets set PROXY_URL="http://username:password@proxy.webshare.io:80" --app multidownloads-backend
```

#### 4. **ProxyMesh** - Rotating Proxies
- Cost: $10/mo for 10 rotating proxies
- Setup:
```bash
flyctl secrets set PROXY_URL="http://username:password@us-wa.proxymesh.com:31280" --app multidownloads-backend
```

### Option 3: SOCKS5 Proxy (If you have access)

```bash
flyctl secrets set PROXY_URL="socks5://username:password@proxy-ip:port" --app multidownloads-backend
```

### Option 4: Deploy on Different Platform

YouTube may not have blocked these platforms yet:
1. **Railway** (try again - new IP)
2. **Digital Ocean App Platform**
3. **Heroku** (paid tiers)
4. **Your own VPS** with residential IP

## How to Apply Proxy

### Step 1: Get Proxy Credentials
Sign up for any proxy service above and get:
- Proxy server address
- Port
- Username (if required)
- Password (if required)

### Step 2: Set Proxy in Fly.io

```bash
# Format: http://username:password@proxy-server:port
# or just: http://proxy-server:port (if no auth)

flyctl secrets set PROXY_URL="http://your-proxy-url:port" --app multidownloads-backend
```

### Step 3: Deploy
The backend code already supports proxies, just deploy:

```bash
flyctl deploy --app multidownloads-backend
```

### Step 4: Test
Try downloading a YouTube video - it should work through the proxy now!

## Best Recommendation

For a production app with paying users:
1. Start with **Webshare.io** ($5/mo) - cheapest test
2. If that works well, upgrade to **Smartproxy** ($50/mo) for better reliability
3. For high volume (1000+ downloads/day), use **Bright Data**

For free/testing:
1. Try free proxies from free-proxy-list.net
2. Or redeploy to Railway and see if you get a clean IP

## Why This is Permanent

- Proxies rotate your IP address
- YouTube can't ban a constantly changing IP
- Residential proxies look like real users
- Works reliably for commercial use

## Alternative: Remove Cookies Dependency

Another option is to **remove all YouTube features** and only support platforms that don't block:
- Instagram
- Facebook
- Twitter/X
- TikTok
- Vimeo

These platforms are less aggressive with blocking.
