"use client";

import Link from "next/link";
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

// First image in a list of Files (from a drop or a paste), or null.
function firstImage(files) {
  return Array.from(files ?? []).find((f) => f.type.startsWith("image/")) ?? null;
}

const VERDICT_LABEL = { buy_it: "BUY IT ✓", maybe: "MAYBE ?", skip_it: "SKIP IT ✕" };
const CONFIDENCE_LABEL = { high: "High confidence", medium: "Medium confidence", low: "Low confidence" };

const money = (n) => `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default function ScanForm({ initialAllowance }) {
  const [state, formAction, pending] = useActionState(appraise, {});
  const [hideLimit, setHideLimit] = useState(false);
  const allowance = state.allowance ?? initialAllowance;
  const [photo, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [preparing, setPreparing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [pasteKey, setPasteKey] = useState("Ctrl+V");
  const fileRef = useRef(null);
  const dragDepth = useRef(0);
  const busy = pending || preparing;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function setPhoto(file) {
    if (!file || busyRef.current) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  // Desktop gets drop/paste hints; phones keep the simple "tap to add" box.
  useEffect(() => {
    setDesktop(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setPasteKey("⌘V");
  }, []);

  // Paste an image from the clipboard anywhere on the page (Ctrl/Cmd+V).
  useEffect(() => {
    function onPaste(e) {
      const file = firstImage(e.clipboardData?.files);
      if (!file) return; // let normal text pastes (like the price) through
      e.preventDefault();
      setPhoto(file);
    }
    // Stop the browser from opening an image dropped outside the drop area.
    function blockDrop(e) {
      if (e.dataTransfer?.types?.includes("Files")) e.preventDefault();
    }
    document.addEventListener("paste", onPaste);
    window.addEventListener("dragover", blockDrop);
    window.addEventListener("drop", blockDrop);
    return () => {
      document.removeEventListener("paste", onPaste);
      window.removeEventListener("dragover", blockDrop);
      window.removeEventListener("drop", blockDrop);
    };
  }, []);

  const dropHandlers = {
    onDragEnter(e) {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault();
      dragDepth.current += 1;
      setDragging(true);
    },
    onDragOver(e) {
      if (!e.dataTransfer?.types?.includes("Files")) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    onDragLeave() {
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setDragging(false);
    },
    onDrop(e) {
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      setPhoto(firstImage(e.dataTransfer?.files));
    },
  };

  function onFileChange(e) {
    setPhoto(e.target.files?.[0] ?? null);
  }

  // The resized photo and price from the last scan, reused when re-checking with brand info.
  const lastScan = useRef(null);
  const [brandHint, setBrandHint] = useState("");
  const [tagPhoto, setTagPhoto] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setHideLimit(false);
    const formData = new FormData(e.currentTarget);
    const file = photo;
    if (file) {
      setPreparing(true);
      const small = await shrinkImage(file);
      formData.set("photo", small, small === file ? file.name : "photo.jpg");
      setPreparing(false);
      lastScan.current = { photo: formData.get("photo"), paid: String(formData.get("paid") ?? "") };
    }
    setBrandHint("");
    setTagPhoto(null);
    startTransition(() => formAction(formData));
  }

  async function onRecheck() {
    if (!lastScan.current || !state.result) return;
    const formData = new FormData();
    formData.set("photo", lastScan.current.photo);
    formData.set("paid", lastScan.current.paid);
    formData.set("brand", brandHint.trim());
    formData.set("recheckOf", state.result.scanId);
    if (tagPhoto) {
      setPreparing(true);
      const small = await shrinkImage(tagPhoto);
      formData.set("tagPhoto", small, small === tagPhoto ? tagPhoto.name : "tag.jpg");
      setPreparing(false);
    }
    startTransition(() => formAction(formData));
  }

  const result = state.result;

  return (
    <div className={`scan${dragging ? " is-dragging" : ""}`} {...dropHandlers}>
      <form className="scan-form" onSubmit={onSubmit}>
        <label className={`scan-drop${preview ? " has-photo" : ""}`}>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
            onChange={onFileChange}
            disabled={busy}
            aria-label="Add a photo of the item"
          />
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Your item" />
          )}
          {!preview && !desktop && (
            <span className="scan-drop-text">
              <strong>Tap to add a photo</strong>
              <span>Take one or pick from your camera roll</span>
            </span>
          )}
          {!preview && desktop && (
            <span className="scan-drop-text">
              <strong>Drop a photo here</strong>
              <span>
                or paste one with <kbd>{pasteKey}</kbd>, or click to browse
              </span>
            </span>
          )}
          {preview && desktop && <span className="scan-replace">Drop, paste, or click to change</span>}
          {dragging && <span className="scan-drop-overlay">Drop it!</span>}
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

          {allowance && !allowance.unlimited && (
            <p className="scan-allowance">
              {allowance.remaining} of {allowance.limit} free scans left today ·{" "}
              <Link href="/pro">Go Pro for unlimited</Link>
            </p>
          )}

          {state.limitReached && !hideLimit ? (
            <div className="scan-limit" role="alert">
              <p>{state.error}</p>
              <div className="scan-limit-actions">
                <Link href="/pro" className="btn btn-primary btn-sm">See Pro</Link>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setHideLimit(true)}>
                  Continue with free
                </button>
              </div>
            </div>
          ) : (
            state.error && !state.limitReached && (
              <p className="auth-error" role="alert">
                {state.error}
              </p>
            )
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
            <div className={`verdict verdict-${result.verdict}`}>{VERDICT_LABEL[result.verdict]}</div>
          </div>

          <div className="card-body">
            <div className="result-meta">
              <p className="card-kicker">
                {result.brand
                  ? `${result.brand}${result.brandStatus === "user_provided" ? " (from you)" : ""}`
                  : "Brand not visible"}
              </p>
              <span className={`badge badge-sm confidence confidence-${result.confidence}`}>
                {CONFIDENCE_LABEL[result.confidence]}
              </span>
            </div>
            <h3>{result.item}</h3>

            <ul className="result-chips" aria-label="What we looked at">
              {result.itemType && <li>{result.itemType}</li>}
              {result.material && result.material !== "Unknown" && <li>{result.material}</li>}
              {result.condition && <li>{result.condition}</li>}
            </ul>

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
                  {result.resaleHigh === 0
                    ? "Unknown"
                    : result.resaleLow === result.resaleHigh
                      ? money(result.resaleLow)
                      : `${money(result.resaleLow)}–${money(result.resaleHigh)}`}
                </dd>
              </div>
            </dl>

            <p className="result-reason">{result.reason}</p>

            {result.brandStatus === "unclear" && result.canRecheck && lastScan.current && (
              <div className="brand-help">
                <p className="brand-help-title">Can&rsquo;t see a brand. Know it? Add it for a sharper estimate.</p>
                <div className="brand-help-row">
                  <input
                    type="text"
                    value={brandHint}
                    onChange={(e) => setBrandHint(e.target.value)}
                    placeholder="Type the brand"
                    maxLength={80}
                    aria-label="Brand name"
                  />
                  <label className="btn btn-ghost btn-sm brand-tag-btn">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
                      onChange={(e) => setTagPhoto(e.target.files?.[0] ?? null)}
                    />
                    {tagPhoto ? "Tag photo added ✓" : "Add a tag photo"}
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm brand-recheck"
                  onClick={onRecheck}
                  disabled={!brandHint.trim() && !tagPhoto}
                >
                  Re-check with this info
                </button>
                <p className="brand-help-fine">Doesn&rsquo;t use another free scan.</p>
              </div>
            )}

            <p className="result-fine">Estimates only. Check sold listings before big buys.</p>
          </div>
        </article>
      )}
    </div>
  );
}
