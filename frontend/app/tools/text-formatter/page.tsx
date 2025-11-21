'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchJobStatus } from '@/lib/jobStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TextFormatterPage() {
  const [text, setText] = useState('');
  const [operation, setOperation] = useState('uppercase');
  const [result, setResult] = useState('');
  const [stats, setStats] = useState({ characters: 0, words: 0, lines: 0 });

  const handleFormat = async () => {
    if (!text) return;

    try {
      const response = await fetch(`${API_URL}/utility/format-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, operation }),
      });

      const data = await response.json();
      const jobId = data.jobId;

      const pollInterval = setInterval(async () => {
        try {
          const jobData = await fetchJobStatus(jobId, API_URL);

          if (jobData.status === 'completed') {
            clearInterval(pollInterval);
            setResult(jobData.metadata?.formattedText || '');
            setStats(jobData.metadata?.stats || { characters: 0, words: 0, lines: 0 });
          } else if (jobData.status === 'failed') {
            clearInterval(pollInterval);
            console.error('Text formatting failed:', jobData.error);
          }
        } catch (pollError) {
          console.error('Text formatter status check failed:', pollError);
        }
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/tools" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Text Formatter</h1>
          <p className="text-lg text-gray-600">
            Transform text case and format with powerful tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Input Text</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 mb-4"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="uppercase">UPPERCASE</option>
                <option value="lowercase">lowercase</option>
                <option value="titlecase">Title Case</option>
                <option value="capitalize">Capitalize First</option>
                <option value="trim">Trim Spaces</option>
                <option value="removeSpaces">Remove All Spaces</option>
              </select>
            </div>
            <button
              onClick={handleFormat}
              disabled={!text}
              className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400"
            >
              Format Text
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Output</h3>
            <textarea
              value={result}
              readOnly
              placeholder="Formatted text will appear here..."
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 mb-4"
            />
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-teal-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-teal-700">{stats.characters}</p>
                <p className="text-xs text-gray-600">Characters</p>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-teal-700">{stats.words}</p>
                <p className="text-xs text-gray-600">Words</p>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-teal-700">{stats.lines}</p>
                <p className="text-xs text-gray-600">Lines</p>
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              disabled={!result}
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 disabled:bg-gray-400"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
