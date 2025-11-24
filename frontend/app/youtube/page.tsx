'use client';

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import ProgressTracker from '@/components/ProgressTracker';

export default function YouTubePage() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            YouTube Downloader
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Download YouTube Videos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Download YouTube videos in high quality, convert to MP3, or extract audio. 
            Support for 720p, 1080p, and 4K resolution downloads.
          </p>
        </div>

        {/* Download Form */}
        <div className="max-w-4xl mx-auto mb-16">
          <DownloadForm onJobCreated={setJobId} />
          {jobId && (
            <div className="mt-8">
              <ProgressTracker jobId={jobId} onReset={() => setJobId(null)} />
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">YouTube Downloader Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-xl font-semibold mb-2">HD Quality</h3>
              <p className="text-gray-600">Download YouTube videos in 720p, 1080p, or even 4K resolution</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold mb-2">Audio Extraction</h3>
              <p className="text-gray-600">Convert YouTube videos to MP3 with high audio quality</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Fast Downloads</h3>
              <p className="text-gray-600">Quick processing and download speeds for all YouTube videos</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How to Download YouTube Videos</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4 items-start">
            <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Copy YouTube URL</h3>
              <p className="text-gray-600">Go to YouTube, find the video you want, and copy its URL from the address bar</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Paste URL</h3>
              <p className="text-gray-600">Paste the YouTube video URL into the input box above and click "Get Info"</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Choose Quality & Download</h3>
              <p className="text-gray-600">Select your preferred video quality or audio format, then click download</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Is it free to download YouTube videos?</h3>
              <p className="text-gray-600">Yes! Free users get 5 downloads per day with up to 720p quality. Premium users get unlimited downloads in 4K.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">What video qualities are available?</h3>
              <p className="text-gray-600">We support 360p, 480p, 720p HD, 1080p Full HD, and 4K resolution downloads depending on the original video quality.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Can I convert YouTube to MP3?</h3>
              <p className="text-gray-600">Absolutely! Select "Extract Audio (MP3)" option to convert any YouTube video to high-quality MP3 audio.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
