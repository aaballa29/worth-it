import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE = "wi_session";
const MAX_AGE_DAYS = 30;

const hashToken = (token) => createHash("sha256").update(token).digest("hex");

// Call only from a Server Action or Route Handler (they're the only places cookies can be set).
export async function createSession(userId) {
  const sql = await db();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
  await sql`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${hashToken(token)}, ${userId}, ${expiresAt.toISOString()})`;

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    const sql = await db();
    await sql`DELETE FROM sessions WHERE id = ${hashToken(token)}`;
  }
  store.delete(COOKIE);
}

// Returns { id, email, paid, created_at } for the logged-in user, or null.
export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  const sql = await db();
  const rows = await sql`
    SELECT u.id, u.email, u.paid, u.created_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ${hashToken(token)} AND s.expires_at > NOW()`;
  return rows[0] ?? null;
}
