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

// Records a successful scan (with its result, for history) and returns its id.
export async function recordScan(userId, result, thumb) {
  const sql = await db();
  const rows = await sql`
    INSERT INTO scans (user_id, item, brand, item_type, material, condition, verdict, confidence,
                       resale_low, resale_high, price_paid, reason, thumb)
    VALUES (${userId}, ${result.item}, ${result.brand}, ${result.itemType}, ${result.material},
            ${result.condition}, ${result.verdict}, ${result.confidence}, ${result.resaleLow},
            ${result.resaleHigh}, ${result.paid}, ${result.reason}, ${thumb})
    RETURNING id`;
  return String(rows[0].id);
}

// Saves the improved result from a re-check over the original scan.
export async function updateScanResult(userId, scanId, result) {
  const sql = await db();
  await sql`
    UPDATE scans SET
      rechecked = TRUE, item = ${result.item}, brand = ${result.brand}, item_type = ${result.itemType},
      material = ${result.material}, condition = ${result.condition}, verdict = ${result.verdict},
      confidence = ${result.confidence}, resale_low = ${result.resaleLow},
      resale_high = ${result.resaleHigh}, reason = ${result.reason}
    WHERE id = ${scanId} AND user_id = ${userId}`;
}

// A user's past scans, newest first. `query` searches item, brand, type, material, and reason.
export async function listScans(userId, { query = "", verdict = "", limit = 60 } = {}) {
  const sql = await db();
  const like = query ? `%${query.replace(/[\\%_]/g, (c) => "\\" + c)}%` : null;
  const v = ["buy_it", "maybe", "skip_it"].includes(verdict) ? verdict : null;
  const rows = await sql`
    SELECT id, item, brand, item_type, material, condition, verdict, confidence, resale_low,
           resale_high, price_paid, reason, thumb, created_at
    FROM scans
    WHERE user_id = ${userId} AND NOT hidden AND item IS NOT NULL
      AND (${v}::text IS NULL OR verdict = ${v})
      AND (${like}::text IS NULL
           OR item ILIKE ${like} OR brand ILIKE ${like} OR item_type ILIKE ${like}
           OR material ILIKE ${like} OR reason ILIKE ${like})
    ORDER BY created_at DESC
    LIMIT ${limit}`;
  return rows;
}

// Removes a scan from history. It still counts toward the free daily limit.
export async function hideScan(userId, scanId) {
  const sql = await db();
  await sql`UPDATE scans SET hidden = TRUE WHERE id = ${scanId} AND user_id = ${userId}`;
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

