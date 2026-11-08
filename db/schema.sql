-- Worth It? database schema.
-- The app creates these tables automatically on first use (see lib/db.js),
-- so you only need this file if you want to set things up by hand in the Neon SQL editor.

CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  paid          BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_customer_id TEXT,              -- set by the Stripe webhook after checkout
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,            -- SHA-256 of the session token; the raw token only lives in the cookie
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);

-- One row per successful AI scan; used to enforce the free plan's daily limit.
CREATE TABLE IF NOT EXISTS scans (
  id         BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rechecked  BOOLEAN NOT NULL DEFAULT FALSE,  -- one free re-run with brand/tag info
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scans_user_id_created_at_idx ON scans (user_id, created_at);
