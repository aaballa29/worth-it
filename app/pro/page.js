import Link from "next/link";
import { FREE_DAILY_SCANS } from "@/lib/scans";
import { getCurrentUser } from "@/lib/session";
import { startCheckout } from "../actions/billing";

export const metadata = { title: "Go Pro — worth it?" };

// Optional upsell. Never required: every path here has a way back to the free tool.
export default async function ProPage({ searchParams }) {
  const user = await getCurrentUser();
  const params = await searchParams;

  return (
    <main className="auth pro-page">
      <Link href={user ? "/dashboard" : "/"} className="nav-logo auth-logo" aria-label="worth it? home">
        worth it<span>?</span>
      </Link>

      <div className="auth-card pro-card">
        <div className="pricetag pro-tag tilt-r" aria-hidden="true">
          <span className="pricetag-hole" />
          $6/mo
        </div>
        <span className="badge">Worth It? Pro</span>
        <h1>Scan as much as you thrift.</h1>

        {params?.canceled === "1" && (
          <p className="auth-error" role="status">Checkout canceled. You weren&rsquo;t charged.</p>
        )}

        <ul className="plan-list pro-list">
          <li><span className="check">✓</span> Unlimited scans (Free is {FREE_DAILY_SCANS} a day)</li>
          <li><span className="check">✓</span> Buy it / Maybe / Skip it verdicts</li>
          <li><span className="check">✓</span> Resale price ranges with confidence</li>
          <li><span className="check">✓</span> Cancel anytime</li>
        </ul>

        {user?.paid ? (
          <>
            <p className="pro-note">You&rsquo;re already on Pro.</p>
            <Link href="/dashboard" className="btn btn-primary auth-submit">Back to scanning</Link>
          </>
        ) : user ? (
          <>
            <form action={startCheckout}>
              <button type="submit" className="btn btn-primary auth-submit">Upgrade to Pro: $6/mo</button>
            </form>
            <Link href="/dashboard" className="btn btn-ghost auth-submit pro-continue">
              Continue with free
            </Link>
            <p className="auth-alt">Secure checkout by Stripe. Test mode: no real charges.</p>
          </>
        ) : (
          <>
            <Link href="/signup" className="btn btn-primary auth-submit">Sign up free</Link>
            <p className="auth-alt">
              Start with {FREE_DAILY_SCANS} free scans a day. Upgrade from your dashboard anytime. Already
              have an account? <Link href="/login">Log in</Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
