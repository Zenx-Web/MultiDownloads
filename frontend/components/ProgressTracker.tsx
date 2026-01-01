'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { downloadFileFromApi } from '@/lib/fileDownload';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface ProgressTrackerProps {
  jobId: string;
  onReset?: () => void;
}

interface JobStatus {
  id: string;
  status: 'queued' | 'processing' | 'ready' | 'failed' | 'expired';
  progress: number;
  message?: string;
  downloadUrl?: string;
  error?: string;
}

export default function ProgressTracker({ jobId, onReset }: ProgressTrackerProps) {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [usageRefreshed, setUsageRefreshed] = useState(false);
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

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/jobs/${jobId}`, authHeaders);
        const data = response.data;

        const progress =
          data.status === 'queued' ? 10 : data.status === 'processing' ? 55 : data.status === 'ready' ? 100 : 0;

        setJob({
          id: data.id,
          status: data.status,
          progress,
          error: data.error?.message || data.error,
        });

        // Stop polling if job is ready/failed/expired
        if (data.status === 'ready' || data.status === 'failed' || data.status === 'expired') {
          return;
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch status');
      }
    };

    // Poll immediately
    pollStatus();

    // Then poll every 2 seconds
    const interval = setInterval(() => {
      if (job?.status !== 'ready' && job?.status !== 'failed' && job?.status !== 'expired') {
        pollStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, job?.status, authHeaders]);

  useEffect(() => {
    if (job?.status === 'ready' && !usageRefreshed) {
      refreshSubscription().catch((refreshError) => {
        console.warn('[subscription] unable to refresh after job completion', refreshError);
      });
      setUsageRefreshed(true);
    }

    if (job?.status !== 'ready' && usageRefreshed) {
      setUsageRefreshed(false);
    }
  }, [job?.status, usageRefreshed, refreshSubscription]);

  const getStatusColor = () => {
    switch (job?.status) {
      case 'ready':
        return 'bg-green-500';
      case 'failed':
      case 'expired':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (job?.status) {
      case 'ready':
        return '✓';
      case 'failed':
      case 'expired':
        return '✗';
      case 'processing':
        return '⏳';
      default:
        return '⌛';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="text-center">
        {/* Status Icon */}
        <div className="text-6xl mb-4">{getStatusIcon()}</div>

        {/* Status Title */}
        <h2 className="text-2xl font-bold mb-2 capitalize">{job?.status || 'Initializing'}</h2>

        {/* Status Message */}
        {job?.message && <p className="text-gray-600 mb-6">{job.message}</p>}

        {/* Error Message */}
        {(error || job?.error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error || job?.error}
          </div>
        )}

        {/* Progress Bar */}
        {job && job.status !== 'failed' && job.status !== 'expired' && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full ${getStatusColor()} transition-all duration-300 ease-out`}
                style={{ width: `${job.progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{job.progress}% complete</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {job?.status === 'ready' && (
            <button
              onClick={async () => {
                setDownloading(true);
                setError('');
                try {
                  const linkResponse = await axios.get(`${API_URL}/jobs/${jobId}/download-link`, authHeaders);
                  await downloadFileFromApi(linkResponse.data.url, API_URL);
                  refreshSubscription().catch((refreshError) => {
                    console.warn('[subscription] unable to refresh after download', refreshError);
                  });
                } catch (err) {
                  console.error('Download failed:', err);
                  setError(err instanceof Error ? err.message : 'Failed to download file');
                } finally {
                  setDownloading(false);
                }
              }}
              disabled={downloading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {downloading ? 'Downloading...' : 'Download File'}
            </button>
          )}

          <button
            onClick={onReset}
            disabled={downloading}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {job?.status === 'ready' || job?.status === 'failed' || job?.status === 'expired'
              ? 'Start New Download'
              : 'Cancel'}
          </button>
        </div>

        {/* Job ID */}
        <p className="text-xs text-gray-400 mt-6">Job ID: {jobId}</p>
      </div>
    </div>
  );
}
