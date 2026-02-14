import { Worker } from "bullmq";
import pino from "pino";
import { QUEUES } from "@omniplug/utils";
import type { PollEngagementPayload } from "@omniplug/types";
import { redisConnection } from "../lib/redis";

const logger = pino({ name: "poll-worker" });

export const pollWorker = new Worker<PollEngagementPayload>(
  QUEUES.POLL_ENGAGEMENT,
  async (job) => {
    logger.info({ jobId: job.id, payload: job.data }, "Processing engagement poll");
    return { ok: true };
  },
  {
    connection: redisConnection
  }
);

