import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit {
  if (_ratelimit) return _ratelimit;
  _ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
  });
  return _ratelimit;
}

export const ratelimit = new Proxy({} as Ratelimit, {
  get(_target, prop) {
    return (getRatelimit() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
