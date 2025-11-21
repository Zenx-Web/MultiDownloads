'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CookieConsent from './CookieConsent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface DownloadFormProps {
  onJobCreated?: (jobId: string) => void;
}

interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
}

interface DownloadState {
  videoInfo: VideoInfo | null;
  jobId: string | null;
  status: 'idle' | 'fetching' | 'processing' | 'ready' | 'downloading';
  progress: number;
  error: string | null;
  downloadUrl: string | null;
}

export default function DownloadForm({ onJobCreated }: DownloadFormProps) {
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720p');
  const [format, setFormat] = useState('mp4');
  const [action, setAction] = useState('download');
  const [cookies, setCookies] = useState('');
  const [showCookiesInput, setShowCookiesInput] = useState(false);
  const [downloadState, setDownloadState] = useState<DownloadState>({
    videoInfo: null,
    jobId: null,
    status: 'idle',
    progress: 0,
    error: null,
    downloadUrl: null,
  });

  // Load saved cookies on mount
  useEffect(() => {
    const savedCookies = localStorage.getItem('userCookies');
    if (savedCookies) {
      setCookies(savedCookies);
    }
  }, []);

  const handleCookieAccept = () => {
    // Cookie consent accepted - no actual cookies extracted
  };

  const handleSaveCookies = () => {
    if (cookies.trim()) {
      localStorage.setItem('userCookies', cookies);
      alert('✅ Cookies saved! They will be used automatically for future downloads.');
    }
  };

  const handleClearCookies = () => {
    localStorage.removeItem('userCookies');
    setCookies('');
    alert('🗑️ Cookies cleared!');
  };

  // Poll job status when processing
  useEffect(() => {
    if (downloadState.jobId && downloadState.status === 'processing') {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`${API_URL}/status/${downloadState.jobId}`);
          const job = response.data.data;

          setDownloadState(prev => ({ ...prev, progress: job.progress || 0 }));

          if (job.status === 'completed') {
            setDownloadState(prev => ({
              ...prev,
              status: 'ready',
              progress: 100,
              downloadUrl: job.downloadUrl,
            }));
            clearInterval(interval);
          } else if (job.status === 'failed') {
            setDownloadState(prev => ({
              ...prev,
              status: 'idle',
              error: job.error || 'Download failed',
            }));
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [downloadState.jobId, downloadState.status]);

  const handleDownloadClick = async () => {
    // First click: Fetch info and start download
    if (downloadState.status === 'idle') {
      if (!url) {
        setDownloadState(prev => ({ ...prev, error: 'Please enter a URL' }));
        return;
      }

      setDownloadState({
        videoInfo: null,
        jobId: null,
        status: 'fetching',
        progress: 0,
        error: null,
        downloadUrl: null,
      });

      try {
        // Fetch video info
        const infoResponse = await axios.post(`${API_URL}/download/info`, { 
          url,
          ...(cookies && { cookies })
        });
        
        if (!infoResponse.data.success) {
          throw new Error(infoResponse.data.error || 'Failed to fetch video info');
        }

        const videoInfo = infoResponse.data.data;

        setDownloadState(prev => ({
          ...prev,
          videoInfo,
          status: 'processing',
          progress: 5,
        }));

        // Start download process
        const downloadResponse = await axios.post(`${API_URL}/download`, {
          url,
          quality: action === 'audio' ? '720p' : quality,
          format: action === 'audio' ? 'mp3' : format,
          action: action === 'audio' ? 'audio-only' : 'download',
          platform: 'auto',
          ...(cookies && { cookies })
        });

        if (!downloadResponse.data.success) {
          throw new Error(downloadResponse.data.error || 'Failed to start download');
        }

        const jobId = downloadResponse.data.data.jobId;
        setDownloadState(prev => ({
          ...prev,
          jobId,
        }));

        if (onJobCreated) {
          onJobCreated(jobId);
        }

      } catch (err: any) {
        const errorMsg = err.response?.data?.error || err.message || 'Failed to process request';
        const errorMessage = err.response?.data?.message || errorMsg;
        
        // Check if authentication is required
        if (errorMsg.includes('Authentication required') || errorMsg.includes('rate-limit') || errorMsg.includes('login required')) {
          setDownloadState({
            videoInfo: null,
            jobId: null,
            status: 'idle',
            progress: 0,
            error: errorMessage,
            downloadUrl: null,
          });
          setShowCookiesInput(true); // Show cookies input when auth is needed
        } else {
          setDownloadState({
            videoInfo: null,
            jobId: null,
            status: 'idle',
            progress: 0,
            error: errorMessage,
            downloadUrl: null,
          });
        }
        console.error('Download error:', err);
      }
    }
    // Second click: Download the file
    else if (downloadState.status === 'ready' && downloadState.downloadUrl) {
      // Remove /api prefix from downloadUrl since API_URL already includes it
      const cleanUrl = downloadState.downloadUrl.replace(/^\/api/, '');
      window.location.href = `${API_URL}${cleanUrl}`;
      
      // Reset after a delay
      setTimeout(() => {
        setDownloadState({
          videoInfo: null,
          jobId: null,
          status: 'idle',
          progress: 0,
          error: null,
          downloadUrl: null,
        });
        setUrl('');
      }, 2000);
    }
  };

  const getButtonText = () => {
    switch (downloadState.status) {
      case 'fetching':
        return 'Fetching video info...';
      case 'processing':
        return `Processing... ${downloadState.progress}%`;
      case 'ready':
        return '⬇️ Download Ready - Click to Save';
      default:
        return action === 'audio' ? '🎵 Download Audio (MP3)' : '⬇️ Download Video';
    }
  };

  const isButtonDisabled = downloadState.status === 'fetching' || downloadState.status === 'processing';

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <CookieConsent onAccept={handleCookieAccept} />
      
      <div className="space-y-6">
        {/* URL Input */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Paste Media URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={downloadState.status !== 'idle'}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
          />
        </div>

        {/* Cookies Input (shows when needed) */}
        {showCookiesInput && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-2xl">🍪</span>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-1">Authentication Required</h4>
                <p className="text-sm text-amber-700 mb-2">
                  This content requires authentication cookies. Paste your cookies below to continue.
                </p>
              </div>
            </div>
            <textarea
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              placeholder="Paste your cookies here (Netscape format)&#10;&#10;Example:&#10;.youtube.com	TRUE	/	TRUE	1234567890	VISITOR_INFO1_LIVE	abcd1234..."
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-xs h-24 resize-vertical"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleSaveCookies}
                disabled={!cookies.trim()}
                className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                💾 Save Cookies
              </button>
              <button
                type="button"
                onClick={handleClearCookies}
                className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
              >
                🗑️ Clear Saved
              </button>
              <button
                type="button"
                onClick={() => setShowCookiesInput(false)}
                className="ml-auto px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
              >
                Hide
              </button>
            </div>
            <details className="mt-3">
              <summary className="text-xs text-amber-700 cursor-pointer hover:text-amber-900">
                📖 How to get cookies?
              </summary>
              <ol className="text-xs text-amber-600 mt-2 ml-4 list-decimal space-y-1">
                <li>Install a cookie exporter extension (e.g., "Get cookies.txt LOCALLY")</li>
                <li>Go to YouTube.com or Instagram.com and log in</li>
                <li>Click the extension and export cookies in Netscape format</li>
                <li>Copy and paste the cookies above</li>
              </ol>
            </details>
          </div>
        )}

        {/* Show cookies status if saved */}
        {cookies && !showCookiesInput && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">✅</span>
              <span className="text-sm text-green-700 font-medium">
                Using saved cookies for authentication
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowCookiesInput(true)}
              className="text-xs text-green-600 hover:text-green-800 underline"
            >
              Manage
            </button>
          </div>
        )}

        {/* Video Info Display */}
        {downloadState.videoInfo && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 animate-fadeIn">
            <div className="flex gap-4">
              {downloadState.videoInfo.thumbnail && (
                <img
                  src={downloadState.videoInfo.thumbnail}
                  alt={downloadState.videoInfo.title}
                  className="w-32 h-24 object-cover rounded shadow-md"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{downloadState.videoInfo.title}</h3>
                {downloadState.videoInfo.uploader && (
                  <p className="text-sm text-gray-600 mb-1">By {downloadState.videoInfo.uploader}</p>
                )}
                {downloadState.videoInfo.duration && (
                  <p className="text-sm text-gray-500">
                    Duration: {Math.floor(downloadState.videoInfo.duration / 60)}:{String(downloadState.videoInfo.duration % 60).padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
            
            {/* Progress Bar */}
            {downloadState.status === 'processing' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${downloadState.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1 text-center">Processing your download...</p>
              </div>
            )}
          </div>
        )}

        {/* Action Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAction('download')}
              disabled={downloadState.status !== 'idle'}
              className={`p-4 rounded-lg border-2 transition-all ${
                action === 'download'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl mb-2">📹</div>
              <div className="font-semibold">Download Video</div>
            </button>
            <button
              type="button"
              onClick={() => setAction('audio')}
              disabled={downloadState.status !== 'idle'}
              className={`p-4 rounded-lg border-2 transition-all ${
                action === 'audio'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl mb-2">🎵</div>
              <div className="font-semibold">Extract Audio (MP3)</div>
            </button>
          </div>
        </div>

        {/* Quality Selection - Only for Video */}
        {action === 'download' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-gray-700 mb-2">
                Quality
              </label>
              <select
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                disabled={downloadState.status !== 'idle'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="360p">360p</option>
                <option value="480p">480p</option>
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD) - Premium</option>
              </select>
            </div>

            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                disabled={downloadState.status !== 'idle'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="mp4">MP4</option>
                <option value="webm">WebM</option>
                <option value="mkv">MKV</option>
              </select>
            </div>
          </div>
        )}

        {/* Error Message */}
        {downloadState.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {downloadState.error}
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownloadClick}
          disabled={isButtonDisabled}
          className={`w-full py-4 rounded-lg font-semibold transition-all text-lg ${
            downloadState.status === 'ready'
              ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isButtonDisabled ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {getButtonText()}
            </span>
          ) : (
            getButtonText()
          )}
        </button>

        {/* Info Text */}
        <p className="text-sm text-gray-500 text-center">
          Free users: 5 downloads/day, up to 720p. 
          <a href="/pricing" className="text-blue-600 hover:underline ml-1">
            Upgrade for unlimited access
          </a>
        </p>
      </div>
    </div>
  );
}
