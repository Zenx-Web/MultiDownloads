'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ProgressTrackerProps {
  jobId: string;
  onReset?: () => void;
}

interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  downloadUrl?: string;
  error?: string;
}

export default function ProgressTracker({ jobId, onReset }: ProgressTrackerProps) {
  const [job, setJob] = useState<JobStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/status/${jobId}`);
        
        if (response.data.success) {
          setJob(response.data.data);

          // Stop polling if job is completed or failed
          if (response.data.data.status === 'completed' || response.data.data.status === 'failed') {
            return;
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch status');
      }
    };

    // Poll immediately
    pollStatus();

    // Then poll every 2 seconds
    const interval = setInterval(() => {
      if (job?.status !== 'completed' && job?.status !== 'failed') {
        pollStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, job?.status]);

  const getStatusColor = () => {
    switch (job?.status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (job?.status) {
      case 'completed':
        return '✓';
      case 'failed':
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
        {job && job.status !== 'failed' && (
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
          {job?.status === 'completed' && (
            <a
              href={`http://localhost:5000${job.downloadUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Download File
            </a>
          )}

          <button
            onClick={onReset}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            {job?.status === 'completed' || job?.status === 'failed'
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
