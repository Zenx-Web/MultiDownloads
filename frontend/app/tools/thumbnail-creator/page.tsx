'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus, resolveDownloadUrl } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ThumbnailCreatorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState(200);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError('');
      setDownloadUrl('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCreate = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('size', size.toString());

    try {
      const response = await fetch(`${API_URL}/document/create-thumbnail`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Thumbnail creation failed');
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
            setError(job.error || 'Thumbnail creation failed');
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
        setError('Thumbnail creation timed out');
        setLoading(false);
      }, 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create thumbnail');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thumbnail Creator
          </h1>
          <p className="text-lg text-gray-600">
            Create small preview images perfect for websites and galleries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Creator Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  {file.name} ({(file.size / 1024).toFixed(0)} KB)
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Size: {size}px
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50px (tiny)</span>
                <span>500px (large)</span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Preview:</strong> Thumbnail will be {size}×{size}px (maintains aspect ratio)
              </p>
            </div>

            <button
              onClick={handleCreate}
              disabled={!file || loading}
              className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Thumbnail'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {downloadUrl && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">✓ Thumbnail created!</p>
                <a
                  href={downloadUrl}
                  download
                  className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Download Thumbnail
                </a>
              </div>
            )}

            {loading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                <span className="ml-3 text-gray-600">Creating thumbnail...</span>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Original Image</h3>
            {preview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-96 object-contain"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-400">
                No image selected
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Thumbnail Creator</h2>
          <div className="space-y-3 text-gray-600">
            <p>• Create small preview images (50-500px)</p>
            <p>• Perfect for website galleries and previews</p>
            <p>• Maintains aspect ratio automatically</p>
            <p>• Fast loading for web optimization</p>
            <p>• Supports JPG, PNG, WebP, GIF formats</p>
            <p>• Maximum file size: 100MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
