"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, fakeVerify } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readForm(formData) {
  return {
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signUp(_prev, formData) {
  const { email, password } = readForm(formData);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { error: "Enter a valid email address.", email };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", email };
  }
  if (password.length > 200) {
    return { error: "Password must be 200 characters or fewer.", email };
  }

  const sql = await db();
  const passwordHash = await hashPassword(password);
  const rows = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id`;

  if (rows.length === 0) {
    return { error: "An account with that email already exists. Try logging in.", email };
  }

  await createSession(rows[0].id);
  redirect("/dashboard");
}

export async function logIn(_prev, formData) {
  const { email, password } = readForm(formData);
  const invalid = { error: "Email or password is incorrect.", email };

  if (!email || !password || password.length > 200) return invalid;

  const sql = await db();
  const rows = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`;
  const user = rows[0];

  const ok = user ? await verifyPassword(password, user.password_hash) : await fakeVerify(password);
  if (!ok) return invalid;

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logOut() {
  await destroySession();
  redirect("/");
}
