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

        {/* Coming Soon Notice */}
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow-xl p-12 text-center">
          <div className="text-6xl mb-6">🎬</div>
          <h2 className="text-3xl font-bold mb-4 text-purple-900">Video Converter Coming Soon!</h2>
          <p className="text-lg text-gray-700 mb-6">
            We're working on bringing you a powerful video converter with client-side processing. 
            This feature will be available soon!
          </p>
          <div className="bg-white/50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Meanwhile, you can use:</h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li>✅ YouTube Video Downloader (MP4/MP3)</li>
              <li>✅ Instagram Video Downloader</li>
              <li>✅ Facebook Video Downloader</li>
              <li>✅ Image Tools (QR Generator, Resizer, Compressor)</li>
            </ul>
          </div>
          <a
            href="/"
            className="inline-block mt-8 bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Go to Home
          </a>
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
