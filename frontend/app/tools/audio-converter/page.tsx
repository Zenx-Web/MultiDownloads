'use client';

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AudioConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('mp3');
  const [bitrate, setBitrate] = useState('192');
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
      setError('Please select an audio file');
      return;
    }

    setIsConverting(true);
    setError('');

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('targetFormat', targetFormat);
    formData.append('bitrate', `${bitrate}k`);

    try {
      const response = await axios.post(`${API_URL}/convert/audio`, formData, {
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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Audio Converter
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Convert Audio Files
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert audio between different formats: MP3, WAV, AAC, FLAC, OGG. 
            Adjust bitrate for quality and file size.
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-green-100 to-teal-100 rounded-lg shadow-xl p-12 text-center">
          <div className="text-6xl mb-6">🎵</div>
          <h2 className="text-3xl font-bold mb-4 text-green-900">Audio Converter Coming Soon!</h2>
          <p className="text-lg text-gray-700 mb-6">
            We're working on bringing you a powerful audio converter. 
            This feature will be available soon!
          </p>
          <div className="bg-white/50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Current Features Available:</h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li>✅ YouTube to MP3 Converter (Extract Audio)</li>
              <li>✅ YouTube Video Downloader</li>
              <li>✅ Instagram & Facebook Downloaders</li>
              <li>✅ Image Tools & QR Generator</li>
            </ul>
          </div>
          <a
            href="/"
            className="inline-block mt-8 bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Go to Home
          </a>
        </div>
          <div className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Audio File
              </label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                  <option value="aac">AAC</option>
                  <option value="flac">FLAC</option>
                  <option value="ogg">OGG</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitrate (Quality)
                </label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="128">128 kbps</option>
                  <option value="192">192 kbps (Recommended)</option>
                  <option value="256">256 kbps</option>
                  <option value="320">320 kbps (Best)</option>
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
              className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isConverting ? 'Converting...' : 'Convert Audio'}
            </button>

            {/* Download Link */}
            {downloadUrl && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-700 mb-2">Conversion complete!</p>
                <a
                  href={`${API_URL}${downloadUrl}`}
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Converted Audio
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Supported Formats */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Supported Audio Formats</h2>
          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎵</div>
              <div className="font-semibold">MP3</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎶</div>
              <div className="font-semibold">WAV</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎧</div>
              <div className="font-semibold">AAC</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎼</div>
              <div className="font-semibold">FLAC</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🔊</div>
              <div className="font-semibold">OGG</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
