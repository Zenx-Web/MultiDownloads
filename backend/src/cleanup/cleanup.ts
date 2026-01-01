import { JobStore } from '../storage/jobStore';
import { deleteJobStorage } from '../storage/files';

export async function cleanupExpired(params: {
  jobStore: JobStore;
  storageDir: string;
  nowMs: number;
}): Promise<void> {
  const jobs = await params.jobStore.listAll();

  for (const job of jobs) {
    if (job.status === 'ready' && job.result && job.result.expiresAt <= params.nowMs) {
      await deleteJobStorage(params.storageDir, job.id);
      await params.jobStore.update(job.id, (j) => ({
        ...j,
        status: 'expired',
        result: j.result ? { ...j.result } : undefined
      }));
    }
  }
}
