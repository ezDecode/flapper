import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const connectBody = z.object({
  platform: z.enum(["TWITTER", "LINKEDIN", "INSTAGRAM", "BLUESKY"]),
  code: z.string().optional(),
  redirectUri: z.string().url().optional()
});

const blueskyBody = z.object({
  handle: z.string().min(1),
  appPassword: z.string().min(1)
});

export const platformsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/", async () => []);

  fastify.post("/connect", async (request) => {
    const body = connectBody.parse(request.body);
    return {
      id: "stub-connection-id",
      platform: body.platform,
      platformHandle: "@stub",
      isActive: true
    };
  });

  fastify.delete("/:platform", async () => ({ success: true }));

  fastify.post("/bluesky", async (request) => {
    const body = blueskyBody.parse(request.body);
    return {
      id: "stub-connection-id",
      platform: "BLUESKY",
      platformHandle: body.handle,
      isActive: true
    };
  });

  fastify.get("/oauth/:platform", async () => ({
    authUrl: "https://example.com/oauth"
  }));
};

