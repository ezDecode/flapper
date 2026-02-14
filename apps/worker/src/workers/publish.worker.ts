import { Worker } from "bullmq";
import pino from "pino";
import { QUEUES } from "@omniplug/utils";
import type { PublishPostPayload } from "@omniplug/types";
import { redisConnection } from "../lib/redis";

const logger = pino({ name: "publish-worker" });

export const publishWorker = new Worker<PublishPostPayload>(
  QUEUES.PUBLISH_POST,
  async (job) => {
    logger.info({ jobId: job.id, payload: job.data }, "Processing publish job");
    return { ok: true };
  },
  {
    connection: redisConnection
  }
);

