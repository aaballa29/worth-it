import Stripe from "stripe";

let stripe;

// Reads STRIPE_SECRET_KEY from the environment. Never put Stripe keys in code.
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
  // Test mode only for now. Remove this check when you're ready to take real payments.
  if (!key.startsWith("sk_test_") && !key.startsWith("rk_test_")) {
    throw new Error("STRIPE_SECRET_KEY must be a test-mode key (sk_test_...).");
  }
  stripe ??= new Stripe(key);
  return stripe;
}

// What Pro costs. Matches the pricing on the homepage.
export const PRO_PLAN = {
  name: "Worth It? Pro",
  amountCents: 600,
  currency: "usd",
  interval: "month",
};
