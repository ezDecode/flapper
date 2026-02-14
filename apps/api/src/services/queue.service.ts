import { Queue } from "bullmq";
import Redis from "ioredis";
import { QUEUES } from "@omniplug/utils";
import type { FirePlugPayload, PollEngagementPayload, PublishPostPayload } from "@omniplug/types";

const connection = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null
});

export const publishQueue = new Queue<PublishPostPayload>(QUEUES.PUBLISH_POST, { connection });
export const pollQueue = new Queue<PollEngagementPayload>(QUEUES.POLL_ENGAGEMENT, { connection });
export const plugQueue = new Queue<FirePlugPayload>(QUEUES.FIRE_PLUG, { connection });

