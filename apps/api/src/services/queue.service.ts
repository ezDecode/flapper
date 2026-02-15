import { Queue } from "bullmq";
import type { FirePlugPayload, PollEngagementPayload, PublishPostPayload } from "@omniplug/types";
import { QUEUES } from "@omniplug/utils";

const connectionOptions = {
  url: process.env.REDIS_URL ?? "redis://localhost:6379",
  maxRetriesPerRequest: null
};

export const publishQueue = new Queue<PublishPostPayload>(QUEUES.PUBLISH_POST, { connection: connectionOptions });
export const pollQueue = new Queue<PollEngagementPayload>(QUEUES.POLL_ENGAGEMENT, { connection: connectionOptions });
export const plugQueue = new Queue<FirePlugPayload>(QUEUES.FIRE_PLUG, { connection: connectionOptions });

