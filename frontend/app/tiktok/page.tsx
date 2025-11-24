'use client';

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import ProgressTracker from '@/components/ProgressTracker';

export default function TikTokPage() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            TikTok Downloader
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Download TikTok Videos
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Download TikTok videos without watermark in HD quality. 
            Save TikTok videos to your device easily and quickly.
          </p>
        </div>

        {/* Download Form */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
            <DownloadForm onJobCreated={setJobId} />
          </div>
          {jobId && (
            <div className="mt-8">
              <ProgressTracker jobId={jobId} onReset={() => setJobId(null)} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/5 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">TikTok Downloader Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-semibold mb-2">No Watermark</h3>
              <p className="text-gray-300">Download TikTok videos without the TikTok watermark</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">HD Quality</h3>
              <p className="text-gray-300">Save videos in original high-definition quality</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Super Fast</h3>
              <p className="text-gray-300">Lightning-fast downloads with no limits</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How to Download TikTok Videos</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4 items-start bg-white/5 p-4 rounded-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Open TikTok</h3>
              <p className="text-gray-300">Find the TikTok video you want to download</p>
            </div>
          </div>
          <div className="flex gap-4 items-start bg-white/5 p-4 rounded-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Copy Link</h3>
              <p className="text-gray-300">Tap the Share button and select "Copy link"</p>
            </div>
          </div>
          <div className="flex gap-4 items-start bg-white/5 p-4 rounded-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Download Without Watermark</h3>
              <p className="text-gray-300">Paste the link above and download your TikTok video in HD</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white/5 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Can I download TikTok videos without watermark?</h3>
              <p className="text-gray-300">Yes! Our tool removes the TikTok watermark and provides clean video downloads.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Is it free to download TikTok videos?</h3>
              <p className="text-gray-300">Yes, completely free! Free users get 5 downloads per day, premium users get unlimited access.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">What devices are supported?</h3>
              <p className="text-gray-300">Works on all devices - iPhone, Android, Windows, Mac, and tablets.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
