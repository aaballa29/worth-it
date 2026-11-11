import { removeScan } from "../actions/appraise";

const VERDICT_LABEL = { buy_it: "BUY IT ✓", maybe: "MAYBE ?", skip_it: "SKIP IT ✕" };
const CONFIDENCE_LABEL = { high: "High confidence", medium: "Medium confidence", low: "Low confidence" };

const money = (n) => `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

function range(low, high) {
  if (!high) return "Unknown";
  return low === high ? money(low) : `${money(low)}–${money(high)}`;
}

// Past scans as cards. `compact` drops the reason and remove button (used on the dashboard).
export default function ScanHistoryList({ scans, compact = false }) {
  return (
    <ul className={`history-list${compact ? " history-compact" : ""}`}>
      {scans.map((s) => (
        <li key={s.id} className="history-item">
          <div className="history-thumb">
            {s.thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.thumb} alt="" loading="lazy" />
            ) : (
              <span aria-hidden="true">?</span>
            )}
          </div>

          <div className="history-body">
            <div className="history-top">
              <span className={`history-verdict verdict-${s.verdict}`}>{VERDICT_LABEL[s.verdict]}</span>
              <time dateTime={new Date(s.created_at).toISOString()}>
                {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </time>
            </div>
            <h3>{s.item}</h3>
            <p className="history-brand">{s.brand || "Brand not visible"}</p>
            <p className="history-prices">
              <strong>{range(s.resale_low, s.resale_high)}</strong> resale
              {s.price_paid != null && <> · paid {money(s.price_paid)}</>}
            </p>

            {!compact && (
              <>
                {s.reason && <p className="history-reason">{s.reason}</p>}
                <div className="history-foot">
                  {s.confidence && <span className="history-conf">{CONFIDENCE_LABEL[s.confidence]}</span>}
                  <form action={removeScan}>
                    <input type="hidden" name="scanId" value={String(s.id)} />
                    <button type="submit" className="history-remove">Remove</button>
                  </form>
                </div>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
