'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus, resolveDownloadUrl } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function BackgroundRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemove = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/media/remove-background`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Background removal failed');
      }

      const jobId = data.jobId;

      let isActive = true;
      let timeoutId: ReturnType<typeof setTimeout>;

      const pollInterval = setInterval(async () => {
        try {
          const job = await fetchJobStatus(jobId, API_URL);

          if (job.status === 'completed') {
            isActive = false;
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setDownloadUrl(resolveDownloadUrl(job.downloadUrl, API_URL));
            setLoading(false);
          } else if (job.status === 'failed') {
            isActive = false;
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setError(job.error || 'Background removal failed');
            setLoading(false);
          }
        } catch (pollError) {
          isActive = false;
          clearInterval(pollInterval);
          clearTimeout(timeoutId);
          setError(pollError instanceof Error ? pollError.message : 'Failed to fetch job status');
          setLoading(false);
        }
      }, 1000);

      timeoutId = setTimeout(() => {
        if (!isActive) {
          return;
        }
        clearInterval(pollInterval);
        setError('Background removal timed out');
        setLoading(false);
      }, 180000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove background');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Background Remover</h1>
          <p className="text-lg text-gray-600">
            Remove backgrounds from images automatically
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
              />
            </div>

            {preview && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
                <img src={preview} alt="Original" className="w-full rounded-lg" />
              </div>
            )}

            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a basic background removal tool. Works best with images that have clear, light-colored backgrounds.
              </p>
            </div>

            <button
              onClick={handleRemove}
              disabled={!file || loading}
              className="w-full bg-fuchsia-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-fuchsia-700 disabled:bg-gray-400"
            >
              {loading ? 'Removing Background...' : 'Remove Background'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {loading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600"></div>
                <span className="ml-3 text-gray-600">Processing...</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>
            {downloadUrl ? (
              <div>
                <div className="mb-4 bg-gray-100 rounded-lg p-4" style={{ backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px' }}>
                  <img src={downloadUrl} alt="Result" className="w-full rounded-lg" />
                </div>
                <a
                  href={downloadUrl}
                  download
                  className="block w-full bg-fuchsia-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-fuchsia-700 text-center"
                >
                  Download PNG (Transparent)
                </a>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-400">
                Result will appear here
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h2>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>• Use images with solid, light-colored backgrounds</p>
            <p>• Ensure good contrast between subject and background</p>
            <p>• Output is PNG format with transparency</p>
            <p>• Perfect for product photos and profile pictures</p>
          </div>
        </div>
      </div>
    </div>
  );
}
