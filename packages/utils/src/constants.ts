export const QUEUES = {
  PUBLISH_POST: "publish-post",
  POLL_ENGAGEMENT: "poll-engagement",
  FIRE_PLUG: "fire-plug"
} as const;

export const PLATFORM_CHAR_LIMITS = {
  TWITTER: 280,
  LINKEDIN: 3000,
  INSTAGRAM: 2200,
  BLUESKY: 300
} as const;

export const PLAN_LIMITS = {
  FREE: {
    connectedPlatforms: 2,
    scheduledPostsPerMonth: 10,
    autoPlugsPerMonth: 5,
    mediaUploadsPerMonth: 20,
    analyticsHistoryDays: 7
  },
  PRO: {
    connectedPlatforms: 4,
    scheduledPostsPerMonth: 100,
    autoPlugsPerMonth: 50,
    mediaUploadsPerMonth: 200,
    analyticsHistoryDays: 90
  },
  AGENCY: {
    connectedPlatforms: 4,
    scheduledPostsPerMonth: Number.MAX_SAFE_INTEGER,
    autoPlugsPerMonth: Number.MAX_SAFE_INTEGER,
    mediaUploadsPerMonth: Number.MAX_SAFE_INTEGER,
    analyticsHistoryDays: 365
  }
} as const;

