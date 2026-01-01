export type UserPlan = 'free' | 'premium';

export type JobStatus =
  | 'queued'
  | 'processing'
  | 'ready'
  | 'failed'
  | 'expired';

export type MediaKind = 'audio' | 'video';

export type JobPriority = 0 | 1;

export interface JobError {
  code: string;
  message: string;
}

export interface JobResult {
  filename: string;
  mimeType: string;
  bytes: number;
  readyAt: number;
  expiresAt: number;
  downloadUsed: boolean;
  downloadToken: string;
}

export interface JobRecord {
  id: string;
  url: string;
  kind: MediaKind;
  createdAt: number;
  availableAt: number;
  status: JobStatus;
  priority: JobPriority;

  requester: {
    userId: string;
    plan: UserPlan;
    ip: string;
  };

  metadata?: {
    durationSeconds: number;
  };

  result?: JobResult;
  error?: JobError;
}
