'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus, resolveDownloadUrl } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ScreenshotPage() {
  const [url, setUrl] = useState('');
  const [fullPage, setFullPage] = useState(true);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleCapture = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl('');

    try {
      const response = await fetch(`${API_URL}/media/screenshot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, fullPage, width, height }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Screenshot capture failed');
      }

      const jobId = data.jobId;
      let isActive = true;
      let timeoutId: ReturnType<typeof setTimeout>;

      const pollInterval = setInterval(async () => {
        try {
          const job = await fetchJobStatus(jobId, API_URL);

          if (job.status === 'completed') {
            isActive = false;
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setDownloadUrl(resolveDownloadUrl(job.downloadUrl, API_URL));
            setLoading(false);
          } else if (job.status === 'failed') {
            isActive = false;
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setError(job.error || 'Screenshot capture failed');
            setLoading(false);
          }
        } catch (pollError) {
          isActive = false;
          clearInterval(pollInterval);
          clearTimeout(timeoutId);
          setError(pollError instanceof Error ? pollError.message : 'Failed to fetch job status');
          setLoading(false);
        }
      }, 2000);

      timeoutId = setTimeout(() => {
        if (!isActive) {
          return;
        }
        clearInterval(pollInterval);
        setError('Screenshot capture timed out');
        setLoading(false);
      }, 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture screenshot');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Website Screenshot</h1>
          <p className="text-lg text-gray-600">
            Capture screenshots of any website
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={fullPage}
                  onChange={(e) => setFullPage(e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">Capture full page (scroll)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2">
              <button
                onClick={() => { setWidth(1920); setHeight(1080); }}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                1920×1080
              </button>
              <button
                onClick={() => { setWidth(1366); setHeight(768); }}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                1366×768
              </button>
              <button
                onClick={() => { setWidth(375); setHeight(667); }}
                className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded"
              >
                Mobile
              </button>
            </div>

            <button
              onClick={handleCapture}
              disabled={!url || loading}
              className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 disabled:bg-gray-400"
            >
              {loading ? 'Capturing...' : 'Capture Screenshot'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {loading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                <span className="ml-3 text-gray-600">Loading page...</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            {downloadUrl ? (
              <div>
                <img src={downloadUrl} alt="Screenshot" className="w-full rounded-lg mb-4" />
                <a
                  href={downloadUrl}
                  download
                  className="block w-full bg-amber-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-amber-700 text-center"
                >
                  Download Screenshot
                </a>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-400">
                Screenshot will appear here
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>• Full page capture with scrolling</div>
            <div>• Custom viewport sizes</div>
            <div>• Desktop and mobile views</div>
            <div>• High-quality PNG output</div>
          </div>
        </div>
      </div>
    </div>
  );
}
