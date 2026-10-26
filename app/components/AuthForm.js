"use client";

import { useActionState } from "react";
import Link from "next/link";

// Shared sign-up / log-in form. `action` is a Server Action from app/actions/auth.js.
export default function AuthForm({ mode, action }) {
  const [state, formAction, pending] = useActionState(action, { error: null, email: "" });
  const isSignUp = mode === "signup";

  return (
    <main className="auth">
      <Link href="/" className="nav-logo auth-logo" aria-label="worth it? home">
        worth it<span>?</span>
      </Link>

      <div className="auth-card">
        <span className="badge">{isSignUp ? "Free to start" : "Welcome back"}</span>
        <h1>{isSignUp ? "Create your account" : "Log in"}</h1>

        <form action={formAction} className="auth-form" noValidate>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state.email}
            key={state.email}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={isSignUp ? 8 : undefined}
            required
          />
          {isSignUp && <p className="auth-hint">At least 8 characters.</p>}

          {state.error && (
            <p className="auth-error" role="alert">
              {state.error}
            </p>
          )}

          <button type="submit" className="btn btn-primary auth-submit" disabled={pending}>
            {pending ? "One sec…" : isSignUp ? "Sign up free" : "Log in"}
          </button>
        </form>

        <p className="auth-alt">
          {isSignUp ? (
            <>Already have an account? <Link href="/login">Log in</Link></>
          ) : (
            <>New here? <Link href="/signup">Sign up free</Link></>
          )}
        </p>
      </div>
    </main>
  );
}
