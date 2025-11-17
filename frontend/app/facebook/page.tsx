'use client';

import { useState } from 'react';
import DownloadForm from '@/components/DownloadForm';
import ProgressTracker from '@/components/ProgressTracker';

export default function FacebookPage() {
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Facebook Video Downloader
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Download Facebook Videos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Download Facebook videos, Watch videos, and live streams in HD quality. 
            Fast, secure, and completely free.
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
          <h2 className="text-3xl font-bold text-center mb-12">Facebook Downloader Features</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-xl font-semibold mb-2">All Video Types</h3>
              <p className="text-gray-600">Download regular videos, Watch content, and live recordings</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">HD Quality</h3>
              <p className="text-gray-600">Save Facebook videos in high definition quality</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600">Simple process - paste link and download instantly</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How to Download Facebook Videos</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex gap-4 items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Find Your Video</h3>
              <p className="text-gray-600">Go to Facebook and find the video you want to download</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Copy Video Link</h3>
              <p className="text-gray-600">Click the three dots on the video post and select "Copy link"</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Download</h3>
              <p className="text-gray-600">Paste the link above, click "Get Info", then download your video</p>
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
              <h3 className="font-semibold text-lg mb-2">Can I download private Facebook videos?</h3>
              <p className="text-gray-600">Our tool works best with public Facebook videos. For private videos, you need appropriate access permissions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Does this work with Facebook Watch?</h3>
              <p className="text-gray-600">Yes! You can download videos from Facebook Watch, regular posts, and pages.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">What quality can I download?</h3>
              <p className="text-gray-600">We automatically download in the best available quality, typically HD or the original upload quality.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
