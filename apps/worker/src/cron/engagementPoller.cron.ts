import cron from "node-cron";
import pino from "pino";
import { Queue } from "bullmq";
import { QUEUES } from "@omniplug/utils";
import type { FirePlugPayload } from "@omniplug/types";
import { redisConnection } from "../lib/redis";

const logger = pino({ name: "engagement-poller" });

export const startEngagementPoller = () => {
  const plugQueue = new Queue<FirePlugPayload>(QUEUES.FIRE_PLUG, { connection: redisConnection });

  return cron.schedule("*/5 * * * *", async () => {
    logger.info("Polling engagement for pending auto-plugs");

    // Placeholder until DB + metrics services are fully implemented.
    await plugQueue.add(
      QUEUES.FIRE_PLUG,
      {
        autoPlugId: "stub-autoplug-id",
        postId: "stub-post-id",
        platform: "TWITTER",
        platformPostId: "stub-platform-post-id",
        plugContent: "Stub auto-plug",
        userId: "stub-user-id"
      },
      {
        jobId: "stub-autoplug-id",
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000
        }
      }
    );
  });
};

