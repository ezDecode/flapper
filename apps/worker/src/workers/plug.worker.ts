import { Worker } from "bullmq";
import pino from "pino";
import { QUEUES } from "@omniplug/utils";
import type { FirePlugPayload } from "@omniplug/types";
import { redisConnection } from "../lib/redis";

const logger = pino({ name: "plug-worker" });

export const plugWorker = new Worker<FirePlugPayload>(
  QUEUES.FIRE_PLUG,
  async (job) => {
    logger.info({ jobId: job.id, payload: job.data }, "Processing fire-plug job");
    return { ok: true };
  },
  {
    connection: redisConnection
  }
);

