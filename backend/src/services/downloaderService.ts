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
 * Save user-provided cookies to use as fallback for future requests
 */
const saveUserCookies = (cookies: string): void => {
  try {
    const userCookiesPath = path.join(__dirname, '../../user_cookies.txt');
    const timestamp = new Date().toISOString();
    const header = `# User-provided cookies (last updated: ${timestamp})\n`;
    fs.writeFileSync(userCookiesPath, header + cookies);
    console.log('✓ Saved user-provided cookies for future use');
  } catch (error) {
    console.warn('✗ Failed to save user cookies:', error);
  }
};

type CookieCandidate = {
  label: string;
  path?: string;
  ephemeral?: boolean;
};

const backendRoot = path.resolve(__dirname, '../../');
const candidateSearchRoots = Array.from(
  new Set([
    backendRoot,
    path.resolve(process.cwd()),
    path.resolve(process.cwd(), '..'),
    path.resolve(__dirname, '../../../'),
  ])
);

const COOKIE_RETRY_PATTERNS = [
  'sign in to confirm',
  'sign in to view',
  'sign in',
  'login required',
  'log in',
  'not a bot',
  'verify you are human',
  'captcha',
  'consent required',
  'account issue',
  'this video may be inappropriate',
  'age-restricted',
  'private video',
  'http error 403',
  'http error 429',
  'too many requests',
  'forbidden',
  'quota exceeded',
  'temporarily blocked',
];

const sanitizeYouTubeUrl = (inputUrl: string): string => {
  try {
    const urlObj = new URL(inputUrl);
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      urlObj.searchParams.delete('si');
      return urlObj.toString();
    }
  } catch {
    // If parsing fails, fall through to manual cleanup
  }

  return inputUrl.replace(/\?si=[^&]+(&|$)/, (_match, trailing) => (trailing === '&' ? '?' : '')).replace(/&&+/g, '&');
};

const normalizeCookiePath = (filePath: string): string => {
  const trimmed = filePath.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (path.isAbsolute(trimmed)) {
    return trimmed;
  }
  return path.resolve(backendRoot, trimmed);
};

const parseEnvCookieFiles = (): string[] => {
  const envValues: string[] = [];

  if (process.env.YOUTUBE_COOKIES_FILE) {
    envValues.push(process.env.YOUTUBE_COOKIES_FILE);
  }

  const listVars = [
    process.env.YOUTUBE_COOKIE_FILES,
    process.env.YOUTUBE_COOKIES_FILES,
    process.env.YOUTUBE_COOKIES_PATHS,
  ];

  for (const value of listVars) {
    if (value) {
      envValues.push(...value.split(/[;,]/g));
    }
  }

  return envValues
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const buildCookieCandidates = (jobId?: string, userCookies?: string): CookieCandidate[] => {
  const candidates: CookieCandidate[] = [];
  const seen = new Set<string>();

  const addCandidate = (label: string, filePath?: string, ephemeral = false) => {
    if (filePath) {
      const normalized = normalizeCookiePath(filePath);
      if (!fs.existsSync(normalized) || seen.has(normalized)) {
        return;
      }
      seen.add(normalized);
      candidates.push({ label, path: normalized, ephemeral });
      return;
    }

    if (!candidates.some((candidate) => !candidate.path)) {
      candidates.push({ label });
    }
  };

  const ensureTempDir = () => {
    if (!fs.existsSync(config.storage.tempDir)) {
      fs.mkdirSync(config.storage.tempDir, { recursive: true });
    }
  };

  const addInlineCookieCandidate = (label: string, content: string) => {
    if (!content || content.trim().length === 0) {
      return;
    }

    try {
      ensureTempDir();
      const safeLabel = label.replace(/[^a-z0-9_-]+/gi, '_');
      const tempCookiePath = path.join(
        config.storage.tempDir,
        `${safeLabel}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.txt`
      );
      fs.writeFileSync(tempCookiePath, content);
      addCandidate(label, tempCookiePath, true);
    } catch (error) {
      console.warn(`⚠ Failed to materialize ${label}:`, error);
    }
  };

  if (userCookies && userCookies.trim().length > 0) {
    ensureTempDir();

    const safeJobId = jobId || `manual_${Date.now()}`;
    const tempCookiePath = path.join(config.storage.tempDir, `user_cookies_${safeJobId}.txt`);
    fs.writeFileSync(tempCookiePath, userCookies);
    addCandidate('user-supplied cookies', tempCookiePath, true);
  }

  const inlineEnvCookies = process.env.YOUTUBE_COOKIES_TEXT;
  if (inlineEnvCookies) {
    addInlineCookieCandidate('env:inline-text', inlineEnvCookies);
  }

  const inlineEnvCookiesBase64 = process.env.YOUTUBE_COOKIES_BASE64;
  if (inlineEnvCookiesBase64) {
    try {
      const decoded = Buffer.from(inlineEnvCookiesBase64, 'base64').toString('utf-8');
      addInlineCookieCandidate('env:inline-base64', decoded);
    } catch (error) {
      console.warn('⚠ Failed to decode YOUTUBE_COOKIES_BASE64:', error);
    }
  }

  for (const envPath of parseEnvCookieFiles()) {
    const normalized = normalizeCookiePath(envPath);
    addCandidate(`env:${path.basename(normalized)}`, normalized);
  }

  addCandidate('backend cookies.txt', path.join(backendRoot, 'cookies.txt'));
  addCandidate('stored user cookies', path.join(backendRoot, 'user_cookies.txt'));
  for (const root of candidateSearchRoots) {
    addCandidate('repo cookies_update.txt', path.join(root, 'cookies_update.txt'));
    addCandidate('repo cookies_music.txt', path.join(root, 'cookies_music.txt'));
    addCandidate('repo youtube_cookies_fresh.txt', path.join(root, 'youtube_cookies_fresh.txt'));
  }

  addCandidate('no cookies');

  if (candidates.length === 0) {
    candidates.push({ label: 'no cookies' });
  }

  return candidates;
};

const cleanupCookieCandidates = (candidates: CookieCandidate[]): void => {
  for (const candidate of candidates) {
    if (candidate.ephemeral && candidate.path) {
      try {
        if (fs.existsSync(candidate.path)) {
          fs.unlinkSync(candidate.path);
        }
      } catch (error) {
        console.warn('⚠ Failed to clean up temporary cookie file:', error);
      }
    }
  }
};

const extractYtDlpErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'Unknown error';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    const stderr = (error as any)?.stderr;
    if (stderr) {
      return `${error.message}\n${stderr}`.trim();
    }
    return error.message;
  }

  if (typeof error === 'object') {
    const stderr = (error as any)?.stderr;
    const message = (error as any)?.message;
    if (stderr) {
      return String(stderr);
    }
    if (message) {
      return String(message);
    }
  }

  try {
    return JSON.stringify(error);
  } catch {
    return 'Unrecognized yt-dlp error';
  }
};

const shouldRetryWithNextCookies = (message: string): boolean => {
  if (!message) {
    return false;
  }
  const lowered = message.toLowerCase();
  return COOKIE_RETRY_PATTERNS.some((pattern) => lowered.includes(pattern));
};

const cleanupPartialJobFiles = (jobId: string): void => {
  try {
    if (!fs.existsSync(config.storage.tempDir)) {
      return;
    }

    const files = fs.readdirSync(config.storage.tempDir);
    for (const file of files) {
      if (file.startsWith(`${jobId}_`)) {
        try {
          fs.unlinkSync(path.join(config.storage.tempDir, file));
        } catch (error) {
          console.warn('⚠ Failed to remove partial download file:', error);
        }
      }
    }
  } catch (error) {
    console.warn('⚠ Failed to clean partial job files:', error);
  }
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
  const sanitizedUrl = sanitizeYouTubeUrl(url);
  const cookieCandidates = buildCookieCandidates(jobId, userCookies);

  try {
    updateJob(jobId, { progress: 5, status: 'processing', message: 'Validating YouTube URL...' });

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com)\/.+$/;
    if (!youtubeRegex.test(sanitizedUrl)) {
      throw new Error('Invalid YouTube URL');
    }

    updateJob(jobId, { progress: 10, message: 'Initializing downloader...' });

    const ytDlp = await ensureYtDlp();

    if (!fs.existsSync(config.storage.tempDir)) {
      fs.mkdirSync(config.storage.tempDir, { recursive: true });
    }

    const attemptErrors: string[] = [];
    let lastErrorMessage = '';

    for (let index = 0; index < cookieCandidates.length; index += 1) {
      const candidate = cookieCandidates[index];
      const isLastAttempt = index === cookieCandidates.length - 1;

      try {
        cleanupPartialJobFiles(jobId);

        const attemptLabel = candidate.path ? candidate.label : 'no cookies';
        console.log(`→ Attempting YouTube download with ${attemptLabel}`);

        updateJob(jobId, { progress: 15, message: `Fetching video information (${attemptLabel})...` });

        const infoOptions: string[] = [
          '--ignore-config',
          '--dump-json',
          '--no-check-certificate',
          '--no-warnings',
          '--extractor-args', 'youtube:player_client=android,ios,web,mweb,tv_embedded',
          '--extractor-args', 'youtube:skip=translated_subs',
          '--user-agent', 'com.google.android.youtube/19.09.37 (Linux; U; Android 13; en_US) gzip',
          '--add-header', 'Accept-Language:en-US,en;q=0.9',
          '--add-header', 'Accept-Encoding:gzip, deflate',
          '--add-header', 'Accept:*/*',
          '--add-header', 'Connection:keep-alive',
          '--geo-bypass',
          '--force-ipv4',
          '--socket-timeout', '30',
          '--extractor-retries', '10',
          '--fragment-retries', '10',
          '--retry-sleep', '3',
          '--extractor-args', 'youtube:player_skip=webpage,configs',
        ];

        if (candidate.path) {
          infoOptions.push('--cookies', candidate.path);
        }

        const infoJson = await ytDlp.execPromise([sanitizedUrl, ...infoOptions]);
        const info = JSON.parse(infoJson);

        const title = sanitizeFilename(info.title || 'video');
        const outputFilename = `${jobId}_${title}`;
        const expectedOutputPath = path.join(config.storage.tempDir, `${outputFilename}.${format}`);

        updateJob(jobId, {
          progress: 20,
          message: `Downloading: ${info.title?.substring(0, 50) || 'video'}...`,
        });

        const downloadOptions: string[] = [
          '--ignore-config',
          '--progress',
          '--newline',
          '--no-check-certificate',
          '--no-warnings',
          '--extractor-args', 'youtube:player_client=android,ios,web,mweb,tv_embedded',
          '--extractor-args', 'youtube:skip=translated_subs',
          '--extractor-args', 'youtube:player_skip=webpage,configs',
          '--user-agent', 'com.google.android.youtube/19.09.37 (Linux; U; Android 13; en_US) gzip',
          '--add-header', 'Accept-Language:en-US,en;q=0.9',
          '--add-header', 'Accept-Encoding:gzip, deflate',
          '--add-header', 'Accept:*/*',
          '--add-header', 'Connection:keep-alive',
          '--add-header', 'Sec-Fetch-Mode:navigate',
          '--geo-bypass',
          '--force-ipv4',
          '--sleep-requests', '1',
          '--sleep-interval', '1',
          '--max-sleep-interval', '5',
          '--extractor-retries', '15',
          '--fragment-retries', '15',
          '--retry-sleep', '5',
          '--socket-timeout', '30',
          '--throttled-rate', '100K',
          '--age-limit', '0',
          '-o', path.join(config.storage.tempDir, `${outputFilename}.%(ext)s`),
        ];

        if (candidate.path) {
          downloadOptions.push('--cookies', candidate.path);
        }

        if (format === 'mp3') {
          downloadOptions.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
        } else if (format === 'mp4') {
          const qualityMap: { [key: string]: string } = {
            '144p': 'worst[height<=144]',
            '240p': 'worst[height<=240]',
            '360p': 'best[height<=360]',
            '480p': 'best[height<=480]',
            '720p': 'best[height<=720]',
            '1080p': 'best[height<=1080]',
          };

          const formatSelector = qualityMap[quality] || 'best[height<=720]';
          downloadOptions.push('-f', `${formatSelector}/best`, '--merge-output-format', 'mp4');
        }

        const ytDlpProcess = ytDlp.exec([sanitizedUrl, ...downloadOptions]);

        let lastProgress = 20;

        const downloadedPath = await new Promise<string>((resolve, reject) => {
          ytDlpProcess.on('progress', (progress) => {
            if (progress.percent) {
              const downloadProgress = Math.min(Math.floor(progress.percent * 0.7) + 20, 90);
              if (downloadProgress > lastProgress) {
                lastProgress = downloadProgress;
                updateJob(jobId, {
                  progress: downloadProgress,
                  status: 'processing',
                  message: `Downloading... ${progress.percent.toFixed(1)}%`,
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

              const files = fs.readdirSync(config.storage.tempDir);
              const downloadedFile = files.find((file) => file.startsWith(outputFilename));

              if (downloadedFile) {
                const actualPath = path.join(config.storage.tempDir, downloadedFile);

                if (actualPath !== expectedOutputPath) {
                  try {
                    fs.renameSync(actualPath, expectedOutputPath);
                    resolve(expectedOutputPath);
                  } catch {
                    resolve(actualPath);
                  }
                } else {
                  resolve(expectedOutputPath);
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
              if (fs.existsSync(expectedOutputPath)) {
                fs.unlinkSync(expectedOutputPath);
              }
            } catch (cleanupError) {
              console.warn('⚠ Failed to clean up partial download:', cleanupError);
            }
            reject(new Error(`YouTube download failed: ${error.message}`));
          });
        });

        if (userCookies && candidate.ephemeral) {
          saveUserCookies(userCookies);
        }

        return downloadedPath;
      } catch (attemptError) {
        const message = extractYtDlpErrorMessage(attemptError);
        lastErrorMessage = message;
        attemptErrors.push(`[${candidate.label}] ${message}`);

        if (!isLastAttempt && shouldRetryWithNextCookies(message)) {
          console.warn(`✗ Attempt with ${candidate.label} failed: ${message}`);
          updateJob(jobId, {
            progress: 15,
            message: 'Encountered bot detection. Retrying with alternate cookies...',
          });
          continue;
        }

        if (isLastAttempt) {
          continue;
        }

        throw new Error(message);
      }
    }

    const attemptedLabels = cookieCandidates.map((candidate) => candidate.label).join(', ');
    const attemptSummary = attemptErrors.length > 0 ? attemptErrors.join(' | ') : 'None';
    const finalMessage = lastErrorMessage || 'Unknown yt-dlp error';

    throw new Error(
      `Failed to download after trying ${cookieCandidates.length} cookie option(s). yt-dlp last reported: ${finalMessage}. Attempt summary: ${attemptSummary}. Tried cookie sources: ${attemptedLabels}`
    );
  } catch (error) {
    throw new Error(`YouTube download failed: ${(error as Error).message}`);
  } finally {
    cleanupCookieCandidates(cookieCandidates);
  }
};

/**
 * Download video from Instagram using yt-dlp
 */
export const downloadInstagramVideo = async (
  url: string,
  jobId: string,
  userCookies?: string
): Promise<string> => {
  try {
    updateJob(jobId, { progress: 10, status: 'processing', message: 'Initializing Instagram downloader...' });

    // Initialize yt-dlp (it supports Instagram)
    const ytDlp = await ensureYtDlp();

    // Setup cookies for Instagram
    let cookiesPath: string | undefined;
    
    if (userCookies) {
      // Use user-provided cookies
      const tempCookiePath = path.join(config.storage.tempDir, `user_cookies_${jobId}.txt`);
      fs.writeFileSync(tempCookiePath, userCookies);
      cookiesPath = tempCookiePath;
      console.log('✓ Using user-provided cookies for Instagram');
    }

    updateJob(jobId, { progress: 20, message: 'Fetching Instagram media...' });

    // Get video info with cookies if available
    const infoOptions: string[] = ['--dump-json', '--no-warnings'];
    if (cookiesPath) {
      infoOptions.push('--cookies', cookiesPath);
    }
    
    const infoJson = await ytDlp.execPromise([url, ...infoOptions]);
    const info = JSON.parse(infoJson);
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
    
    // Add cookies if available
    if (cookiesPath) {
      downloadOptions.push('--cookies', cookiesPath);
    }

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
          
          // If download succeeded with user cookies, save them for future use (Instagram)
          if (userCookies) {
            saveUserCookies(userCookies);
          }
          
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

  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('music.youtube.com');
  const sanitizedUrl = sanitizeYouTubeUrl(url);
  const cookieCandidates = isYouTube ? buildCookieCandidates(`info_${Date.now()}`, userCookies) : [];

  const formatMediaInfo = (parsed: any) => ({
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
  });

  try {
    const baseInfoOptions = [
      '--ignore-config',
      '--dump-json',
      '--no-check-certificate',
      '--no-warnings',
    ];

    if (!isYouTube) {
      const infoOptions = [
        ...baseInfoOptions,
        '--user-agent',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      ];

      const info = await ytDlp.execPromise([sanitizedUrl, ...infoOptions]);
      const parsed = JSON.parse(info);
      return formatMediaInfo(parsed);
    }

    const attemptErrors: string[] = [];
    let lastErrorMessage = '';

    for (let index = 0; index < cookieCandidates.length; index += 1) {
      const candidate = cookieCandidates[index];
      const isLastAttempt = index === cookieCandidates.length - 1;

      try {
        const infoOptions = [
          '--ignore-config',
          ...baseInfoOptions,
          '--extractor-args', 'youtube:player_client=android,ios,web,mweb,tv_embedded',
          '--extractor-args', 'youtube:skip=translated_subs',
          '--extractor-args', 'youtube:player_skip=webpage,configs',
          '--user-agent', 'com.google.android.youtube/19.09.37 (Linux; U; Android 13; en_US) gzip',
          '--add-header', 'Accept-Language:en-US,en;q=0.9',
          '--add-header', 'Accept-Encoding:gzip, deflate',
          '--add-header', 'Accept:*/*',
          '--add-header', 'Connection:keep-alive',
          '--geo-bypass',
          '--force-ipv4',
          '--socket-timeout', '30',
          '--extractor-retries', '10',
          '--fragment-retries', '10',
          '--retry-sleep', '3',
        ];

        if (candidate.path) {
          infoOptions.push('--cookies', candidate.path);
        }

        const info = await ytDlp.execPromise([sanitizedUrl, ...infoOptions]);
        const parsed = JSON.parse(info);
        return formatMediaInfo(parsed);
      } catch (attemptError) {
        const message = extractYtDlpErrorMessage(attemptError);
        lastErrorMessage = message;
        attemptErrors.push(`[${candidate.label}] ${message}`);

        if (!isLastAttempt && shouldRetryWithNextCookies(message)) {
          console.warn(`✗ Info attempt with ${candidate.label} failed: ${message}`);
          continue;
        }

        if (isLastAttempt) {
          continue;
        }

        throw new Error(`Failed to get media info: ${message}`);
      }
    }

    const attemptedLabels = cookieCandidates.map((candidate) => candidate.label).join(', ');
    const attemptSummary = attemptErrors.length > 0 ? attemptErrors.join(' | ') : 'None';
    const finalMessage = lastErrorMessage || 'Unknown yt-dlp error';

    throw new Error(
      `Failed to get media info after trying ${cookieCandidates.length} cookie option(s). yt-dlp last reported: ${finalMessage}. Attempt summary: ${attemptSummary}. Tried cookie sources: ${attemptedLabels}`
    );
  } catch (error) {
    throw new Error(`Failed to get media info: ${(error as Error).message}`);
  } finally {
    if (cookieCandidates.length > 0) {
      cleanupCookieCandidates(cookieCandidates);
    }
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
      return downloadInstagramVideo(url, jobId, userCookies);
    
    case Platform.FACEBOOK:
      return downloadFacebookVideo(url, jobId);
    
    case Platform.PINTEREST:
      // TODO: Implement Pinterest downloader
      throw new Error('Pinterest downloads not yet implemented');
    
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};
