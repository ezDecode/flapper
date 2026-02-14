import type { FastifyPluginAsync } from "fastify";

export const analyticsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/overview", async () => ({
    totalPosts: 0,
    totalPlugsFired: 0,
    totalEngagement: 0
  }));

  fastify.get("/posts/:id", async () => ({
    targets: []
  }));

  fastify.get("/best-times", async () => []);
};

