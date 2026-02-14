import pino from "pino";
import { startEngagementPoller } from "./cron/engagementPoller.cron";
import { redisConnection } from "./lib/redis";
import { plugWorker } from "./workers/plug.worker";
import { pollWorker } from "./workers/poll.worker";
import { publishWorker } from "./workers/publish.worker";

const logger = pino({ name: "worker" });

const registerWorkerEvents = () => {
  for (const worker of [publishWorker, pollWorker, plugWorker]) {
    worker.on("completed", (job) => {
      logger.info({ queue: worker.name, jobId: job.id }, "Job completed");
    });
    worker.on("failed", (job, error) => {
      logger.error({ queue: worker.name, jobId: job?.id, error }, "Job failed");
    });
  }
};

const start = async () => {
  registerWorkerEvents();
  const poller = startEngagementPoller();
  logger.info("Worker service started");

  const shutdown = async () => {
    logger.info("Worker shutting down");
    poller.stop();
    await Promise.all([publishWorker.close(), pollWorker.close(), plugWorker.close()]);
    await redisConnection.quit();
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown();
  });
  process.on("SIGTERM", () => {
    void shutdown();
  });
};

void start();

