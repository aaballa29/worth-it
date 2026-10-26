import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { logOut } from "../actions/auth";
import { openBillingPortal, startCheckout } from "../actions/billing";
import ScanForm from "../components/ScanForm";

export const metadata = { title: "Dashboard — worth it?" };

export default async function DashboardPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const justPaid = params?.upgraded === "1";

  const name = user.email.split("@")[0];

  return (
    <>
      <header className="nav wrap">
        <Link href="/" className="nav-logo" aria-label="worth it? home">
          worth it<span>?</span>
        </Link>
        <nav aria-label="Account">
          <span className="dash-email">{user.email}</span>
          <form action={logOut}>
            <button type="submit" className="btn btn-ghost btn-sm">Log out</button>
          </form>
        </nav>
      </header>

      <main className="dash wrap">
        <div className="dash-head">
          <h1>
            Hey, <span className="hl">{name}</span>
          </h1>
          <span className={`badge dash-plan${user.paid ? "" : " dash-plan-free"}`}>
            {user.paid ? "Pro plan" : "Free plan"}
          </span>
        </div>

        {justPaid && user.paid && (
          <p className="dash-banner" role="status">You&rsquo;re Pro now. Go find your next flip!</p>
        )}
        {justPaid && !user.paid && (
          <p className="dash-banner" role="status">
            Payment received! We&rsquo;re unlocking Pro, which takes a few seconds.{" "}
            <Link href="/dashboard?upgraded=1">Refresh</Link>
          </p>
        )}
        {params?.canceled === "1" && !user.paid && (
          <p className="dash-banner" role="status">Checkout canceled. You weren&rsquo;t charged.</p>
        )}
        {params?.billing_error === "1" && (
          <p className="dash-banner" role="alert">We couldn&rsquo;t start checkout. Please try again in a minute.</p>
        )}

        <div className="dash-grid">
          <section className="dash-card dash-scan">
            <h2>Scan an item</h2>
            {user.paid ? (
              <>
                <p>Snap a photo of something on the rack to get a Worth It or Skip It verdict.</p>
                <ScanForm />
              </>
            ) : (
              <div className="upgrade">
                <div>
                  <p>
                    Scanning is part of <strong>Pro</strong>. Snap a photo of anything on the rack and get
                    its resale value and a Worth It or Skip It verdict in seconds.
                  </p>
                  <form action={startCheckout}>
                    <button type="submit" className="btn btn-primary btn-lg upgrade-btn">
                      Upgrade to Pro: $6/mo
                    </button>
                  </form>
                  <p className="upgrade-fine">Secure checkout by Stripe. Cancel anytime.</p>
                </div>
                <div className="pricetag upgrade-tag tilt-r" aria-hidden="true">
                  <span className="pricetag-hole" />
                  $6/mo
                </div>
              </div>
            )}
          </section>

          <section className="dash-card">
            <h2>Your plan</h2>
            {user.paid ? (
              <>
                <p>You&rsquo;re on <strong>Pro</strong>: unlimited scans with Worth It or Skip It verdicts.</p>
                {user.stripe_customer_id && (
                  <form action={openBillingPortal} className="dash-manage">
                    <button type="submit" className="btn btn-ghost btn-sm">Manage subscription</button>
                  </form>
                )}
              </>
            ) : (
              <p>You&rsquo;re on <strong>Free</strong>. Upgrade to Pro to unlock scanning.</p>
            )}
          </section>

          <section className="dash-card">
            <h2>Account</h2>
            <dl className="dash-dl">
              <div>
                <dt>Email</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </main>
    </>
  );
}
