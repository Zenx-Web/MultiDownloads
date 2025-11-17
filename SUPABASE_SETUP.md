# Supabase Database Schema

## Overview
This document describes the database schema for the MultiDownloader application using Supabase PostgreSQL database.

## Setup Instructions

### 1. Enable Row Level Security (RLS)
All tables should have RLS enabled for security.

### 2. Create Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  downloads_today INTEGER DEFAULT 0,
  total_downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Download History Table
CREATE TABLE IF NOT EXISTS download_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'instagram', 'facebook', 'tiktok', 'other')),
  file_type TEXT NOT NULL CHECK (file_type IN ('video', 'audio', 'image')),
  file_size BIGINT,
  resolution TEXT,
  format TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversion History Table
CREATE TABLE IF NOT EXISTS conversion_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_format TEXT NOT NULL,
  target_format TEXT NOT NULL,
  conversion_type TEXT NOT NULL CHECK (conversion_type IN ('video', 'audio', 'image')),
  file_size BIGINT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Statistics Table (for analytics)
CREATE TABLE IF NOT EXISTS usage_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  downloads_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  bandwidth_used BIGINT DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_download_history_user_id ON download_history(user_id);
CREATE INDEX idx_download_history_created_at ON download_history(created_at DESC);
CREATE INDEX idx_conversion_history_user_id ON conversion_history(user_id);
CREATE INDEX idx_conversion_history_created_at ON conversion_history(created_at DESC);
CREATE INDEX idx_usage_stats_user_date ON usage_stats(user_id, date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Set Up Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profiles are created automatically on signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Download history policies
CREATE POLICY "Users can view their own download history"
  ON download_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own download history"
  ON download_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Conversion history policies
CREATE POLICY "Users can view their own conversion history"
  ON conversion_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversion history"
  ON conversion_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usage stats policies
CREATE POLICY "Users can view their own usage stats"
  ON usage_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage stats"
  ON usage_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage stats"
  ON usage_stats FOR UPDATE
  USING (auth.uid() = user_id);
```

### 4. Create Profile Automatically on Signup

```sql
-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Helper Functions

```sql
-- Function to reset daily download count
CREATE OR REPLACE FUNCTION reset_daily_downloads()
RETURNS void AS $$
BEGIN
  UPDATE profiles SET downloads_today = 0;
END;
$$ LANGUAGE plpgsql;

-- Function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(user_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    downloads_today = downloads_today + 1,
    total_downloads = total_downloads + 1
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to update usage stats
CREATE OR REPLACE FUNCTION update_usage_stats(
  user_uuid UUID,
  download_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  bandwidth BIGINT DEFAULT 0
)
RETURNS void AS $$
BEGIN
  INSERT INTO usage_stats (user_id, date, downloads_count, conversions_count, bandwidth_used)
  VALUES (user_uuid, CURRENT_DATE, download_count, conversion_count, bandwidth)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    downloads_count = usage_stats.downloads_count + download_count,
    conversions_count = usage_stats.conversions_count + conversion_count,
    bandwidth_used = usage_stats.bandwidth_used + bandwidth;
END;
$$ LANGUAGE plpgsql;
```

## Table Descriptions

### profiles
Stores user profile information and subscription details.
- `id`: User UUID (references auth.users)
- `email`: User email address
- `full_name`: User's full name
- `avatar_url`: Profile picture URL
- `subscription_tier`: free, premium, or enterprise
- `downloads_today`: Count of downloads today (resets daily)
- `total_downloads`: Lifetime download count

### download_history
Tracks all download operations.
- `user_id`: User who performed the download
- `url`: Original URL
- `platform`: youtube, instagram, facebook, tiktok
- `file_type`: video, audio, image
- `file_size`: Size in bytes
- `resolution`: Video resolution (e.g., 1080p)
- `format`: File format (mp4, mp3, etc.)
- `status`: pending, processing, completed, failed

### conversion_history
Tracks all file conversion operations.
- `user_id`: User who performed the conversion
- `source_format`: Original file format
- `target_format`: Converted file format
- `conversion_type`: video, audio, image
- `file_size`: Size in bytes
- `status`: pending, processing, completed, failed

### usage_stats
Aggregated daily usage statistics for analytics.
- `user_id`: User UUID
- `date`: Date of usage
- `downloads_count`: Number of downloads
- `conversions_count`: Number of conversions
- `bandwidth_used`: Total bandwidth in bytes

## Subscription Tiers

### Free Tier
- 5 downloads per day
- Max resolution: 720p
- 2 concurrent downloads

### Premium Tier (Future)
- Unlimited downloads
- Max resolution: 4K (2160p)
- 10 concurrent downloads
- No ads
- Priority processing

### Enterprise Tier (Future)
- Everything in Premium
- API access
- Custom branding
- Dedicated support

## Cron Jobs (Recommended)

Set up the following cron job in Supabase to reset daily limits:

```sql
-- This should run daily at midnight UTC
SELECT cron.schedule(
  'reset-daily-downloads',
  '0 0 * * *',
  $$ SELECT reset_daily_downloads(); $$
);
```

## Environment Variables Required

Add these to your `.env` file:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing
3. Go to Settings → API
4. Copy:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## Testing the Setup

After setting up, test with:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

Then navigate to `http://localhost:3000` and try signing up!
