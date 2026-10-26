import Link from "next/link";

// Stand-in for the real sign-up / log-in flow until accounts exist.
export default function AuthPlaceholder({ title, message, alt }) {
  return (
    <main className="auth">
      <Link href="/" className="nav-logo auth-logo" aria-label="worth it? home">
        worth it<span>?</span>
      </Link>
      <div className="auth-card">
        <span className="badge">Almost ready</span>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link href="/" className="btn btn-primary">Back to home</Link>
        <p className="auth-alt">{alt}</p>
      </div>
    </main>
  );
}
