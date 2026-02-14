import { z } from "zod";

export const platformSchema = z.enum(["TWITTER", "LINKEDIN", "INSTAGRAM", "BLUESKY"]);

export const autoPlugSchema = z.object({
  platform: platformSchema,
  plugContent: z.string().min(1).max(280),
  triggerType: z.enum(["LIKES", "COMMENTS", "REPOSTS", "TIME_AFTER_PUBLISH"]),
  triggerValue: z.number().int().min(1)
});

export const createPostSchema = z.object({
  content: z.string().min(1),
  mediaUrls: z.array(z.string().url()),
  scheduledAt: z.string().datetime().nullable(),
  targets: z.array(z.object({ platform: platformSchema })).min(1),
  plugs: z.array(autoPlugSchema)
});

