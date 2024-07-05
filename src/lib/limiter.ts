import { RateLimitError } from "./errors";
import { getIp } from "./get-ip";

const PRUNE_INTERVAL = 60 * 1000; // 1 minute

/**
 * an object to keep track of the rate limit info
 *
 * [ip]:{
 *    count - number of requests made
 *    expiresAt - rate limit window time expire
 *  }
 * */
const trackers: Record<
  string,
  {
    count: number;
    expiresAt: number;
  }
> = {};

/**
 * A function that deletes trackers
 * based on the current time.
 * */
function pruneTrackers() {
  const now = Date.now();

  for (const key in trackers) {
    if (trackers[key].expiresAt < now) {
      delete trackers[key];
    }
  }
}

/**
 * Call pruneTrackers every PRUNE_INTERVAL
 * amount of time
 * */
setInterval(pruneTrackers, PRUNE_INTERVAL);

/**
 * apply rate limit based on the ip
 * */
export async function rateLimitByIp({
  key = "global",
  limit = 1,
  window = 10000,
}: {
  key: string;
  limit: number;
  window: number;
}) {
  const ip = getIp();

  if (!ip) {
    throw new RateLimitError();
  }

  await rateLimitByKey({
    key: `${ip}-${key}`,
    limit,
    window,
  });
}

export async function rateLimitByKey({
  key = "global",
  limit = 1,
  window = 10000,
}: {
  key: string;
  limit: number;
  window: number;
}) {
  const tracker = trackers[key] || { count: 0, expiresAt: 0 };

  if (!trackers[key]) {
    trackers[key] = tracker;
  }

  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + window;
  }

  tracker.count++;

  if (tracker.count > limit) {
    throw new RateLimitError();
  }
}
