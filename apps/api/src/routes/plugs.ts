import type { FastifyPluginAsync } from "fastify";

export const plugsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/", async () => ({ plugs: [] }));
  fastify.post("/", async () => ({ created: true }));
  fastify.put("/:id", async () => ({ updated: true }));
  fastify.delete("/:id", async () => ({ success: true }));
};

