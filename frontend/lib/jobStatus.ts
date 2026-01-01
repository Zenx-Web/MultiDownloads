const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface JobStatusPayload {
  id: string;
  status: 'queued' | 'processing' | 'ready' | 'failed' | 'expired';
  createdAt?: number;
  availableAt?: number;
  error?: { code: string; message: string };
  result?: {
    filename: string;
    mimeType: string;
    bytes: number;
    readyAt: number;
    expiresAt: number;
    downloadUsed: boolean;
  };
}

export const buildApiUrl = (apiUrl?: string) => apiUrl || DEFAULT_API_URL;

export const fetchJobStatus = async (jobId: string, apiUrl?: string): Promise<JobStatusPayload> => {
  const baseUrl = buildApiUrl(apiUrl);
  const response = await fetch(`${baseUrl}/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error(`Status request failed with ${response.status}`);
  }

  const payload = await response.json();
  return payload as JobStatusPayload;
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
