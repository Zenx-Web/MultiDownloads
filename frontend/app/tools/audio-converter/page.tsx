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
      </section>
    </main>
  );
}
