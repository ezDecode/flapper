import jwt from "@fastify/jwt";
import fp from "fastify-plugin";

export const authPlugin = fp(async (fastify) => {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-jwt-secret"
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      reply.code(401).send({ error: "Unauthorized", code: "UNAUTHORIZED" });
    }
  });
});
