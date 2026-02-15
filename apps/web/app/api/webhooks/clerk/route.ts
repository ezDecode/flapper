import { headers } from "next/headers";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@omniplug/db";

export async function POST(req: Request) {
  // Get the Clerk webhook secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Verify required headers exist
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    // Create user in database
    await prisma.user.create({
      data: {
        id, // Clerk user ID
        email: email_addresses[0]?.email_address ?? "",
        name: [first_name, last_name].filter(Boolean).join(" ") || null,
        avatarUrl: image_url || null
      }
    });
  } else if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    // Update user in database
    await prisma.user.update({
      where: { id },
      data: {
        email: email_addresses[0]?.email_address ?? "",
        name: [first_name, last_name].filter(Boolean).join(" ") || null,
        avatarUrl: image_url || null
      }
    });
  } else if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (id) {
      // Delete user from database
      await prisma.user.delete({
        where: { id }
      });
    }
  }

  return new Response("", { status: 200 });
}
