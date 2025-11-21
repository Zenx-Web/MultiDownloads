'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus, resolveDownloadUrl, type JobStatusPayload } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [jobProgress, setJobProgress] = useState<number | null>(null);
  const [jobMessage, setJobMessage] = useState('');
  const [jobState, setJobState] = useState<JobStatusPayload['status'] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setDownloadUrl('');
      setJobProgress(null);
      setJobMessage('');
      setJobState(null);
    }
  };

  const handleConvert = async () => {
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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/document/pdf-to-docx`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Conversion failed');
      }

      // Poll for job status
      const jobId = data.jobId;
      let isActive = true;
      let timeoutId: ReturnType<typeof setTimeout>;

      const pollInterval = setInterval(async () => {
        try {
          const job = await fetchJobStatus(jobId, API_URL);
          setJobProgress((prev) => (typeof job.progress === 'number' ? job.progress : prev));
          setJobMessage(job.message || 'Processing your document...');
          setJobState(job.status);

          if (job.status === 'completed') {
            isActive = false;
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            const fullUrl = resolveDownloadUrl(job.downloadUrl, API_URL);
            setDownloadUrl(fullUrl);
            setJobProgress(100);
            setJobMessage(job.message || 'Conversion complete!');
            setLoading(false);
          } else if (job.status === 'failed') {
            isActive = false;
            clearInterval(pollInterval);
            clearTimeout(timeoutId);
            setError(job.error || 'Conversion failed');
            setJobMessage(job.error || 'Conversion failed');
            setLoading(false);
          }
        } catch (pollError) {
          isActive = false;
          clearInterval(pollInterval);
          clearTimeout(timeoutId);
          setError(pollError instanceof Error ? pollError.message : 'Failed to fetch job status');
          setJobMessage('Unable to track conversion progress');
          setJobState(null);
          setJobProgress(null);
          setLoading(false);
        }
      }, 1000);

      // Timeout after 5 minutes
      timeoutId = setTimeout(() => {
        if (!isActive) {
          return;
        }
        clearInterval(pollInterval);
        setError('Conversion timed out');
        setJobMessage('Conversion timed out');
        setJobState(null);
        setJobProgress(null);
        setLoading(false);
      }, 300000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert PDF');
      setJobMessage('');
      setJobState(null);
      setJobProgress(null);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF to Word Converter
          </h1>
          <p className="text-lg text-gray-600">
            Convert your PDF documents to editable Word files
          </p>
        </div>

        {/* Converter Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select PDF File
            </label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            onClick={handleConvert}
            disabled={!file || loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Converting...' : 'Convert to Word'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium mb-2">✓ Conversion completed!</p>
              <a
                href={downloadUrl}
                download
                className="inline-block bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Download Word Document
              </a>
            </div>
          )}

          {loading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {jobMessage || 'Preparing your document...'}
                </span>
                {typeof jobProgress === 'number' && (
                  <span className="text-sm text-gray-600">{jobProgress}%</span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${Math.min(Math.max(jobProgress ?? 15, 5), 100)}%` }}
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About PDF to Word Converter</h2>
          <div className="space-y-3 text-gray-600">
            <p>• Extract text content from PDF documents</p>
            <p>• Generate editable Word (.docx) files</p>
            <p>• Preserve text formatting when possible</p>
            <p>• Support for multi-page PDFs</p>
            <p>• Maximum file size: 100MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
