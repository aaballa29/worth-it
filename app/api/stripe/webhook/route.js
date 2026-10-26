import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

// Stripe calls this after checkout and whenever a subscription changes.
// Every request is verified with STRIPE_WEBHOOK_SECRET, so nobody else can mark users as paid.
export async function POST(request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not set.");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text(); // raw body is required for signature verification

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[stripe webhook] signature check failed:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    const sql = await db();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id ?? session.metadata?.user_id;
        if (userId && session.payment_status === "paid") {
          await sql`
            UPDATE users
            SET paid = TRUE, stripe_customer_id = ${session.customer}
            WHERE id = ${userId}`;
          console.log(`[stripe webhook] user ${userId} upgraded to Pro`);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // Events can arrive out of order, so ask Stripe for the subscription's current status.
        const sub = await getStripe().subscriptions.retrieve(event.data.object.id);
        const active = ["active", "trialing"].includes(sub.status);
        await sql`UPDATE users SET paid = ${active} WHERE stripe_customer_id = ${sub.customer}`;
        console.log(`[stripe webhook] customer ${sub.customer} paid=${active} (${sub.status})`);
        break;
      }

      default:
        // Ignore other events.
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler failed:", err);
    return new Response("Handler error", { status: 500 }); // Stripe will retry
  }

  return Response.json({ received: true });
}
