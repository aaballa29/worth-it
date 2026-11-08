import { neon } from "@neondatabase/serverless";

// Shared across module copies in dev so the local database isn't recreated per request.
const state = (globalThis.__worthItDb ??= { sql: undefined, schemaReady: undefined });

// Local development only: `npm run dev:local` uses a throwaway in-memory Postgres (PGlite)
// so you can test sign-up and login without touching the production database.
const useLocalDb = process.env.LOCAL_DB === "pglite" && process.env.NODE_ENV !== "production";

async function localSql() {
  const { PGlite } = await import("@electric-sql/pglite");
  const pg = new PGlite();
  // Same tagged-template interface as the Neon driver: sql`... ${value}` -> rows.
  return (strings, ...values) => {
    const text = strings.reduce((acc, part, i) => acc + `$${i}` + part);
    return pg.query(text, values).then((r) => r.rows);
  };
}

// Lazily connect so a missing DATABASE_URL fails at request time with a clear message,
// not during `next build`.
async function getSql() {
  if (!state.sql) {
    if (useLocalDb) {
      state.sql = await localSql();
    } else {
      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set. Connect the Neon database to this project in Vercel.");
      }
      state.sql = neon(process.env.DATABASE_URL);
    }
  }
  return state.sql;
}

// Create tables on first use (idempotent). Mirrors db/schema.sql.
async function ensureSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            BIGSERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      paid          BOOLEAN NOT NULL DEFAULT FALSE,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id         TEXT PRIMARY KEY,
      user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id)`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT`;
  await sql`
    CREATE TABLE IF NOT EXISTS scans (
      id         BIGSERIAL PRIMARY KEY,
      user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS scans_user_id_created_at_idx ON scans (user_id, created_at)`;
  await sql`ALTER TABLE scans ADD COLUMN IF NOT EXISTS rechecked BOOLEAN NOT NULL DEFAULT FALSE`;
}

export async function db() {
  const sql = await getSql();
  if (!state.schemaReady) {
    state.schemaReady = ensureSchema(sql).catch((err) => {
      state.schemaReady = undefined;
      throw err;
    });
  }
  await state.schemaReady;
  return sql;
}
