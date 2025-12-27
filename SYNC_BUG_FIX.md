# Plan & Usage Sync Bug Fix - Implementation Complete

## Problem Statement
- **Issue 1**: Changing a user's plan in the database (e.g., to "pro") did NOT reflect in the frontend account menu
- **Issue 2**: After a successful download, the navbar/account menu did NOT update the "X of Y downloads today" counter

## Root Causes Identified
1. Backend didn't validate download limits before allowing downloads
2. Backend didn't return updated usage counts after downloads
3. Frontend cache might have been serving stale data
4. Backend lacked the shared PLANS configuration (only frontend had it)

## Implemented Solution

### 1. ✅ Shared Plans Configuration
**File**: `backend/src/config/plans.ts` (NEW)

Created identical plans config for backend with:
- Type-safe `PlanId` and `PlanConfig` interfaces
- `PLANS` constant with free/pro/exclusive tiers
- Helper functions: `getPlan()`, `normalizePlanId()`, `getRemainingDownloads()`, `hasExceededLimit()`

### 2. ✅ Enhanced Backend Usage Service
**File**: `backend/src/services/usageService.ts` (UPDATED)

Added new functions:
- `getCurrentUsage(userId)` - Reads from both `profiles.downloads_today` and `usage_stats` table
- `getUserPlanFromDB(userId)` - Fetches user's plan and current usage from DB
- `canUserDownload(userId)` - Validates if user can download (hasn't exceeded limit)
- `recordDownloadUsage(userId)` - Now returns updated download count

### 3. ✅ Download Controller Validation & Response
**File**: `backend/src/controllers/downloadController.ts` (UPDATED)

Changes:
- **Before download**: Calls `canUserDownload()` to check daily limits
- **After download**: Records usage and includes `downloadsUsedToday` in job status
- Returns 403 error if user exceeded limit with clear message

### 4. ✅ Frontend Aggressive Cache Busting
**File**: `frontend/contexts/SubscriptionContext.tsx` (UPDATED)

Improvements:
- Added timestamp query parameter to prevent browser caching
- Added multiple cache-control headers (`Cache-Control`, `Pragma`, `Expires`)
- Ensured `cache: 'no-store'` is respected

### 5. ✅ Frontend Optimistic Updates
**Files**: 
- `frontend/components/DownloadForm.tsx` (UPDATED)
- `frontend/components/ProgressTracker.tsx` (ALREADY UPDATED)

Changes:
- When job status shows `downloadsUsedToday`, immediately refresh subscription
- Both download form and progress tracker call `refreshSubscription()` after success

## Database Schema (Already Exists)

```sql
-- profiles table stores per-user counters
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  subscription_tier TEXT DEFAULT 'free',
  plan_id TEXT DEFAULT 'free',
  downloads_today INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  ...
);

-- usage_stats table stores daily aggregates (user_id, date) unique constraint
CREATE TABLE usage_stats (
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  downloads_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  bandwidth_used BIGINT DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

-- Helper RPCs already exist:
-- increment_download_count(user_uuid) - Updates profiles.downloads_today
-- update_usage_stats(user_uuid, download_count, ...) - Upserts usage_stats
```

## Testing Checklist

### Test 1: Plan Change Sync
**Steps**:
1. Log into frontend as user (e.g., test@example.com)
2. Note current plan in navbar (should show "Free")
3. In Supabase SQL editor, run:
   ```sql
   UPDATE profiles SET plan_id = 'pro' WHERE email = 'test@example.com';
   ```
4. Refresh the frontend page
5. **Expected**: Navbar now shows "Pro" plan, "0/100 downloads today", "₹50/month"

**Why it works**: 
- `/api/me/subscription` queries `profiles.plan_id` with no cache
- Frontend uses aggressive cache-busting headers
- SubscriptionProvider re-fetches on auth change

### Test 2: Usage Counter Updates After Download
**Steps**:
1. Log into frontend as user
2. Note usage counter (e.g., "0/5 downloads today" for free plan)
3. Perform a successful download (paste YouTube URL, click download)
4. Wait for download to complete
5. **Expected**: Navbar updates to "1/5 downloads today" automatically

**Why it works**:
- `processDownload()` calls `recordDownloadUsage()` which increments DB
- Job status includes `downloadsUsedToday` field
- Frontend polls job status and calls `refreshSubscription()` on completion
- ProgressTracker also refreshes on completion

### Test 3: Download Limit Enforcement
**Steps**:
1. Set user to free plan (daily limit = 5)
2. Manually set downloads_today to 5:
   ```sql
   UPDATE profiles SET downloads_today = 5 WHERE email = 'test@example.com';
   UPDATE usage_stats SET downloads_count = 5 
   WHERE user_id = (SELECT id FROM profiles WHERE email = 'test@example.com')
   AND date = CURRENT_DATE;
   ```
3. Try to download another video
4. **Expected**: Error "Daily download limit (5) exceeded. Upgrade your plan or try again tomorrow."

**Why it works**:
- `initiateDownload()` calls `canUserDownload()` before creating job
- Returns 403 if `hasExceededLimit()` returns true

### Test 4: Concurrent Downloads (Race Condition Test)
**Steps**:
1. User at 4/5 downloads
2. Open two browser tabs
3. Start downloads simultaneously in both
4. **Expected**: One succeeds (5/5), other gets limit exceeded error

**Why it works**:
- Supabase RPC `update_usage_stats` uses `ON CONFLICT DO UPDATE` for atomic upsert
- Each check happens independently at request time

### Test 5: Unlimited Plan
**Steps**:
1. Set user to exclusive plan:
   ```sql
   UPDATE profiles SET plan_id = 'exclusive' WHERE email = 'test@example.com';
   ```
2. Refresh frontend
3. **Expected**: Navbar shows "Exclusive", "Unlimited downloads", "₹250/month"
4. Perform multiple downloads
5. **Expected**: All succeed, counter shows "X downloads today" (no limit)

**Why it works**:
- `exclusive.dailyLimit = null` in PLANS config
- `hasExceededLimit()` returns false for unlimited plans
- Frontend displays "Unlimited downloads" when `dailyLimit === null`

## API Response Examples

### GET /api/me/subscription
```json
{
  "planId": "pro",
  "plan": {
    "id": "pro",
    "label": "Pro",
    "priceMonthly": 50,
    "dailyLimit": 100,
    "features": ["Priority queueing", "All tools unlocked"],
    "toolAccess": "all"
  },
  "downloadsUsedToday": 3,
  "downloadsRemainingToday": 97
}
```

### GET /api/status/:jobId (after completion)
```json
{
  "success": true,
  "data": {
    "id": "job-abc123",
    "status": "completed",
    "progress": 100,
    "filePath": "/app/temp/video.mp4",
    "downloadUrl": "/api/download/file/job-abc123",
    "message": "Download completed successfully!",
    "downloadsUsedToday": 4
  }
}
```

### POST /api/download (limit exceeded)
```json
{
  "success": false,
  "error": "Daily download limit (5) exceeded. Upgrade your plan or try again tomorrow."
}
```

## Key Implementation Details

### Backend Flow
```
User initiates download
  ↓
Check auth (optional middleware)
  ↓
canUserDownload(userId)
  ├─ getUserPlanFromDB() → fetch plan_id from profiles
  ├─ getCurrentUsage() → read downloads_today + usage_stats
  └─ hasExceededLimit(plan, usage) → return allowed/denied
  ↓
[If denied] Return 403 error
  ↓
[If allowed] Create job, start processDownload()
  ↓
processDownload() completes
  ↓
recordDownloadUsage(userId) → increment both tables atomically
  ↓
Return updated downloadsUsedToday in job status
```

### Frontend Flow
```
User logs in
  ↓
SubscriptionProvider fetches /api/me/subscription
  ├─ No cache (cache: 'no-store', timestamp param, headers)
  └─ Store plan + usage in context
  ↓
Navbar/Account menu reads from useSubscription()
  ↓
User performs download
  ↓
Poll /api/status/:jobId every 1s
  ↓
When status = 'completed' and downloadsUsedToday present
  ↓
Call refreshSubscription() → re-fetch /api/me/subscription
  ↓
Context updates → Navbar re-renders with new count
```

## Debugging Tips

### If plan doesn't update after DB change:
1. Check browser DevTools Network tab
2. Verify `/api/me/subscription` returns new plan
3. Check for service worker caching (disable in DevTools)
4. Ensure Supabase RLS policies allow reading profiles
5. Verify `subscription_tier` or `plan_id` column was updated

### If usage counter doesn't update:
1. Check if `recordDownloadUsage()` is called (backend logs)
2. Verify Supabase RPCs executed successfully
3. Query `usage_stats` table directly:
   ```sql
   SELECT * FROM usage_stats 
   WHERE user_id = '<user-id>' 
   AND date = CURRENT_DATE;
   ```
4. Check if frontend calls `refreshSubscription()` (console logs)
5. Verify no errors in browser console

### If downloads aren't blocked at limit:
1. Verify `canUserDownload()` is called in `initiateDownload()`
2. Check backend logs for limit check results
3. Ensure `profiles.downloads_today` matches `usage_stats.downloads_count`
4. Verify `PLANS` config has correct `dailyLimit` values

## Files Modified

### Backend
- ✅ `backend/src/config/plans.ts` (NEW)
- ✅ `backend/src/services/usageService.ts`
- ✅ `backend/src/controllers/downloadController.ts`

### Frontend (Already Had Most Pieces)
- ✅ `frontend/contexts/SubscriptionContext.tsx`
- ✅ `frontend/components/DownloadForm.tsx`
- ✅ `frontend/components/ProgressTracker.tsx` (already updated)
- ✅ `frontend/app/api/me/subscription/route.ts` (already correct)
- ✅ `frontend/components/Navbar.tsx` (already using hook)

## Next Steps

1. **Build and Deploy Backend**:
   ```bash
   cd backend
   npm run build
   flyctl deploy
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Run Tests** (use checklist above)

4. **Monitor Logs**:
   - Backend: `flyctl logs`
   - Frontend: Vercel dashboard
   - Supabase: Database logs in dashboard

## Additional Enhancements (Future)

- [ ] Add WebSocket for real-time usage updates (no polling)
- [ ] Cache `/api/me/subscription` in Redis with 5-second TTL
- [ ] Add usage graphs/charts in ops-center
- [ ] Implement usage reset cron job (daily at midnight)
- [ ] Add usage alerts when nearing limit
- [ ] Track bandwidth usage per download

---

**Implementation Date**: November 26, 2025
**Status**: ✅ Complete - Ready for deployment and testing
