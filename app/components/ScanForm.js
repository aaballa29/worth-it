"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { appraise } from "../actions/appraise";

const MAX_SIDE = 1568; // larger images are downscaled by Claude anyway

// Shrink the photo in the browser so uploads are fast and stay under server limits.
async function shrinkImage(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ?? file;
  } catch {
    // Browser couldn't decode it (e.g. HEIC on desktop); send the original and let the server decide.
    return file;
  }
}

const money = (n) => `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default function ScanForm() {
  const [state, formAction, pending] = useActionState(appraise, {});
  const [preview, setPreview] = useState(null);
  const [preparing, setPreparing] = useState(false);
  const fileRef = useRef(null);
  const busy = pending || preparing;

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function onFileChange(e) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = fileRef.current?.files?.[0];
    if (file) {
      setPreparing(true);
      const small = await shrinkImage(file);
      formData.set("photo", small, small === file ? file.name : "photo.jpg");
      setPreparing(false);
    }
    startTransition(() => formAction(formData));
  }

  const result = state.result;

  return (
    <div className="scan">
      <form className="scan-form" onSubmit={onSubmit}>
        <label className={`scan-drop${preview ? " has-photo" : ""}`}>
          <input
            ref={fileRef}
            type="file"
            name="photo"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
            onChange={onFileChange}
            disabled={busy}
          />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Your item" />
          ) : (
            <span className="scan-drop-text">
              <strong>Tap to add a photo</strong>
              <span>Take one or pick from your camera roll</span>
            </span>
          )}
        </label>

        <div className="scan-side">
          <label htmlFor="paid" className="scan-label">
            What does it cost? <span>(optional)</span>
          </label>
          <div className="scan-price">
            <span aria-hidden="true">$</span>
            <input id="paid" name="paid" type="text" inputMode="decimal" placeholder="8.00" disabled={busy} />
          </div>

          <button type="submit" className="btn btn-primary scan-submit" disabled={busy || !preview}>
            {preparing ? "Prepping photo…" : pending ? "Checking the comps…" : "Is it worth it?"}
          </button>

          {state.error && (
            <p className="auth-error" role="alert">
              {state.error}
            </p>
          )}
        </div>
      </form>

      {result && !busy && (
        <article className="card result-card" aria-live="polite">
          <div className="card-media result-media">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" />
            )}
            <div className={`verdict${result.verdict === "skip_it" ? " verdict-skip" : ""}`}>
              {result.verdict === "worth_it" ? "WORTH IT ✓" : "SKIP IT ✕"}
            </div>
          </div>

          <div className="card-body">
            <p className="card-kicker">{result.brand ? result.brand : "Brand not visible"}</p>
            <h3>{result.item}</h3>

            <dl className={`prices${result.paid == null ? " prices-2" : ""}`}>
              {result.paid != null && (
                <div>
                  <dt>You&rsquo;d pay</dt>
                  <dd>{money(result.paid)}</dd>
                </div>
              )}
              <div className="profit">
                <dt>Est. resale</dt>
                <dd>
                  {result.resaleLow === result.resaleHigh
                    ? money(result.resaleLow)
                    : `${money(result.resaleLow)}–${money(result.resaleHigh)}`}
                </dd>
              </div>
            </dl>

            <p className="result-reason">{result.reason}</p>
            <p className="result-fine">Estimates only. Check sold listings before big buys.</p>
          </div>
        </article>
      )}
    </div>
  );
}
