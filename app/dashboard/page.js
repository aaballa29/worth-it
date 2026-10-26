import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { logOut } from "../actions/auth";

export const metadata = { title: "Dashboard — worth it?" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

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

        <div className="dash-grid">
          <section className="dash-card dash-scan">
            <h2>Scan an item</h2>
            <p>Snap a photo of something on the rack to get a Worth It or Pass verdict.</p>
            <span className="sticker dash-soon tilt-r">Coming<br />soon</span>
          </section>

          <section className="dash-card">
            <h2>Your plan</h2>
            {user.paid ? (
              <p>You&rsquo;re on <strong>Pro</strong>: unlimited scans and ready-to-post Depop listings.</p>
            ) : (
              <>
                <p>You&rsquo;re on <strong>Free</strong>: 5 scans a day with verdicts and profit estimates.</p>
                <p className="dash-note">Upgrading to Pro is coming soon.</p>
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
