import { neon } from "@neondatabase/serverless";

let sql;
let schemaReady;

// Lazily connect so a missing DATABASE_URL fails at request time with a clear message,
// not during `next build`.
function getSql() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set. Connect the Neon database to this project in Vercel.");
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
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
}

export async function db() {
  const sql = getSql();
  if (!schemaReady) {
    schemaReady = ensureSchema(sql).catch((err) => {
      schemaReady = undefined;
      throw err;
    });
  }
  await schemaReady;
  return sql;
}
