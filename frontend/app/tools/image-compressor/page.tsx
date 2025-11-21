'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus, resolveDownloadUrl } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [originalSize, setOriginalSize] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
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

  const handleCompress = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality.toString());

    try {
      const response = await fetch(`${API_URL}/document/compress-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Compression failed');
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
            setError(job.error || 'Compression failed');
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
        setError('Compression timed out');
        setLoading(false);
      }, 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compress image');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Image Compressor
          </h1>
          <p className="text-lg text-gray-600">
            Reduce image file size while maintaining quality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compressor Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {file && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>{file.name}</p>
                  <p className="font-semibold">Original size: {(originalSize / 1024).toFixed(0)} KB</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality: {quality}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Lower quality (smaller file)</span>
                <span>Higher quality (larger file)</span>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Start with 80% quality for a good balance between file size and image quality.
              </p>
            </div>

            <button
              onClick={handleCompress}
              disabled={!file || loading}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Compressing...' : 'Compress Image'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {downloadUrl && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">✓ Compression completed!</p>
                <a
                  href={downloadUrl}
                  download
                  className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Download Compressed Image
                </a>
              </div>
            )}

            {loading && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <span className="ml-3 text-gray-600">Compressing...</span>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Image Compressor</h2>
          <div className="space-y-3 text-gray-600">
            <p>• Reduce image file size significantly</p>
            <p>• Adjustable quality settings (1-100%)</p>
            <p>• Supports JPG, PNG, WebP formats</p>
            <p>• Perfect for web optimization</p>
            <p>• Fast processing with minimal quality loss</p>
            <p>• Maximum file size: 100MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
