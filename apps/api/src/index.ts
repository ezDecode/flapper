import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { authPlugin } from "./plugins/auth";
import { corsPlugin } from "./plugins/cors";
import { rateLimitPlugin } from "./plugins/rateLimit";
import { analyticsRoutes } from "./routes/analytics";
import { billingRoutes } from "./routes/billing";
import { platformsRoutes } from "./routes/platforms";
import { plugsRoutes } from "./routes/plugs";
import { postsRoutes } from "./routes/posts";

const buildServer = () => {
  const server = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug"
    }
  });

  server.register(corsPlugin);
  server.register(rateLimitPlugin);
  server.register(multipart);
  server.register(authPlugin);

  server.get("/health", async () => ({
    status: "ok",
    timestamp: Date.now()
  }));

  server.register(platformsRoutes, { prefix: "/api/platforms" });
  server.register(postsRoutes, { prefix: "/api/posts" });
  server.register(plugsRoutes, { prefix: "/api/plugs" });
  server.register(analyticsRoutes, { prefix: "/api/analytics" });
  server.register(billingRoutes, { prefix: "/api/billing" });

  return server;
};

const start = async () => {
  const server = buildServer();
  const port = Number(process.env.PORT ?? 4000);
  const host = "0.0.0.0";

  try {
    await server.listen({ port, host });
    server.log.info({ port }, "API server started");
  } catch (error) {
    server.log.error(error, "Failed to start API server");
    process.exit(1);
  }
};

void start();

