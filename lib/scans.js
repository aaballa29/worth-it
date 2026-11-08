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

export async function recordScan(userId) {
  const sql = await db();
  await sql`INSERT INTO scans (user_id) VALUES (${userId})`;
}
