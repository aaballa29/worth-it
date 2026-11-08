"use server";

import Anthropic from "@anthropic-ai/sdk";
import { appraiseItem, AppraisalError } from "@/lib/appraise";
import { canRecheck, getScanAllowance, markRechecked, recordScan } from "@/lib/scans";
import { getCurrentUser } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 3.75 * 1024 * 1024; // Claude's per-image limit is 5 MB of base64 (~3.75 MB raw)

// Returns an error message for a bad upload, or null if it's fine.
function checkImage(file, label) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `That ${label} isn't a supported file type. Use a JPG, PNG, or WebP photo.`;
  }
  if (file.size > MAX_BYTES) return `That ${label} is too large. Try a smaller one.`;
  return null;
}

const toImage = async (file) => ({
  base64: Buffer.from(await file.arrayBuffer()).toString("base64"),
  mediaType: file.type,
});

export async function appraise(_prev, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Your session expired. Please log in again." };

  // A re-check (same item, plus a brand or tag photo) doesn't use another free scan.
  const recheckOf = String(formData.get("recheckOf") ?? "");
  const isRecheck = await canRecheck(user.id, recheckOf);

  const allowance = await getScanAllowance(user);
  if (!isRecheck && !allowance.unlimited && allowance.remaining <= 0) {
    return {
      limitReached: true,
      allowance,
      error: `You've used your ${allowance.limit} free scans for today. Go Pro for unlimited scans, or come back tomorrow.`,
    };
  }

  const photo = formData.get("photo");
  if (!photo || typeof photo === "string" || photo.size === 0) {
    return { error: "Add a photo of the item first." };
  }
  const photoError = checkImage(photo, "photo");
  if (photoError) return { error: photoError };

  const tagPhoto = formData.get("tagPhoto");
  const hasTag = tagPhoto && typeof tagPhoto !== "string" && tagPhoto.size > 0;
  if (hasTag) {
    const tagError = checkImage(tagPhoto, "tag photo");
    if (tagError) return { error: tagError };
  }

  const brandHint = String(formData.get("brand") ?? "").trim().slice(0, 80);

  const paidRaw = String(formData.get("paid") ?? "").replace(/[$,\s]/g, "");
  let paid = null;
  if (paidRaw) {
    paid = Number(paidRaw);
    if (!Number.isFinite(paid) || paid < 0 || paid > 100000) {
      return { error: "Enter what you paid as a number, like 8 or 12.50." };
    }
  }

  try {
    const images = [await toImage(photo)];
    if (hasTag) images.push(await toImage(tagPhoto));
    const result = await appraiseItem({ images, paid, brandHint });

    // Only successful scans count toward the free limit.
    let scanId = recheckOf;
    let remaining = allowance.unlimited ? null : allowance.remaining;
    if (isRecheck) {
      await markRechecked(user.id, recheckOf);
    } else {
      scanId = await recordScan(user.id);
      if (remaining != null) remaining -= 1;
    }
    return {
      result: { ...result, paid, scanId, canRecheck: !isRecheck },
      allowance: { ...allowance, remaining },
    };
  } catch (err) {
    console.error("[appraise] failed:", err);

    if (err instanceof AppraisalError) {
      if (err.code === "not_configured") {
        return { error: "Scanning isn't set up yet. (The AI key is missing on the server.)" };
      }
      if (err.code === "refused") {
        return { error: "We couldn't appraise that photo. Try a different shot of the item." };
      }
      return { error: "The appraisal came back garbled. Please try again." };
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return { error: "Scanning isn't set up correctly. (The AI key was rejected.)" };
    }
    if (err instanceof Anthropic.RateLimitError) {
      return { error: "Lots of scans right now. Give it a few seconds and try again." };
    }
    if (err instanceof Anthropic.BadRequestError) {
      return { error: "We couldn't read that photo. Try a different one." };
    }
    return { error: "Something went wrong on our end. Please try again in a minute." };
  }
}
