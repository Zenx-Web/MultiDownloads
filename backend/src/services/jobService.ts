import { v4 as uuidv4 } from 'uuid';
import { JobStatus } from '../types';

/**
 * In-memory store for job statuses
 * TODO: Move to Redis or database for production scalability
 */
const jobStore = new Map<string, JobStatus>();

/**
 * Create a new job and return its ID
 */
export const createJob = (): JobStatus => {
  const job: JobStatus = {
    id: uuidv4(),
    status: 'pending',
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  jobStore.set(job.id, job);
  return job;
};

/**
 * Get job by ID
 */
export const getJob = (jobId: string): JobStatus | undefined => {
  return jobStore.get(jobId);
};

/**
 * Update job status
 */
export const updateJob = (
  jobId: string,
  updates: Partial<Omit<JobStatus, 'id' | 'createdAt'>>
): JobStatus | undefined => {
  const job = jobStore.get(jobId);
  if (!job) return undefined;

  Object.assign(job, updates, { updatedAt: new Date() });
  jobStore.set(jobId, job);
  return job;
};

/**
 * Clean up old jobs (older than 1 hour)
 * Call this periodically to prevent memory leaks
 */
export const cleanupOldJobs = () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  for (const [jobId, job] of jobStore.entries()) {
    if (job.updatedAt < oneHourAgo) {
      jobStore.delete(jobId);
    }
  }
};

// Run cleanup every 30 minutes
setInterval(cleanupOldJobs, 30 * 60 * 1000);
