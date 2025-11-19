'use client';

import { useState } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!text) {
      setError('Please enter some text');
      return;
    }

    setLoading(true);
    setError('');
    setDownloadUrl('');

    try {
      const response = await fetch(`${API_URL}/media/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      });

      const data = await response.json();
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
          setError(statusData.error || 'Conversion failed');
          setLoading(false);
        }
      }, 1000);

      setTimeout(() => clearInterval(pollInterval), 120000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert text to speech');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Text to Speech</h1>
          <p className="text-lg text-gray-600">
            Convert text into natural-sounding speech audio
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Text to Convert</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to speech..."
              rows={8}
              maxLength={5000}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
            />
            <p className="mt-1 text-xs text-gray-500">{text.length} / 5000 characters</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="zh">Chinese</option>
              <option value="ar">Arabic</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          <button
            onClick={handleConvert}
            disabled={!text || loading}
            className="w-full bg-lime-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-lime-700 disabled:bg-gray-400"
          >
            {loading ? 'Converting...' : 'Convert to Speech'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {downloadUrl && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium mb-3">✓ Audio generated successfully!</p>
              <audio controls className="w-full mb-3">
                <source src={downloadUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <a
                href={downloadUrl}
                download="speech.mp3"
                className="block w-full bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 text-center"
              >
                Download MP3
              </a>
            </div>
          )}

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
              <span className="ml-3 text-gray-600">Generating audio...</span>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>• Accessibility features</div>
            <div>• Language learning</div>
            <div>• Audiobook creation</div>
            <div>• Podcast narration</div>
            <div>• IVR systems</div>
            <div>• Content creation</div>
          </div>
        </div>
      </div>
    </div>
  );
}
