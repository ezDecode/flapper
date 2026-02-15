import { admin } from "./supabase-admin.ts";

const planLimits = {
  FREE: { publish: 10, plug: 5 },
  PRO: { publish: 100, plug: 50 },
  AGENCY: { publish: Number.POSITIVE_INFINITY, plug: Number.POSITIVE_INFINITY }
} as const;

export class LimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LimitExceededError";
  }
}

function monthRange() {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function checkAndEnforceLimit(userId: string, kind: "PUBLISH" | "PLUG") {
  const { start, end } = monthRange();
  const { data: profile } = await admin.from("users").select("plan").eq("id", userId).single();
  const plan = profile?.plan ?? "FREE";

  if (plan === "AGENCY") {
    return true;
  }

  if (kind === "PUBLISH") {
    const { count } = await admin
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", start)
      .lt("created_at", end);

    if ((count ?? 0) >= planLimits[plan].publish) {
      throw new LimitExceededError("Post scheduling limit reached.");
    }
    return true;
  }

  const { data: plugs } = await admin
    .from("auto_plugs")
    .select("id, post_id, status, fired_at, posts!inner(user_id)")
    .eq("posts.user_id", userId)
    .eq("status", "FIRED")
    .gte("fired_at", start)
    .lt("fired_at", end);

  if ((plugs?.length ?? 0) >= planLimits[plan].plug) {
    throw new LimitExceededError("Auto-plug monthly limit reached.");
  }

  return true;
}

export async function checkRateLimit(userId: string, platform: "TWITTER" | "LINKEDIN" | "BLUESKY", max = 45) {
  const now = new Date();
  const bucketStart = new Date(now);
  bucketStart.setUTCMinutes(Math.floor(bucketStart.getUTCMinutes() / 15) * 15, 0, 0);
  const windowStart = bucketStart.toISOString();

  const { data: existing } = await admin
    .from("api_rate_tracking")
    .select("call_count")
    .eq("user_id", userId)
    .eq("platform", platform)
    .eq("window_start", windowStart)
    .single();

  if ((existing?.call_count ?? 0) >= max) {
    return false;
  }

  await admin.from("api_rate_tracking").upsert(
    {
      user_id: userId,
      platform,
      window_start: windowStart,
      call_count: (existing?.call_count ?? 0) + 1
    },
    { onConflict: "user_id,platform,window_start" }
  );

  return true;
}
