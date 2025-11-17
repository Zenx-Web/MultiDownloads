'use client';

import { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import ProgressTracker from '@/components/ProgressTracker';

export default function HomePage() {
  const [jobId, setJobId] = useState<string | null>(null);

  const handleJobCreated = (id: string) => {
    setJobId(id);
  };

  const handleReset = () => {
    setJobId(null);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Download & Convert Media
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Download videos from YouTube, Instagram, Facebook, Pinterest and more. Convert any media
          format with ease.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {!jobId ? (
          <DownloadForm onJobCreated={handleJobCreated} />
        ) : (
          <ProgressTracker jobId={jobId} onReset={handleReset} />
        )}
      </div>

      {/* Features Section */}
      <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">🎥</div>
          <h3 className="text-xl font-semibold mb-2">Multi-Platform Support</h3>
          <p className="text-gray-600">
            Download from YouTube, Instagram, Facebook, Pinterest, and many more platforms.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-xl font-semibold mb-2">Format Conversion</h3>
          <p className="text-gray-600">
            Convert videos, audio, and images to any format you need. MP4, MP3, PNG, and more.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
          <p className="text-gray-600">
            High-speed downloads with quality options up to 4K. Upgrade to premium for unlimited
            access.
          </p>
        </div>
      </div>
    </div>
  );
}
