'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VideoConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('mp4');
  const [targetQuality, setTargetQuality] = useState('720');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'converting' | 'ready'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  // Poll job status
  useEffect(() => {
    if (jobId && status === 'converting') {
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`${API_URL}/status/${jobId}`);
          const job = response.data.data;

          setProgress(job.progress || 0);

          if (job.status === 'completed') {
            setStatus('ready');
            setDownloadUrl(job.downloadUrl);
            clearInterval(interval);
          } else if (job.status === 'failed') {
            setStatus('idle');
            setError(job.error || 'Conversion failed');
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [jobId, status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setDownloadUrl('');
      setStatus('idle');
      setJobId(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setStatus('converting');
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('targetFormat', targetFormat);
    formData.append('targetQuality', `${targetQuality}p`);

    try {
      const response = await axios.post(`${API_URL}/convert/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setJobId(response.data.data.jobId);
      } else {
        throw new Error(response.data.error || 'Conversion failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Conversion failed');
      setStatus('idle');
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const cleanUrl = downloadUrl.replace(/^\/api/, '');
      window.location.href = `${API_URL}${cleanUrl}`;
      
      setTimeout(() => {
        setStatus('idle');
        setFile(null);
        setDownloadUrl('');
        setJobId(null);
        setProgress(0);
      }, 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Video Converter
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Convert Video Files
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert videos between different formats: MP4, AVI, MKV, WebM, MOV. 
            Adjust quality and resolution easily.
          </p>
        </div>

        {/* Converter Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Format Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Format
                </label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="mp4">MP4</option>
                  <option value="avi">AVI</option>
                  <option value="mkv">MKV</option>
                  <option value="webm">WebM</option>
                  <option value="mov">MOV</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality
                </label>
                <select
                  value={targetQuality}
                  onChange={(e) => setTargetQuality(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="480">480p</option>
                  <option value="720">720p HD</option>
                  <option value="1080">1080p Full HD</option>
                  <option value="1440">1440p 2K</option>
                  <option value="2160">2160p 4K</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={status === 'ready' ? handleDownload : handleConvert}
              disabled={!file || status === 'converting'}
              className={`w-full py-4 rounded-lg font-semibold transition-colors text-lg ${
                status === 'ready'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {status === 'converting' ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Converting... {progress}%
                </span>
              ) : status === 'ready' ? (
                '⬇️ Download Converted Video'
              ) : (
                'Convert Video'
              )}
            </button>

            {/* Progress Bar */}
            {status === 'converting' && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            {/* Download Link */}
            {downloadUrl && status === 'ready' && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <p className="text-green-700 font-semibold">✓ Conversion complete! Click the button above to download.</p>
              </div>
            )}
          </div>
        </div>

        {/* Supported Formats */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Supported Formats</h2>
          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">📹</div>
              <div className="font-semibold">MP4</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎬</div>
              <div className="font-semibold">AVI</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎥</div>
              <div className="font-semibold">MKV</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🌐</div>
              <div className="font-semibold">WebM</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎞️</div>
              <div className="font-semibold">MOV</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
