import Link from "next/link";
import { redirect } from "next/navigation";
import { FREE_DAILY_SCANS, getScanAllowance } from "@/lib/scans";
import { getCurrentUser } from "@/lib/session";
import { logOut } from "../actions/auth";
import { openBillingPortal } from "../actions/billing";
import ScanForm from "../components/ScanForm";

export const metadata = { title: "Dashboard — worth it?" };

export default async function DashboardPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const justPaid = params?.upgraded === "1";

  const name = user.email.split("@")[0];
  const allowance = await getScanAllowance(user);

  return (
    <>
      <header className="nav wrap">
        <Link href="/" className="nav-logo" aria-label="worth it? home">
          worth it<span>?</span>
        </Link>
        <nav aria-label="Account">
          <span className="dash-email">{user.email}</span>
          {!user.paid && (
            <Link href="/pro" className="nav-pro">Go Pro</Link>
          )}
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
          <section id="scan" className="dash-card dash-scan">
            <h2>Scan an item</h2>
            <p>Snap a photo of something on the rack to see what it&rsquo;s really worth before you buy.</p>
            <ScanForm initialAllowance={allowance} />
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
              <>
                <p>
                  You&rsquo;re on <strong>Free</strong>: {FREE_DAILY_SCANS} scans a day. Go Pro for unlimited
                  scans.
                </p>
                <Link href="/pro" className="btn btn-ghost btn-sm dash-manage-link">See Pro</Link>
              </>
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
