export type Platform = "TWITTER" | "LINKEDIN" | "INSTAGRAM" | "BLUESKY";

export type TriggerType = "LIKES" | "COMMENTS" | "REPOSTS" | "TIME_AFTER_PUBLISH";

export interface PublishPostPayload {
  postId: string;
  userId: string;
  platform: Platform;
}

export interface PollEngagementPayload {
  postTargetId: string;
  postId: string;
  platform: Platform;
  platformPostId: string;
}

export interface FirePlugPayload {
  autoPlugId: string;
  postId: string;
  platform: Platform;
  platformPostId: string;
  plugContent: string;
  userId: string;
}

export interface ApiError {
  error: string;
  code: string;
}

export interface PlatformConnectionDTO {
  id: string;
  platform: Platform;
  platformHandle: string;
  isActive: boolean;
}

