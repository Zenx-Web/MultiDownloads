'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PdfSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setDownloadUrl('');
    }
  };

  const handleSplit = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/document/split-pdf`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Split failed');
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
          setDownloadUrl(fullUrl);
          setLoading(false);
        } else if (statusData.status === 'failed') {
          clearInterval(pollInterval);
          setError(statusData.error || 'Split failed');
          setLoading(false);
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (loading) {
          setError('Split timed out');
          setLoading(false);
        }
      }, 300000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to split PDF');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF Splitter
          </h1>
          <p className="text-lg text-gray-600">
            Split a multi-page PDF into individual page files
          </p>
        </div>

        {/* Splitter Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF File
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Each page of your PDF will be saved as a separate file. All files will be packaged in a ZIP archive for easy download.
            </p>
          </div>

          <button
            onClick={handleSplit}
            disabled={!file || loading}
            className="w-full bg-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Splitting...' : 'Split PDF into Pages'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium mb-2">✓ Split completed!</p>
              <a
                href={downloadUrl}
                download
                className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Download ZIP Archive
              </a>
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-gray-600">Splitting PDF...</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About PDF Splitter</h2>
          <div className="space-y-3 text-gray-600">
            <p>• Split multi-page PDFs into individual files</p>
            <p>• Each page becomes a separate PDF</p>
            <p>• All files packaged in a ZIP archive</p>
            <p>• Preserves original PDF quality</p>
            <p>• Perfect for extracting specific pages</p>
            <p>• Maximum file size: 100MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
