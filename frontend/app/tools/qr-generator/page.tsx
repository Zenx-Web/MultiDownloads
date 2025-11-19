'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(300);
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text) {
      setError('Please enter text or URL');
      return;
    }

    setLoading(true);
    setError('');
    setQrCodeUrl('');

    try {
      const response = await fetch(`${API_URL}/utility/qr-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, size }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      // Poll for job status
      const jobId = data.jobId;
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`${API_URL}/job/${jobId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'completed') {
          clearInterval(pollInterval);
          const fullUrl = statusData.downloadUrl.startsWith('http') 
            ? statusData.downloadUrl 
            : `${API_URL}${statusData.downloadUrl}`;
          setQrCodeUrl(fullUrl);
          setLoading(false);
        } else if (statusData.status === 'failed') {
          clearInterval(pollInterval);
          setError(statusData.error || 'Generation failed');
          setLoading(false);
        }
      }, 500);

      setTimeout(() => clearInterval(pollInterval), 60000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">QR Code Generator</h1>
          <p className="text-lg text-gray-600">
            Create QR codes from text, URLs, or contact information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text or URL
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL or text..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!text || loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate QR Code'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            {qrCodeUrl ? (
              <div>
                <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
                <a
                  href={qrCodeUrl}
                  download
                  className="block w-full bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 text-center"
                >
                  Download QR Code
                </a>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-400">
                Your QR code will appear here
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Use Cases</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>• Website links</div>
            <div>• Contact information</div>
            <div>• WiFi credentials</div>
            <div>• Social media profiles</div>
            <div>• Product information</div>
            <div>• Event tickets</div>
          </div>
        </div>
      </div>
    </div>
  );
}
