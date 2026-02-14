import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    return reply.send({
      user: { id: "stub-user-id", email: body.email, name: body.name ?? null },
      token: "stub-jwt-token"
    });
  });

  fastify.post("/login", async (request) => {
    const body = loginSchema.parse(request.body);
    return {
      user: { id: "stub-user-id", email: body.email },
      token: "stub-jwt-token"
    };
  });

  fastify.post("/refresh", async () => ({ token: "stub-refreshed-token" }));
  fastify.post("/logout", async () => ({ success: true }));
};

