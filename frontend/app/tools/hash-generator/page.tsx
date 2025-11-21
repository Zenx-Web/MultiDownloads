'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function HashGeneratorPage() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [algorithm, setAlgorithm] = useState('sha256');
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text && !file) {
      setError('Please enter text or select a file');
      return;
    }

    setLoading(true);
    setError('');
    setHash('');

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text) formData.append('text', text);
    formData.append('algorithm', algorithm);

    try {
      const response = await fetch(`${API_URL}/utility/hash`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      const jobId = data.jobId;
      const pollInterval = setInterval(async () => {
        try {
          const jobData = await fetchJobStatus(jobId, API_URL);

          if (jobData.status === 'completed') {
            clearInterval(pollInterval);
            setHash(jobData.metadata?.hash || '');
            setLoading(false);
          } else if (jobData.status === 'failed') {
            clearInterval(pollInterval);
            setError(jobData.error || 'Generation failed');
            setLoading(false);
          }
        } catch (pollError) {
          console.error('Hash status check failed:', pollError);
        }
      }, 500);

      setTimeout(() => clearInterval(pollInterval), 60000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate hash');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hash Generator</h1>
          <p className="text-lg text-gray-600">
            Generate cryptographic hashes for files or text
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hash Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
            >
              <option value="md5">MD5</option>
              <option value="sha1">SHA-1</option>
              <option value="sha256">SHA-256</option>
              <option value="sha512">SHA-512</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Input
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to hash..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Select File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={(!text && !file) || loading}
            className="w-full bg-slate-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-slate-800 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Generating...' : 'Generate Hash'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {hash && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium mb-2">✓ Hash Generated!</p>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="font-mono text-sm break-all">{hash}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(hash)}
                className="mt-3 bg-green-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-700"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About Hash Functions</h2>
          <div className="space-y-3 text-gray-600 text-sm">
            <p>• <strong>MD5:</strong> Fast but not secure (128-bit)</p>
            <p>• <strong>SHA-1:</strong> Deprecated for security (160-bit)</p>
            <p>• <strong>SHA-256:</strong> Secure and widely used (256-bit)</p>
            <p>• <strong>SHA-512:</strong> Most secure option (512-bit)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
