export const PLATFORM_CHAR_LIMITS = {
  TWITTER: 280,
  LINKEDIN: 3000,
  BLUESKY: 300
} as const;

export const PLAN_LIMITS = {
  FREE: { posts: 10, plugs: 5, platforms: 2 },
  PRO: { posts: 100, plugs: 50, platforms: 3 },
  AGENCY: { posts: Number.POSITIVE_INFINITY, plugs: Number.POSITIVE_INFINITY, platforms: 3 }
} as const;

export type Platform = keyof typeof PLATFORM_CHAR_LIMITS;
export type Plan = keyof typeof PLAN_LIMITS;
