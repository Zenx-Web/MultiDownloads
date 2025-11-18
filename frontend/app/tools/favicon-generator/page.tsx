'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FaviconGeneratorPage() {
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

  const handleGenerate = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/utility/favicon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
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
          setError(statusData.error || 'Generation failed');
          setLoading(false);
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate favicon');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Favicon Generator</h1>
          <p className="text-lg text-gray-600">
            Create multi-size .ico favicons for your website
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          {preview && (
            <div className="mb-6 flex justify-center">
              <img src={preview} alt="Preview" className="max-w-xs rounded-lg shadow-md" />
            </div>
          )}

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Favicon will be generated in multiple sizes (16×16, 32×32, 48×48) and packaged as .ico format.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!file || loading}
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate Favicon'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium mb-3">✓ Favicon generated successfully!</p>
              <a
                href={downloadUrl}
                download="favicon.ico"
                className="block w-full bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 text-center"
              >
                Download favicon.ico
              </a>
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-gray-600">Creating favicon...</span>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h2>
          <div className="space-y-3 text-gray-600 text-sm">
            <p>1. Upload a square image (recommended 512×512 or larger)</p>
            <p>2. Click "Generate Favicon" to create the .ico file</p>
            <p>3. Download and place in your website root directory</p>
            <p>4. Add to HTML: <code className="bg-gray-100 px-2 py-1 rounded">&lt;link rel="icon" href="/favicon.ico"&gt;</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
