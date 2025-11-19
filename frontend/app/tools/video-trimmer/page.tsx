'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VideoTrimmerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState('00:00:00');
  const [endTime, setEndTime] = useState('00:00:10');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleTrim = async () => {
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('startTime', startTime);
    formData.append('endTime', endTime);

    try {
      const response = await fetch(`${API_URL}/media/trim-video`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const jobId = data.jobId;

      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`${API_URL}/job/${jobId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'completed') {
          clearInterval(pollInterval);
          const fullUrl = statusData.downloadUrl.startsWith('http') 
            ? statusData.downloadUrl 
            : `${API_URL}${statusData.downloadUrl}`;
          setDownloadUrl(fullUrl);
          setLoading(false);
        } else if (statusData.status === 'failed') {
          clearInterval(pollInterval);
          setError(statusData.error || 'Trim failed');
          setLoading(false);
        }
      }, 2000);

      setTimeout(() => clearInterval(pollInterval), 600000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trim video');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Video Trimmer</h1>
          <p className="text-lg text-gray-600">
            Cut and trim video sections with precision
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time (HH:MM:SS)
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="00:00:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time (HH:MM:SS)
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="00:00:10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <button
            onClick={handleTrim}
            disabled={!file || loading}
            className="w-full bg-violet-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-violet-700 disabled:bg-gray-400"
          >
            {loading ? 'Trimming Video...' : 'Trim Video'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium mb-2">✓ Video trimmed successfully!</p>
              <a
                href={downloadUrl}
                download
                className="block w-full bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 text-center"
              >
                Download Trimmed Video
              </a>
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              <span className="ml-3 text-gray-600">Processing video...</span>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Time Format Guide</h2>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>• Format: HH:MM:SS (Hours:Minutes:Seconds)</p>
            <p>• Example: 00:01:30 (1 minute 30 seconds)</p>
            <p>• Example: 01:15:00 (1 hour 15 minutes)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
