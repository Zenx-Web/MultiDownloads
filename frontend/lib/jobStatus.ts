const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface JobStatusPayload {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  error?: string;
  downloadUrl?: string;
  filePath?: string;
  metadata?: Record<string, any>;
}

export const buildApiUrl = (apiUrl?: string) => apiUrl || DEFAULT_API_URL;

export const fetchJobStatus = async (jobId: string, apiUrl?: string): Promise<JobStatusPayload> => {
  const baseUrl = buildApiUrl(apiUrl);
  const response = await fetch(`${baseUrl}/status/${jobId}`);

  if (!response.ok) {
    throw new Error(`Status request failed with ${response.status}`);
  }

  const payload = await response.json();
  const jobData = payload?.data;

  if (!jobData) {
    throw new Error('Job status response missing data');
  }

  return jobData as JobStatusPayload;
};

export const resolveDownloadUrl = (downloadUrl?: string, apiUrl?: string) => {
  if (!downloadUrl) {
    return '';
  }

  if (downloadUrl.startsWith('http://') || downloadUrl.startsWith('https://')) {
    return downloadUrl;
  }

  const baseUrl = buildApiUrl(apiUrl);

  try {
    const parsed = new URL(baseUrl);
    return `${parsed.origin}${downloadUrl}`;
  } catch (_error) {
    return `${baseUrl.replace(/\/?api$/, '')}${downloadUrl}`;
  }
};
