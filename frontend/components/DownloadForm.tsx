'use client';

import { useMemo, useState } from 'react';
import axios from 'axios';
import CookieConsent from './CookieConsent';
import ProgressTracker from './ProgressTracker';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api').replace(/^\uFEFF/, '').trim();

interface DownloadFormProps {
  onJobCreated?: (jobId: string) => void;
}

export default function DownloadForm({ onJobCreated }: DownloadFormProps) {
  const [url, setUrl] = useState('');
  const [kind, setKind] = useState<'video' | 'audio'>('video');
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { refresh: refreshSubscription } = useSubscription();
  const { session } = useAuth();
  const authToken = session?.access_token || null;

  const authHeaders = useMemo(() => {
    if (!authToken) {
      return undefined;
    }
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }, [authToken]);

  if (jobId) {
    return (
      <ProgressTracker
        jobId={jobId}
        onReset={() => {
          setJobId(null);
          setError('');
          setSubmitting(false);
          setUrl('');
          setKind('video');
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <CookieConsent onAccept={() => {}} />

      <div className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Paste Media URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={submitting}
            placeholder="https://example.com/media"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Media type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setKind('video')}
              disabled={submitting}
              className={`p-4 rounded-lg border-2 transition-all ${
                kind === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl mb-2">📹</div>
              <div className="font-semibold">Video</div>
            </button>

            <button
              type="button"
              onClick={() => setKind('audio')}
              disabled={submitting}
              className={`p-4 rounded-lg border-2 transition-all ${
                kind === 'audio' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="text-2xl mb-2">🎵</div>
              <div className="font-semibold">Audio</div>
            </button>
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        <button
          type="button"
          disabled={submitting}
          onClick={async () => {
            setError('');
            if (!url.trim()) {
              setError('Please enter a URL');
              return;
            }

            setSubmitting(true);
            try {
              const submitResponse = await axios.post(`${API_URL}/jobs`, { url: url.trim(), kind }, authHeaders);
              const createdJobId = submitResponse.data.jobId as string;
              setJobId(createdJobId);
              onJobCreated?.(createdJobId);

              refreshSubscription().catch((refreshError) => {
                console.warn('[subscription] unable to refresh usage snapshot', refreshError);
              });
            } catch (err: any) {
              const message =
                err.response?.data?.error?.message ||
                err.response?.data?.error ||
                err.message ||
                'Failed to submit job';
              setError(message);
              setSubmitting(false);
            }
          }}
          className="w-full py-4 rounded-lg font-semibold transition-all text-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Start'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Free: 2 requests/hour, up to 15 minutes. Premium: 10 requests/hour, up to 60 minutes.
          <a href="/pricing" className="text-blue-600 hover:underline ml-1">
            See plans
          </a>
        </p>
      </div>
    </div>
  );
}
