'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus, resolveDownloadUrl, type JobStatusPayload } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PdfSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [jobProgress, setJobProgress] = useState<number | null>(null);
  const [jobMessage, setJobMessage] = useState('');
  const [jobState, setJobState] = useState<JobStatusPayload['status'] | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setDownloadUrl('');
      setJobProgress(null);
      setJobMessage('');
      setJobState(null);
      setPageCount(null);
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
    setJobProgress(5);
    setJobMessage('Uploading file...');
    setJobState('pending');
    setPageCount(null);

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

      const jobId = data.jobId;
      let isActive = true;
      let timeoutId: ReturnType<typeof setTimeout>;

      const pollInterval = setInterval(async () => {
        try {
          const job = await fetchJobStatus(jobId, API_URL);
          setJobProgress((prev) => (typeof job.progress === 'number' ? job.progress : prev));
          setJobMessage(job.message || 'Splitting PDF...');
          setJobState(job.status);
          setPageCount((prev) => (typeof job.metadata?.pageCount === 'number' ? job.metadata.pageCount : prev));

          if (job.status === 'completed') {
            isActive = false;
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setDownloadUrl(resolveDownloadUrl(job.downloadUrl, API_URL));
            setJobProgress(100);
            setJobMessage(job.message || 'Split completed!');
            setPageCount((prev) => (typeof job.metadata?.pageCount === 'number' ? job.metadata.pageCount : prev));
            setLoading(false);
          } else if (job.status === 'failed') {
            isActive = false;
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setError(job.error || 'Split failed');
            setJobMessage(job.error || 'Split failed');
            setLoading(false);
          }
        } catch (pollError) {
          isActive = false;
          clearInterval(pollInterval);
          clearTimeout(timeoutId);
          setError(pollError instanceof Error ? pollError.message : 'Failed to fetch job status');
          setJobMessage('Unable to track split progress');
          setJobState(null);
          setJobProgress(null);
          setLoading(false);
        }
      }, 1000);

      timeoutId = setTimeout(() => {
        if (!isActive) {
          return;
        }
        clearInterval(pollInterval);
        setError('Split timed out');
        setJobMessage('Split timed out');
        setJobState(null);
        setJobProgress(null);
        setLoading(false);
      }, 300000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to split PDF');
      setJobMessage('');
      setJobState(null);
      setJobProgress(null);
      setPageCount(null);
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
              {typeof pageCount === 'number' && (
                <p className="text-sm text-gray-700 mb-2">
                  Generated {pageCount} page{pageCount === 1 ? '' : 's'} packaged in a ZIP archive.
                </p>
              )}
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
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {jobMessage || 'Splitting PDF...'}
                </span>
                {typeof jobProgress === 'number' && (
                  <span className="text-sm text-gray-600">{jobProgress}%</span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-cyan-600 transition-all duration-300"
                  style={{ width: `${Math.min(Math.max(jobProgress ?? 10, 5), 100)}%` }}
                ></div>
              </div>
              {jobState && (
                <p className="text-xs text-gray-500 mt-2 capitalize">Status: {jobState}</p>
              )}
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
