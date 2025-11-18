'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PdfMergerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setError('');
      setDownloadUrl('');
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFileUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveFileDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl('');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:5000/api/document/merge-pdfs', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Merge failed');
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
          setError(statusData.error || 'Merge failed');
          setLoading(false);
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (loading) {
          setError('Merge timed out');
          setLoading(false);
        }
      }, 300000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to merge PDFs');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF Merger
          </h1>
          <p className="text-lg text-gray-600">
            Combine multiple PDF files into a single document
          </p>
        </div>

        {/* Merger Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF Files
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            <p className="mt-2 text-xs text-gray-500">
              You can select multiple PDF files at once
            </p>
          </div>

          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Selected Files ({files.length}) - PDFs will be merged in this order:
              </h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="text-sm font-semibold text-gray-700 mr-3">
                        {index + 1}.
                      </span>
                      <span className="text-sm text-gray-600 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => moveFileUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveFileDown(index)}
                        disabled={index === files.length - 1}
                        className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleMerge}
            disabled={files.length < 2 || loading}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Merging...' : `Merge ${files.length} PDFs`}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium mb-2">✓ Merge completed!</p>
              <a
                href={downloadUrl}
                download
                className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Download Merged PDF
              </a>
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Merging PDFs...</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About PDF Merger</h2>
          <div className="space-y-3 text-gray-600">
            <p>• Combine multiple PDFs into one document</p>
            <p>• Drag files to reorder before merging</p>
            <p>• Preserves original PDF quality</p>
            <p>• No file count limit</p>
            <p>• Perfect for organizing documents</p>
            <p>• Maximum file size per PDF: 100MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
