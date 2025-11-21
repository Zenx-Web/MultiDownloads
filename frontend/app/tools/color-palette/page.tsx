'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus, resolveDownloadUrl } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ColorPalettePage() {
  const [file, setFile] = useState<File | null>(null);
  const [colorCount, setColorCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [paletteUrl, setPaletteUrl] = useState('');
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

  const handleExtract = async () => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('colorCount', colorCount.toString());

    try {
      const response = await fetch(`${API_URL}/utility/color-palette`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const jobId = data.jobId;

      const pollInterval = setInterval(async () => {
        try {
          const jobData = await fetchJobStatus(jobId, API_URL);

          if (jobData.status === 'completed') {
            clearInterval(pollInterval);
            setColors(jobData.metadata?.colors || []);
            setPaletteUrl(resolveDownloadUrl(jobData.downloadUrl, API_URL));
            setLoading(false);
          } else if (jobData.status === 'failed') {
            clearInterval(pollInterval);
            setError(jobData.error || 'Extraction failed');
            setLoading(false);
          }
        } catch (pollError) {
          console.error('Color palette status check failed:', pollError);
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract colors');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Color Palette Extractor</h1>
          <p className="text-lg text-gray-600">
            Extract dominant colors from any image
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
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
              />
            </div>

            {preview && (
              <div className="mb-6">
                <img src={preview} alt="Preview" className="w-full rounded-lg" />
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Colors: {colorCount}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={colorCount}
                onChange={(e) => setColorCount(Number(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>

            <button
              onClick={handleExtract}
              disabled={!file || loading}
              className="w-full bg-rose-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-400"
            >
              {loading ? 'Extracting...' : 'Extract Colors'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Palette</h3>
            {colors.length > 0 ? (
              <div>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-16 h-16 rounded-lg shadow-md"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div className="flex-1">
                        <p className="font-mono text-sm font-semibold">{color}</p>
                        <button
                          onClick={() => navigator.clipboard.writeText(color)}
                          className="text-xs text-rose-600 hover:text-rose-700"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {paletteUrl && (
                  <a
                    href={paletteUrl}
                    download
                    className="block w-full bg-rose-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-rose-700 text-center"
                  >
                    Download Palette Image
                  </a>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-400">
                Colors will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
