import type { FastifyPluginAsync } from "fastify";

export const billingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.post("/checkout", async () => ({
    checkoutUrl: "https://checkout.stripe.com/stub"
  }));

  fastify.post("/portal", async () => ({
    portalUrl: "https://billing.stripe.com/stub"
  }));

  fastify.post("/webhook", async () => ({ received: true }));
};

