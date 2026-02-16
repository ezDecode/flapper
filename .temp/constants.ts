export const PLATFORM_CHAR_LIMITS = {
  TWITTER: 280
} as const;

export const PLAN_LIMITS = {
  FREE:   { posts: 10,                       plugs: 5 },
  PRO:    { posts: 100,                      plugs: 50 },
  AGENCY: { posts: Number.POSITIVE_INFINITY, plugs: Number.POSITIVE_INFINITY }
} as const;

export type Platform = keyof typeof PLATFORM_CHAR_LIMITS;
export type Plan = keyof typeof PLAN_LIMITS;
