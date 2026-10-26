import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

// scrypt parameters (N = CPU/memory cost). Stored with each hash so they can be raised later.
const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(password, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password, stored) {
  const [algo, n, r, p, saltB64, keyB64] = String(stored).split("$");
  if (algo !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const key = await scryptAsync(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return timingSafeEqual(key, expected);
}

// Used when no account matches, so "wrong email" and "wrong password" take the same time.
const DUMMY_HASH = hashPassword("not-a-real-password");
export async function fakeVerify(password) {
  await verifyPassword(password, await DUMMY_HASH);
  return false;
}
