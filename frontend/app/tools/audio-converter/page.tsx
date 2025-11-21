'use client';

import { useState } from 'react';
import axios from 'axios';
import ProgressTracker from '@/components/ProgressTracker';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AudioConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('mp3');
  const [bitrate, setBitrate] = useState('192');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setJobId(null);
      setStatusMessage('');
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    setIsConverting(true);
    setError('');
    setStatusMessage('');
    setJobId(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    formData.append('bitrate', `${bitrate}k`);

    try {
      const response = await axios.post(`${API_URL}/convert/audio`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success && response.data?.data?.jobId) {
        setJobId(response.data.data.jobId);
        setStatusMessage(
          response.data.data.message || 'Audio conversion started. You can monitor progress below.'
        );
      } else {
        throw new Error(response.data?.error || 'Conversion failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setJobId(null);
    setFile(null);
    setStatusMessage('');
    setError('');
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

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Upload & Convert Audio</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audio File</label>
                <input
                  type="file"
                  accept="audio/*,video/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {file && (
                  <p className="text-xs text-gray-500 mt-2">
                    {file.name} • {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Format</label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="mp3">MP3</option>
                    <option value="aac">AAC</option>
                    <option value="wav">WAV</option>
                    <option value="flac">FLAC</option>
                    <option value="ogg">OGG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bitrate</label>
                  <select
                    value={bitrate}
                    onChange={(e) => setBitrate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="128">128 kbps</option>
                    <option value="192">192 kbps</option>
                    <option value="256">256 kbps</option>
                    <option value="320">320 kbps</option>
                  </select>
                </div>
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
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isConverting ? 'Starting conversion...' : 'Convert Audio'}
              </button>
            </div>
          </div>

          {jobId && (
            <div className="mt-10">
              <ProgressTracker jobId={jobId} onReset={handleReset} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
