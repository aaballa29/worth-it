"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getStripe, PRO_PLAN } from "@/lib/stripe";

// Sends the logged-in user to Stripe Checkout for the Pro subscription.
// Their `paid` flag is only flipped by the webhook, after Stripe confirms payment.
export async function startCheckout() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.paid) redirect("/dashboard");

  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;

  let url;
  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: PRO_PLAN.currency,
            unit_amount: PRO_PLAN.amountCents,
            recurring: { interval: PRO_PLAN.interval },
            product_data: { name: PRO_PLAN.name },
          },
        },
      ],
      ...(user.stripe_customer_id
        ? { customer: user.stripe_customer_id }
        : { customer_email: user.email }),
      client_reference_id: String(user.id),
      metadata: { user_id: String(user.id) },
      subscription_data: { metadata: { user_id: String(user.id) } },
      success_url: `${origin}/dashboard?upgraded=1`,
      cancel_url: `${origin}/dashboard?canceled=1`,
    });
    url = session.url;
  } catch (err) {
    console.error("[billing] checkout failed:", err);
    redirect("/dashboard?billing_error=1");
  }

  redirect(url);
}

// Opens Stripe's hosted billing portal so Pro users can update their card or cancel.
export async function openBillingPortal() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.stripe_customer_id) redirect("/dashboard");

  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;

  let url;
  try {
    const portal = await getStripe().billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    });
    url = portal.url;
  } catch (err) {
    console.error("[billing] portal failed:", err);
    redirect("/dashboard?billing_error=1");
  }

  redirect(url);
}
