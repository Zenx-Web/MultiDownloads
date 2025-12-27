type AdminStats = {
  totalJobsTracked: number;
  totalJobsCreated: number;
  jobsPending: number;
  jobsProcessing: number;
  jobsCompleted: number;
  jobsFailed: number;
  jobsQueued: number;
  activeJobs: number;
  successRate: number;
  uptimeSeconds: number;
  startedAt: string;
  lastUpdated: string;
};

export const defaultStats: AdminStats = {
  totalJobsTracked: 0,
  totalJobsCreated: 0,
  jobsPending: 0,
  jobsProcessing: 0,
  jobsCompleted: 0,
  jobsFailed: 0,
  jobsQueued: 0,
  activeJobs: 0,
  successRate: 100,
  uptimeSeconds: 0,
  startedAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

const resolveAdminApiBase = () => {
  const explicit = process.env.ADMIN_BACKEND_URL;
  const fallback = process.env.NEXT_PUBLIC_API_URL;
  const base = explicit || fallback || 'http://localhost:5000/api';
  return base.replace(/\/$/, '');
};

export async function fetchSystemStats(): Promise<AdminStats> {
  try {
    const baseUrl = resolveAdminApiBase();
    const response = await fetch(`${baseUrl}/admin/stats`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return defaultStats;
    }

    const payload = await response.json();
    return { ...defaultStats, ...(payload?.data as Partial<AdminStats>) };
  } catch (_error) {
    return defaultStats;
  }
}

export type { AdminStats };
