import { verifyToken } from "@clerk/backend";
import fp from "fastify-plugin";

export const authPlugin = fp(async (fastify) => {
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        reply.code(401).send({ error: "Missing or invalid authorization header", code: "UNAUTHORIZED" });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Verify the Clerk session token
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY
      });

      if (!payload.sub) {
        reply.code(401).send({ error: "Invalid token payload", code: "UNAUTHORIZED" });
        return;
      }

      // Attach user ID to request
      request.user = { id: payload.sub };
    } catch {
      reply.code(401).send({ error: "Unauthorized", code: "UNAUTHORIZED" });
    }
  });
});
