'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressTracker from '@/components/ProgressTracker';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const RESOLUTION_OPTIONS = [
  { value: '', label: 'Original (Auto-detect)' },
  { value: '640x360', label: '360p (Smallest file)' },
  { value: '854x480', label: '480p (SD)' },
  { value: '1280x720', label: '720p (HD)' },
  { value: '1920x1080', label: '1080p (Full HD)' },
  { value: '2560x1440', label: '1440p (2K)' },
  { value: '3840x2160', label: '2160p (4K)' },
];

export default function VideoConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [targetFormat, setTargetFormat] = useState('mp4');
  const [targetResolution, setTargetResolution] = useState('1280x720');
  const [jobId, setJobId] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError('');
      setStatusMessage('');
      setJobId(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setIsConverting(true);
    setError('');
    setStatusMessage('');
    setJobId(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    if (targetResolution) {
      formData.append('targetResolution', targetResolution);
    }

    try {
      const response = await axios.post(`${API_URL}/convert/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success && response.data?.data?.jobId) {
        setJobId(response.data.data.jobId);
        setStatusMessage(
          response.data.data.message || 'Conversion started. Keep this page open while we process your file.'
        );
      } else {
        throw new Error(response.data?.error || 'Conversion failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Conversion failed');
    }
    finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl('');
    setJobId(null);
    setStatusMessage('');
    setError('');
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
            Convert long-form or short-form videos between MP4, AVI, MKV, WebM, and MOV while staying under
            free-tier limits. Choose the resolution that fits your workflow and let our servers do the heavy lifting.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Video</h3>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />

              {file && (
                <div className="mt-4 space-y-3 text-sm text-gray-600">
                  <div className="font-medium text-gray-800">Selected File</div>
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <span className="truncate mr-4">{file.name}</span>
                    <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                </div>
              )}

              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview</p>
                  <video src={previewUrl} controls className="w-full rounded-lg shadow-inner bg-black" />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Conversion Options</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Format</label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                    <option value="mkv">MKV</option>
                    <option value="avi">AVI</option>
                    <option value="webm">WebM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                  <select
                    value={targetResolution}
                    onChange={(e) => setTargetResolution(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {RESOLUTION_OPTIONS.map((option) => (
                      <option key={option.value || 'original'} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {statusMessage && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                    {statusMessage}
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleConvert}
                  disabled={!file || isConverting}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isConverting ? 'Starting conversion...' : 'Convert Video'}
                </button>
              </div>
            </div>
          </div>

          {jobId && (
            <div className="mt-10">
              <ProgressTracker jobId={jobId} onReset={handleReset} />
            </div>
          )}
        </div>

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
