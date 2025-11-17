'use client';

import { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import ProgressTracker from '@/components/ProgressTracker';

export default function InstagramPage() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Instagram Downloader
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Download Instagram Videos & Photos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Download Instagram videos, reels, IGTV, and photos in original quality. 
            Fast, free, and no login required.
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
          <h2 className="text-3xl font-bold text-center mb-12">Instagram Downloader Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-semibold mb-2">All Content Types</h3>
              <p className="text-gray-600">Download Reels, Stories, IGTV videos, and regular posts</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">Original Quality</h3>
              <p className="text-gray-600">Save videos and photos in their original high quality</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">No Login Required</h3>
              <p className="text-gray-600">Download without logging into your Instagram account</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How to Download Instagram Videos</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4 items-start">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Copy Instagram Link</h3>
              <p className="text-gray-600">Open Instagram, tap the three dots on any post/reel, and select "Copy Link"</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Paste URL Above</h3>
              <p className="text-gray-600">Paste the Instagram URL into the input field and click "Get Info"</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Download</h3>
              <p className="text-gray-600">Click the download button and save the video or photo to your device</p>
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
              <h3 className="font-semibold text-lg mb-2">Can I download Instagram Reels?</h3>
              <p className="text-gray-600">Yes! Our tool supports downloading Instagram Reels, Stories, IGTV, and regular video posts.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Do I need to log in to Instagram?</h3>
              <p className="text-gray-600">No login required! Simply paste the link and download. Works for public Instagram posts.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Is the quality preserved?</h3>
              <p className="text-gray-600">Yes, we download Instagram content in the original quality uploaded by the creator.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
