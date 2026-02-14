import cors from "@fastify/cors";
import fp from "fastify-plugin";

export const corsPlugin = fp(async (fastify) => {
  await fastify.register(cors, {
    origin: true,
    credentials: true
  });
});

