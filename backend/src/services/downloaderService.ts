import YTDlpWrap from 'yt-dlp-wrap';
import * as fs from 'fs';
import * as path from 'path';
import { Platform } from '../types';
import { config } from '../config';
import { updateJob } from './jobService';
import { sanitizeFilename } from './urlService';

// Initialize yt-dlp wrapper
let ytDlpWrap: YTDlpWrap;

// Detect if we're in production (Docker/Fly.io) or development
const isProduction = process.env.NODE_ENV === 'production';
const isWindows = process.platform === 'win32';

// In production (Docker), use system yt-dlp. In development, use local binary
const ytDlpPath = isProduction 
  ? '/usr/local/bin/yt-dlp'  // System binary in Docker
  : path.join(__dirname, '../../', isWindows ? 'yt-dlp.exe' : 'yt-dlp');

// Ensure yt-dlp binary is available
const ensureYtDlp = async (): Promise<YTDlpWrap> => {
  if (ytDlpWrap) {
    return ytDlpWrap;
  }

  // In production, verify system binary exists
  if (isProduction) {
    if (!fs.existsSync(ytDlpPath)) {
      throw new Error('yt-dlp binary not found in production environment');
    }
    console.log('✓ Using system yt-dlp from Docker image');
    ytDlpWrap = new YTDlpWrap(ytDlpPath);
    return ytDlpWrap;
  }

  // In development, download if needed
  if (!fs.existsSync(ytDlpPath)) {
    console.log(`Downloading yt-dlp binary for ${process.platform}...`);
    try {
      await YTDlpWrap.downloadFromGithub(ytDlpPath);
      
      // Make executable on Unix systems
      if (!isWindows) {
        fs.chmodSync(ytDlpPath, '755');
      }
      
      console.log('✓ yt-dlp downloaded successfully');
    } catch (error) {
      console.error('✗ Failed to download yt-dlp:', error);
      throw new Error('Failed to initialize yt-dlp downloader');
    }
  } else {
    console.log('✓ Using existing yt-dlp binary');
  }

  ytDlpWrap = new YTDlpWrap(ytDlpPath);
  return ytDlpWrap;
};

/**
 * Ensure cookies are available for YouTube downloads
 */
const ensureCookies = (): { hasCookies: boolean; cookiesPath: string } => {
  const cookiesPath = path.join(__dirname, '../../cookies.txt');
  let hasCookies = fs.existsSync(cookiesPath);
  
  // If no file, try to create from environment variable
  if (!hasCookies && process.env.YOUTUBE_COOKIES) {
    try {
      fs.writeFileSync(cookiesPath, process.env.YOUTUBE_COOKIES);
      hasCookies = true;
      console.log('✓ Created cookies.txt from YOUTUBE_COOKIES environment variable');
    } catch (error) {
      console.warn('✗ Failed to write cookies from env:', error);
    }
  } else if (hasCookies) {
    console.log('✓ Using existing cookies.txt file');
  } else {
    console.warn('⚠ No YouTube cookies available - may encounter bot detection');
  }
  
  return { hasCookies, cookiesPath };
};

/**
 * Download video from YouTube using yt-dlp
 */
export const downloadYouTubeVideo = async (
  url: string,
  quality: string,
  format: string,
  jobId: string,
  userCookies?: string
): Promise<string> => {
  try {
    updateJob(jobId, { progress: 5, status: 'processing', message: 'Validating YouTube URL...' });

    // Basic YouTube URL validation (includes YouTube Music)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com)\/.+$/;
    if (!youtubeRegex.test(url)) {
      throw new Error('Invalid YouTube URL');
    }

    updateJob(jobId, { progress: 10, message: 'Initializing downloader...' });

    // Initialize yt-dlp with auto-download
    const ytDlp = await ensureYtDlp();
    
    // Ensure temp directory exists
    if (!fs.existsSync(config.storage.tempDir)) {
      fs.mkdirSync(config.storage.tempDir, { recursive: true });
    }

    // Setup cookies for YouTube
    let cookiesPath: string | undefined;
    let hasCookies = false;
    
    if (userCookies) {
      // Use user-provided cookies
      const tempCookiePath = path.join(config.storage.tempDir, `user_cookies_${jobId}.txt`);
      fs.writeFileSync(tempCookiePath, userCookies);
      cookiesPath = tempCookiePath;
      hasCookies = true;
      console.log('✓ Using user-provided cookies for download');
    } else {
      // Fall back to environment cookies
      const envCookies = ensureCookies();
      cookiesPath = envCookies.cookiesPath;
      hasCookies = envCookies.hasCookies;
    }

    // Get video info with bypass options
    updateJob(jobId, { progress: 15, message: 'Fetching video information...' });
    
    const infoOptions = [
      '--dump-json',
      '--no-check-certificate',
      '--no-warnings',
      '--extractor-args', 'youtube:player_client=ios,web,mweb',
      '--extractor-args', 'youtube:skip=translated_subs,dash,hls',
      '--user-agent', 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
      '--geo-bypass',
      '--force-ipv4',
      '--socket-timeout', '30',
      '--extractor-retries', '10',
      '--fragment-retries', '10',
    ];
    
    if (hasCookies) {
      infoOptions.push('--cookies', cookiesPath);
    }
    
    const infoJson = await ytDlp.execPromise([url, ...infoOptions]);
    const info = JSON.parse(infoJson);
    
    const title = sanitizeFilename(info.title || 'video');
    const outputFilename = `${jobId}_${title}`;
    const outputPath = path.join(config.storage.tempDir, `${outputFilename}.${format}`);

    updateJob(jobId, { progress: 20, message: `Downloading: ${info.title?.substring(0, 50) || 'video'}...` });

    // Configure download options with enhanced bot bypass
    const downloadOptions: string[] = [
      '--progress',
      '--newline',
      '--no-check-certificate',
      '--no-warnings',
      '--extractor-args', 'youtube:player_client=ios,web,mweb,android',
      '--extractor-args', 'youtube:skip=translated_subs,dash,hls',
      '--user-agent', 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
      '--geo-bypass',
      '--force-ipv4',
      '--sleep-requests', '0.5',
      '--extractor-retries', '10',
      '--fragment-retries', '10',
      '--socket-timeout', '30',
      '--throttled-rate', '100K',
      '-o', path.join(config.storage.tempDir, `${outputFilename}.%(ext)s`),
    ];

    // Add cookies if available
    if (hasCookies) {
      downloadOptions.push('--cookies', cookiesPath);
    }

    if (format === 'mp3') {
      // Extract audio only
      downloadOptions.push(
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0'
      );
    } else if (format === 'mp4') {
      // Download video with quality constraint
      const qualityMap: { [key: string]: string } = {
        '144p': 'worst[height<=144]',
        '240p': 'worst[height<=240]',
        '360p': 'best[height<=360]',
        '480p': 'best[height<=480]',
        '720p': 'best[height<=720]',
        '1080p': 'best[height<=1080]',
      };
      
      const formatSelector = qualityMap[quality] || 'best[height<=720]';
      downloadOptions.push(
        '-f', `${formatSelector}/best`,
        '--merge-output-format', 'mp4'
      );
    }

    // Execute download with progress tracking
    const ytDlpProcess = ytDlp.exec([url, ...downloadOptions]);
    
    let lastProgress = 20;
    
    return new Promise((resolve, reject) => {
      ytDlpProcess.on('progress', (progress) => {
        if (progress.percent) {
          const downloadProgress = Math.min(Math.floor(progress.percent * 0.7) + 20, 90);
          if (downloadProgress > lastProgress) {
            lastProgress = downloadProgress;
            updateJob(jobId, { 
              progress: downloadProgress, 
              status: 'processing',
              message: `Downloading... ${progress.percent.toFixed(1)}%`
            });
          }
        }
      });

      ytDlpProcess.on('ytDlpEvent', (eventType, eventData) => {
        if (eventType === 'download' && eventData) {
          console.log('Download event:', eventData);
        }
      });

      ytDlpProcess.on('close', (code) => {
        if (code === 0) {
          updateJob(jobId, { progress: 95, message: 'Finalizing download...' });
          
          // The file might have a different extension, find it
          const files = fs.readdirSync(config.storage.tempDir);
          const downloadedFile = files.find(f => f.startsWith(outputFilename));
          
          if (downloadedFile) {
            const actualPath = path.join(config.storage.tempDir, downloadedFile);
            
            // Rename if needed to match expected format
            if (actualPath !== outputPath) {
              try {
                fs.renameSync(actualPath, outputPath);
                resolve(outputPath);
              } catch (renameError) {
                // If rename fails, just use the actual path
                resolve(actualPath);
              }
            } else {
              resolve(outputPath);
            }
          } else {
            reject(new Error('Download completed but file not found'));
          }
        } else {
          reject(new Error(`Download failed with exit code ${code}`));
        }
      });

      ytDlpProcess.on('error', (error) => {
        try {
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch {}
        reject(new Error(`YouTube download failed: ${error.message}`));
      });
    });
  } catch (error) {
    throw new Error(`YouTube download failed: ${(error as Error).message}`);
  }
};

/**
 * Download video from Instagram using yt-dlp
 */
export const downloadInstagramVideo = async (
  url: string,
  jobId: string
): Promise<string> => {
  try {
    updateJob(jobId, { progress: 10, status: 'processing', message: 'Initializing Instagram downloader...' });

    // Initialize yt-dlp (it supports Instagram)
    const ytDlp = await ensureYtDlp();

    updateJob(jobId, { progress: 20, message: 'Fetching Instagram media...' });

    // Get video info
    const info = await ytDlp.getVideoInfo(url);
    const title = sanitizeFilename(info.title || 'instagram_video');
    const outputFilename = `${jobId}_${title}`;
    const outputPath = path.join(config.storage.tempDir, `${outputFilename}.mp4`);

    updateJob(jobId, { progress: 40, message: 'Downloading...' });

    // Ensure temp directory exists
    if (!fs.existsSync(config.storage.tempDir)) {
      fs.mkdirSync(config.storage.tempDir, { recursive: true });
    }

    // Download with yt-dlp
    const downloadOptions: string[] = [
      '--progress',
      '--newline',
      '-o', path.join(config.storage.tempDir, `${outputFilename}.%(ext)s`),
      '-f', 'best',
    ];

    const ytDlpProcess = ytDlp.exec([url, ...downloadOptions]);
    
    let lastProgress = 40;

    return new Promise((resolve, reject) => {
      ytDlpProcess.on('progress', (progress) => {
        if (progress.percent) {
          const downloadProgress = Math.min(Math.floor(40 + progress.percent * 0.5), 90);
          if (downloadProgress > lastProgress) {
            lastProgress = downloadProgress;
            updateJob(jobId, { 
              progress: downloadProgress, 
              status: 'processing',
              message: `Downloading... ${progress.percent.toFixed(1)}%`
            });
          }
        }
      });

      ytDlpProcess.on('close', (code) => {
        if (code === 0) {
          updateJob(jobId, { progress: 95, message: 'Finalizing...' });
          
          // Find the downloaded file
          const files = fs.readdirSync(config.storage.tempDir);
          const downloadedFile = files.find(f => f.startsWith(outputFilename));
          
          if (downloadedFile) {
            const actualPath = path.join(config.storage.tempDir, downloadedFile);
            
            // Rename to .mp4 if needed
            if (actualPath !== outputPath) {
              try {
                fs.renameSync(actualPath, outputPath);
                resolve(outputPath);
              } catch {
                resolve(actualPath);
              }
            } else {
              resolve(outputPath);
            }
          } else {
            reject(new Error('Download completed but file not found'));
          }
        } else {
          reject(new Error(`Instagram download failed with exit code ${code}`));
        }
      });

      ytDlpProcess.on('error', (error) => {
        try {
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch {}
        reject(new Error(`Instagram download failed: ${error.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Instagram download failed: ${(error as Error).message}`);
  }
};

/**
 * Download video from Facebook using yt-dlp
 */
export const downloadFacebookVideo = async (
  url: string,
  jobId: string
): Promise<string> => {
  try {
    updateJob(jobId, { progress: 10, status: 'processing', message: 'Initializing Facebook downloader...' });

    // Initialize yt-dlp (it supports Facebook)
    const ytDlp = await ensureYtDlp();

    updateJob(jobId, { progress: 20, message: 'Fetching Facebook media...' });

    // Get video info
    const info = await ytDlp.getVideoInfo(url);
    const title = sanitizeFilename(info.title || 'facebook_video');
    const outputFilename = `${jobId}_${title}`;
    const outputPath = path.join(config.storage.tempDir, `${outputFilename}.mp4`);

    updateJob(jobId, { progress: 40, message: 'Downloading...' });

    // Ensure temp directory exists
    if (!fs.existsSync(config.storage.tempDir)) {
      fs.mkdirSync(config.storage.tempDir, { recursive: true });
    }

    // Download with yt-dlp
    const downloadOptions: string[] = [
      '--progress',
      '--newline',
      '--no-check-certificate',
      '--no-warnings',
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '-o', path.join(config.storage.tempDir, `${outputFilename}.%(ext)s`),
      '-f', 'best',
    ];

    const ytDlpProcess = ytDlp.exec([url, ...downloadOptions]);
    
    let lastProgress = 40;

    return new Promise((resolve, reject) => {
      ytDlpProcess.on('progress', (progress) => {
        if (progress.percent) {
          const downloadProgress = Math.min(Math.floor(40 + progress.percent * 0.5), 90);
          if (downloadProgress > lastProgress) {
            lastProgress = downloadProgress;
            updateJob(jobId, { 
              progress: downloadProgress, 
              status: 'processing',
              message: `Downloading... ${progress.percent.toFixed(1)}%`
            });
          }
        }
      });

      ytDlpProcess.on('close', (code) => {
        if (code === 0) {
          updateJob(jobId, { progress: 95, message: 'Finalizing...' });
          
          // Find the downloaded file
          const files = fs.readdirSync(config.storage.tempDir);
          const downloadedFile = files.find(f => f.startsWith(outputFilename));
          
          if (downloadedFile) {
            const actualPath = path.join(config.storage.tempDir, downloadedFile);
            
            // Rename to .mp4 if needed
            if (actualPath !== outputPath) {
              try {
                fs.renameSync(actualPath, outputPath);
                resolve(outputPath);
              } catch {
                resolve(actualPath);
              }
            } else {
              resolve(outputPath);
            }
          } else {
            reject(new Error('Download completed but file not found'));
          }
        } else {
          reject(new Error(`Facebook download failed with exit code ${code}`));
        }
      });

      ytDlpProcess.on('error', (error) => {
        try {
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch {}
        reject(new Error(`Facebook download failed: ${error.message}`));
      });
    });
  } catch (error) {
    throw new Error(`Facebook download failed: ${(error as Error).message}`);
  }
};

/**
 * Get media information without downloading
 */
export const getMediaInfo = async (
  url: string,
  _platform: Platform,
  userCookies?: string
): Promise<any> => {
  const ytDlp = await ensureYtDlp();
  
  try {
    // Use appropriate bot bypass options based on URL
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com');
    
    const infoOptions = [
      '--dump-json',
      '--no-check-certificate',
      '--no-warnings',
    ];

    // Add platform-specific options
    if (isYouTube) {
      // Check for user-provided cookies first, then fall back to environment cookies
      let cookiesPath: string | undefined;
      
      if (userCookies) {
        // Save user cookies to temporary file
        const tempCookiePath = path.join(config.storage.tempDir, `user_cookies_${Date.now()}.txt`);
        fs.writeFileSync(tempCookiePath, userCookies);
        cookiesPath = tempCookiePath;
        console.log('✓ Using user-provided cookies');
      } else {
        const { hasCookies, cookiesPath: envCookiesPath } = ensureCookies();
        if (hasCookies) {
          cookiesPath = envCookiesPath;
        }
      }
      
      infoOptions.push(
        '--extractor-args', 'youtube:player_client=ios,web,mweb',
        '--extractor-args', 'youtube:skip=translated_subs,dash,hls',
        '--user-agent', 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
        '--geo-bypass',
        '--force-ipv4',
        '--socket-timeout', '30',
        '--extractor-retries', '10',
        '--fragment-retries', '10'
      );
      
      // Add cookies if available
      if (cookiesPath) {
        infoOptions.push('--cookies', cookiesPath);
      }
    } else {
      // For other platforms (Facebook, Instagram), use generic user agent
      infoOptions.push(
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
    }
    
    const info = await ytDlp.execPromise([url, ...infoOptions]);
    const parsed = JSON.parse(info);
    
    // Extract relevant information
    return {
      title: parsed.title,
      thumbnail: parsed.thumbnail,
      duration: parsed.duration,
      uploader: parsed.uploader || parsed.channel,
      formats: parsed.formats?.map((f: any) => ({
        formatId: f.format_id,
        ext: f.ext,
        quality: f.format_note || f.quality,
        resolution: f.resolution,
        filesize: f.filesize,
        vcodec: f.vcodec,
        acodec: f.acodec,
      })) || [],
    };
  } catch (error) {
    throw new Error(`Failed to get media info: ${(error as Error).message}`);
  }
};

/**
 * Main downloader service - routes to appropriate platform handler
 */
export const downloadMedia = async (
  url: string,
  platform: Platform,
  quality: string,
  format: string,
  jobId: string,
  userCookies?: string
): Promise<string> => {
  switch (platform) {
    case Platform.YOUTUBE:
      return downloadYouTubeVideo(url, quality, format, jobId, userCookies);
    
    case Platform.INSTAGRAM:
      return downloadInstagramVideo(url, jobId);
    
    case Platform.FACEBOOK:
      return downloadFacebookVideo(url, jobId);
    
    case Platform.PINTEREST:
      // TODO: Implement Pinterest downloader
      throw new Error('Pinterest downloads not yet implemented');
    
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};
