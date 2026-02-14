import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const platformSchema = z.enum(["TWITTER", "LINKEDIN", "INSTAGRAM", "BLUESKY"]);

const createPostSchema = z.object({
  content: z.string().min(1),
  mediaUrls: z.array(z.string().url()).default([]),
  scheduledAt: z.string().datetime().nullable(),
  targets: z.array(z.object({ platform: platformSchema })).min(1),
  plugs: z
    .array(
      z.object({
        platform: platformSchema,
        plugContent: z.string().min(1).max(280),
        triggerType: z.enum(["LIKES", "COMMENTS", "REPOSTS", "TIME_AFTER_PUBLISH"]),
        triggerValue: z.number().int().min(1)
      })
    )
    .default([])
});

export const postsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/", async () => ({
    posts: [],
    total: 0,
    page: 1
  }));

  fastify.get("/:id", async (request) => ({
    id: (request.params as { id: string }).id,
    targets: [],
    plugs: []
  }));

  fastify.post("/", async (request) => {
    const body = createPostSchema.parse(request.body);
    return {
      id: "stub-post-id",
      status: body.scheduledAt ? "SCHEDULED" : "DRAFT",
      ...body
    };
  });

  fastify.put("/:id", async (request) => ({
    id: (request.params as { id: string }).id,
    updated: true,
    ...(request.body as object)
  }));

  fastify.delete("/:id", async () => ({ success: true }));

  fastify.post("/:id/publish", async (request) => ({
    id: (request.params as { id: string }).id,
    status: "PUBLISHING"
  }));

  fastify.post("/media", async () => ({
    url: "https://example-r2.invalid/media/stub"
  }));
};

