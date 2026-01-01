import path from 'path';
import { atomicWriteJson, readJsonIfExists } from '../storage/fsUtil';
import { UserPlan } from '../types';

interface BlockEntry {
  until: number;
  reason: string;
}

interface RateState {
  // key: `${bucketStartMs}:${userKey}`
  buckets: Record<string, number>;
  // key: userKey
  failures: Record<string, number>;
  blocks: Record<string, BlockEntry>;
}

export class RateLimiter {
  private readonly filePath: string;

  constructor(dataDir: string) {
    this.filePath = path.join(dataDir, 'ratelimits.json');
  }

  private async load(): Promise<RateState> {
    return (
      (await readJsonIfExists<RateState>(this.filePath)) ?? {
        buckets: {},
        failures: {},
        blocks: {}
      }
    );
  }

  private async save(state: RateState): Promise<void> {
    await atomicWriteJson(this.filePath, state);
  }

  private hourBucketStart(nowMs: number): number {
    const hourMs = 60 * 60 * 1000;
    return Math.floor(nowMs / hourMs) * hourMs;
  }

  async checkBlocked(userKey: string, nowMs: number): Promise<BlockEntry | null> {
    const state = await this.load();
    const block = state.blocks[userKey];
    if (!block) return null;
    if (block.until <= nowMs) {
      delete state.blocks[userKey];
      await this.save(state);
      return null;
    }
    return block;
  }

  async incrementAndCheckLimit(params: {
    userKey: string;
    plan: UserPlan;
    nowMs: number;
    freeLimit: number;
    premiumLimit: number;
  }): Promise<{ allowed: boolean; remaining: number; resetAt: number }>
  {
    const state = await this.load();
    const bucketStart = this.hourBucketStart(params.nowMs);
    const bucketKey = `${bucketStart}:${params.userKey}`;
    const current = state.buckets[bucketKey] ?? 0;

    const limit = params.plan === 'premium' ? params.premiumLimit : params.freeLimit;
    const next = current + 1;

    state.buckets[bucketKey] = next;

    // Trim old buckets (keep last 3 hours to avoid unbounded growth)
    const cutoff = bucketStart - 3 * 60 * 60 * 1000;
    for (const key of Object.keys(state.buckets)) {
      const start = Number(key.split(':', 1)[0]);
      if (!Number.isFinite(start) || start < cutoff) delete state.buckets[key];
    }

    await this.save(state);

    const allowed = next <= limit;
    const remaining = Math.max(0, limit - next);
    const resetAt = bucketStart + 60 * 60 * 1000;
    return { allowed, remaining, resetAt };
  }

  async recordFailureAndMaybeBlock(userKey: string, nowMs: number): Promise<void> {
    const state = await this.load();
    const failures = (state.failures[userKey] ?? 0) + 1;
    state.failures[userKey] = failures;

    // Cooldown policy: after any failure, block for 10 minutes.
    // After 3 failures (recently), block for 1 hour.
    const tenMin = 10 * 60 * 1000;
    const oneHour = 60 * 60 * 1000;

    state.blocks[userKey] = {
      until: nowMs + (failures >= 3 ? oneHour : tenMin),
      reason: failures >= 3 ? 'Too many failed attempts' : 'Cooldown after failure'
    };

    await this.save(state);
  }
}
