'use client';

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function VideoConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('mp4');
  const [targetQuality, setTargetQuality] = useState('720');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setDownloadUrl('');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a video file');
      return;
    }

    setIsConverting(true);
    setError('');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('targetFormat', targetFormat);
    formData.append('targetQuality', `${targetQuality}p`);

    try {
      const response = await axios.post(`${API_URL}/convert/video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setDownloadUrl(response.data.downloadUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Conversion failed');
    } finally {
      setIsConverting(false);
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
              onClick={handleConvert}
              disabled={!file || isConverting}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isConverting ? 'Converting...' : 'Convert Video'}
            </button>

            {/* Download Link */}
            {downloadUrl && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-700 mb-2">Conversion complete!</p>
                <a
                  href={`${API_URL}${downloadUrl}`}
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Converted Video
                </a>
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
