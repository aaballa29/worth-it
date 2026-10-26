"use server";

import Anthropic from "@anthropic-ai/sdk";
import { appraiseItem, AppraisalError } from "@/lib/appraise";
import { getCurrentUser } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 3.75 * 1024 * 1024; // Claude's per-image limit is 5 MB of base64 (~3.75 MB raw)

export async function appraise(_prev, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Your session expired. Please log in again." };
  if (!user.paid) return { error: "Scanning is a Pro feature. Upgrade to start scanning." };

  const photo = formData.get("photo");
  if (!photo || typeof photo === "string" || photo.size === 0) {
    return { error: "Add a photo of the item first." };
  }
  if (!ALLOWED_TYPES.includes(photo.type)) {
    return { error: "That file type isn't supported. Use a JPG, PNG, or WebP photo." };
  }
  if (photo.size > MAX_BYTES) {
    return { error: "That photo is too large. Try a smaller one." };
  }

  const paidRaw = String(formData.get("paid") ?? "").replace(/[$,\s]/g, "");
  let paid = null;
  if (paidRaw) {
    paid = Number(paidRaw);
    if (!Number.isFinite(paid) || paid < 0 || paid > 100000) {
      return { error: "Enter what you paid as a number, like 8 or 12.50." };
    }
  }

  try {
    const imageBase64 = Buffer.from(await photo.arrayBuffer()).toString("base64");
    const result = await appraiseItem({ imageBase64, mediaType: photo.type, paid });
    return { result: { ...result, paid } };
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
