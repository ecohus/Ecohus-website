import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (_ratelimit) return _ratelimit;
  
  if (
    !process.env.UPSTASH_REDIS_REST_URL || 
    !process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_URL.includes("your-database.upstash.io")
  ) {
    return null;
  }
  
  _ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
  });
  return _ratelimit;
}

export const ratelimit = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    const rl = getRatelimit();
    if (!rl) {
      if (prop === "limit") {
        return async () => ({ success: true, pending: Promise.resolve(), limit: 10, remaining: 10, reset: 0 });
      }
      return undefined;
    }
    return (rl as unknown as Record<string | symbol, unknown>)[prop];
  },
});
