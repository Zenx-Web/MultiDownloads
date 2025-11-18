import YTDlpWrap from 'yt-dlp-wrap';
import * as fs from 'fs';
import * as path from 'path';
import { Platform } from '../types';
import { config } from '../config';
import { updateJob } from './jobService';
import { sanitizeFilename } from './urlService';

// Initialize yt-dlp wrapper with auto-download
let ytDlpWrap: YTDlpWrap;

// Detect OS and set appropriate binary name
const isWindows = process.platform === 'win32';
const ytDlpBinaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpPath = path.join(__dirname, '../../', ytDlpBinaryName);

// Download yt-dlp binary if not exists
const ensureYtDlp = async (): Promise<YTDlpWrap> => {
  if (ytDlpWrap) {
    return ytDlpWrap;
  }

  if (!fs.existsSync(ytDlpPath)) {
    console.log(`Downloading yt-dlp binary for ${process.platform}...`);
    try {
      await YTDlpWrap.downloadFromGithub(ytDlpPath);
      
      // Make executable on Unix systems
      if (!isWindows) {
        fs.chmodSync(ytDlpPath, '755');
      }
      
      console.log('yt-dlp downloaded successfully');
    } catch (error) {
      console.error('Failed to download yt-dlp:', error);
      throw new Error('Failed to initialize yt-dlp downloader');
    }
  }

  ytDlpWrap = new YTDlpWrap(ytDlpPath);
  return ytDlpWrap;
};

/**
 * Download video from YouTube using yt-dlp
 */
export const downloadYouTubeVideo = async (
  url: string,
  quality: string,
  format: string,
  jobId: string
): Promise<string> => {
  try {
    updateJob(jobId, { progress: 5, status: 'processing', message: 'Validating YouTube URL...' });

    // Basic YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      throw new Error('Invalid YouTube URL');
    }

    updateJob(jobId, { progress: 10, message: 'Initializing downloader...' });

    // Initialize yt-dlp with auto-download
    const ytDlp = await ensureYtDlp();
    
    // Get video info
    const info = await ytDlp.getVideoInfo(url);
    const title = sanitizeFilename(info.title || 'video');
    const outputFilename = `${jobId}_${title}`;
    const outputPath = path.join(config.storage.tempDir, `${outputFilename}.${format}`);

    updateJob(jobId, { progress: 20, message: `Downloading: ${info.title?.substring(0, 50) || 'video'}...` });

    // Ensure temp directory exists
    if (!fs.existsSync(config.storage.tempDir)) {
      fs.mkdirSync(config.storage.tempDir, { recursive: true });
    }

    // Configure download options with enhanced bot bypass
    const downloadOptions: string[] = [
      '--progress',
      '--newline',
      '--no-check-certificate',
      '--extractor-args', 'youtube:player_client=ios,android',
      '--extractor-args', 'youtube:skip=hls,dash',
      '--user-agent', 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
      '--add-header', 'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      '--add-header', 'Accept-Language:en-us,en;q=0.5',
      '--add-header', 'Sec-Fetch-Mode:navigate',
      '-o', path.join(config.storage.tempDir, `${outputFilename}.%(ext)s`),
    ];

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
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '--extractor-args', 'youtube:player_client=android,web',
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
  _platform: Platform
): Promise<any> => {
  const ytDlp = await ensureYtDlp();
  
  try {
    // Use the same bot bypass options as downloads
    const infoOptions = [
      '--dump-json',
      '--no-check-certificate',
      '--extractor-args', 'youtube:player_client=ios,android',
      '--extractor-args', 'youtube:skip=hls,dash',
      '--user-agent', 'com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X;)',
      '--add-header', 'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      '--add-header', 'Accept-Language:en-us,en;q=0.5',
      '--add-header', 'Sec-Fetch-Mode:navigate',
    ];
    
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
  jobId: string
): Promise<string> => {
  switch (platform) {
    case Platform.YOUTUBE:
      return downloadYouTubeVideo(url, quality, format, jobId);
    
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
