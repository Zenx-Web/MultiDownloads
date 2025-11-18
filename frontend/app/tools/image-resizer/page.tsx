'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
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

  const handleResize = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    if (!width && !height) {
      setError('Please enter at least width or height');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('file', file);
    if (width) formData.append('width', width);
    if (height) formData.append('height', height);
    formData.append('maintainAspectRatio', maintainAspectRatio.toString());

    try {
      const response = await fetch('http://localhost:5000/api/document/resize-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Resize failed');
      }

      // Poll for job status
      const jobId = data.jobId;
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`http://localhost:5000/api/job/${jobId}`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'completed') {
          clearInterval(pollInterval);
          setDownloadUrl(statusData.downloadUrl);
          setLoading(false);
        } else if (statusData.status === 'failed') {
          clearInterval(pollInterval);
          setError(statusData.error || 'Resize failed');
          setLoading(false);
        }
      }, 1000);

      // Timeout after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (loading) {
          setError('Resize timed out');
          setLoading(false);
        }
      }, 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resize image');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Resizer
          </h1>
          <p className="text-lg text-gray-600">
            Resize your images to custom dimensions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resizer Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  {file.name} ({(file.size / 1024).toFixed(0)} KB)
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (px)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="e.g., 800"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (px)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 600"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Maintain aspect ratio</span>
              </label>
              <p className="mt-1 text-xs text-gray-500">
                If checked, the image will scale proportionally
              </p>
            </div>

            <button
              onClick={handleResize}
              disabled={!file || loading || (!width && !height)}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Resizing...' : 'Resize Image'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {downloadUrl && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">✓ Resize completed!</p>
                <a
                  href={downloadUrl}
                  download
                  className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Download Resized Image
                </a>
              </div>
            )}

            {loading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Processing...</span>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Image Resizer</h2>
          <div className="space-y-3 text-gray-600">
            <p>• Resize images to custom width and height</p>
            <p>• Maintain aspect ratio or set exact dimensions</p>
            <p>• Supports JPG, PNG, WebP, GIF formats</p>
            <p>• High-quality image processing</p>
            <p>• Maximum file size: 100MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
