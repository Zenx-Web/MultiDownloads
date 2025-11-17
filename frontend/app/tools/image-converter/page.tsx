'use client';

import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState('png');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [quality, setQuality] = useState('80');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

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

  const handleConvert = async () => {
    if (!file) {
      setError('Please select an image file');
      return;
    }

    setIsConverting(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('targetFormat', targetFormat);
    if (width) formData.append('width', width);
    if (height) formData.append('height', height);
    formData.append('quality', quality);

    try {
      const response = await axios.post(`${API_URL}/convert/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setDownloadUrl(response.data.downloadUrl);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Conversion failed');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Image Converter
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Convert & Resize Images
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert images between formats: JPG, PNG, WebP, AVIF, GIF, BMP. 
            Resize, compress, and optimize images for web or mobile.
          </p>
        </div>

        {/* Converter Form */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Upload & Preview */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
              />

              {preview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-auto max-h-64 object-contain bg-gray-50"
                    />
                  </div>
                  {file && (
                    <p className="mt-2 text-xs text-gray-500">
                      {file.name} • {(file.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Options */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Conversion Options</h3>
              
              <div className="space-y-4">
                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP (Modern)</option>
                    <option value="avif">AVIF (Best Compression)</option>
                    <option value="gif">GIF</option>
                    <option value="bmp">BMP</option>
                  </select>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="Auto"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                      placeholder="Auto"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: {quality}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Convert Button */}
                <button
                  onClick={handleConvert}
                  disabled={!file || isConverting}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isConverting ? 'Converting...' : 'Convert Image'}
                </button>

                {/* Download Link */}
                {downloadUrl && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-green-700 text-sm mb-2">Conversion complete!</p>
                    <a
                      href={`${API_URL}${downloadUrl}`}
                      className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Download Image
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Image Converter Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-semibold text-lg mb-2">Multiple Formats</h3>
              <p className="text-gray-600 text-sm">Convert between JPG, PNG, WebP, AVIF, GIF, and BMP</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-3">📐</div>
              <h3 className="font-semibold text-lg mb-2">Resize Images</h3>
              <p className="text-gray-600 text-sm">Adjust dimensions while maintaining aspect ratio</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2">Optimize Size</h3>
              <p className="text-gray-600 text-sm">Compress images to reduce file size without quality loss</p>
            </div>
          </div>
        </section>

        {/* Supported Formats */}
        <div className="max-w-5xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Supported Image Formats</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🖼️</div>
              <div className="font-semibold">JPG</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-semibold">PNG</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🌐</div>
              <div className="font-semibold">WebP</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-semibold">AVIF</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">🎬</div>
              <div className="font-semibold">GIF</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-3xl mb-2">📷</div>
              <div className="font-semibold">BMP</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
