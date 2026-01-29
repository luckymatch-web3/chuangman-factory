const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

export async function redis(command: string[]) {
  const res = await fetch(`${REDIS_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  return res.json();
}

export async function cacheGet(key: string) {
  return redis(["GET", key]);
}

export async function cacheSet(key: string, value: string, exSeconds?: number) {
  const cmd = ["SET", key, value];
  if (exSeconds) cmd.push("EX", String(exSeconds));
  return redis(cmd);
}
