import { db } from "./db";

// Free accounts get this many scans per rolling 24 hours. Pro is unlimited.
export const FREE_DAILY_SCANS = 5;

// Returns { unlimited: true } for Pro, otherwise { limit, used, remaining }.
export async function getScanAllowance(user) {
  if (user.paid) return { unlimited: true };
  const sql = await db();
  const rows = await sql`
    SELECT COUNT(*)::int AS used FROM scans
    WHERE user_id = ${user.id} AND created_at > NOW() - INTERVAL '24 hours'`;
  const used = Number(rows[0]?.used ?? 0);
  return { limit: FREE_DAILY_SCANS, used, remaining: Math.max(0, FREE_DAILY_SCANS - used) };
}

// Records a successful scan and returns its id.
export async function recordScan(userId) {
  const sql = await db();
  const rows = await sql`INSERT INTO scans (user_id) VALUES (${userId}) RETURNING id`;
  return String(rows[0].id);
}

// A scan can be re-run once (with a brand or tag photo) within an hour without using
// another free scan.
export async function canRecheck(userId, scanId) {
  if (!scanId || !/^\d+$/.test(scanId)) return false;
  const sql = await db();
  const rows = await sql`
    SELECT id FROM scans
    WHERE id = ${scanId} AND user_id = ${userId} AND NOT rechecked
      AND created_at > NOW() - INTERVAL '1 hour'`;
  return rows.length > 0;
}

export async function markRechecked(userId, scanId) {
  const sql = await db();
  await sql`UPDATE scans SET rechecked = TRUE WHERE id = ${scanId} AND user_id = ${userId}`;
}
