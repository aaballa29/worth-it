import Link from "next/link";
import { redirect } from "next/navigation";
import { listScans } from "@/lib/scans";
import { getCurrentUser } from "@/lib/session";
import { logOut } from "../actions/auth";
import ScanHistoryList from "../components/ScanHistoryList";

export const metadata = { title: "My scans — worth it?" };

const FILTERS = [
  { value: "", label: "All" },
  { value: "buy_it", label: "Buy it" },
  { value: "maybe", label: "Maybe" },
  { value: "skip_it", label: "Skip it" },
];

export default async function HistoryPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const query = String(params?.q ?? "").trim().slice(0, 80);
  const verdict = String(params?.verdict ?? "");
  const scans = await listScans(user.id, { query, verdict });
  const filtering = Boolean(query || verdict);

  const filterHref = (v) => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (v) sp.set("verdict", v);
    const s = sp.toString();
    return s ? `/history?${s}` : "/history";
  };

  return (
    <>
      <header className="nav wrap">
        <Link href="/" className="nav-logo" aria-label="worth it? home">
          worth it<span>?</span>
        </Link>
        <nav aria-label="Account">
          <Link href="/dashboard" className="nav-pro">Scan an item</Link>
          <form action={logOut}>
            <button type="submit" className="btn btn-ghost btn-sm">Log out</button>
          </form>
        </nav>
      </header>

      <main className="dash wrap">
        <div className="dash-head">
          <h1>
            My <span className="hl">scans</span>
          </h1>
        </div>

        <form className="history-search" action="/history" role="search">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by item, brand, or material (e.g. denim, Levi's)"
            aria-label="Search your scans"
          />
          {verdict && <input type="hidden" name="verdict" value={verdict} />}
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>

        <div className="history-filters" aria-label="Filter by verdict">
          {FILTERS.map((f) => (
            <Link
              key={f.value || "all"}
              href={filterHref(f.value)}
              className={`chip-link${verdict === f.value ? " is-active" : ""}`}
              aria-current={verdict === f.value ? "page" : undefined}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {scans.length > 0 ? (
          <>
            <p className="history-count">
              {scans.length} {scans.length === 1 ? "scan" : "scans"}
              {query && <> matching &ldquo;{query}&rdquo;</>}
            </p>
            <ScanHistoryList scans={scans} />
          </>
        ) : (
          <div className="history-empty">
            {filtering ? (
              <>
                <p>No scans match that search.</p>
                <Link href="/history" className="btn btn-ghost btn-sm">Clear search</Link>
              </>
            ) : (
              <>
                <p>No scans yet. Your past scans will show up here so you can look back at them.</p>
                <Link href="/dashboard" className="btn btn-primary btn-sm">Scan your first item</Link>
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
}
