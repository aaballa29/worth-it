import Link from "next/link";

// Your name for the footer.
const BUILDER_NAME = "Annalise Aballa";

// Where the Sign up / Log in buttons go. Point these at your real auth pages when they exist.
const SIGNUP_URL = "/signup";
const LOGIN_URL = "/login";

const SCRIBBLE =
  "M8 210 C 110 130, 170 270, 262 180 C 330 112, 300 48, 252 92 C 206 136, 320 250, 424 186 C 520 128, 556 236, 646 178 C 716 132, 700 70, 660 98 C 620 126, 690 240, 790 190 C 850 160, 880 130, 920 60";

const FLIPS = [
  "thrifted for $8 → sold for $64",
  "thrifted for $4 → sold for $38",
  "thrifted for $12 → sold for $85",
  "thrifted for $3 → sold for $29",
  "thrifted for $15 → sold for $120",
  "thrifted for $6 → sold for $52",
];

/* ---------- hand-drawn bits ---------- */

function Arrow({ className = "", flip = false }) {
  return (
    <svg
      className={`scribble ${className}`}
      viewBox="0 0 140 70"
      fill="none"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M6 52 C 30 18, 78 6, 124 30" />
      <path d="M104 16 L 126 31 L 101 42" />
    </svg>
  );
}

function CurlyArrow({ className = "" }) {
  return (
    <svg className={`scribble ${className}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path d="M14 10 C 60 6, 92 30, 70 56 C 54 74, 30 58, 46 44 C 64 28, 96 54, 98 104" />
      <path d="M84 90 L 98 106 L 110 88" />
    </svg>
  );
}

function Circle({ className = "" }) {
  return (
    <svg className={`scribble ${className}`} viewBox="0 0 220 90" fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path d="M150 10 C 80 2, 12 16, 8 46 C 4 76, 90 86, 150 80 C 200 74, 216 50, 206 32 C 196 14, 150 6, 104 10" />
    </svg>
  );
}

function Underline({ className = "" }) {
  return (
    <svg className={`scribble ${className}`} viewBox="0 0 300 24" fill="none" aria-hidden="true" preserveAspectRatio="none">
      <path d="M4 16 C 60 6, 120 20, 180 10 C 230 2, 270 14, 296 8" />
    </svg>
  );
}

function Star({ className = "" }) {
  return (
    <svg className={`scribble ${className}`} viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <path d="M30 4 L 30 56 M4 30 L 56 30 M12 12 L 48 48 M48 12 L 12 48" />
    </svg>
  );
}

function Jacket() {
  return (
    <svg className="jacket" viewBox="0 0 240 240" fill="none" aria-label="Sketch of a vintage chore jacket" role="img">
      <rect x="0" y="0" width="240" height="240" fill="#DFEACA" />
      {/* body */}
      <path
        d="M88 40 L 60 54 L 30 120 L 44 190 L 66 186 L 64 120 L 70 206 L 170 206 L 176 120 L 174 186 L 196 190 L 210 120 L 180 54 L 152 40 L 120 60 Z"
        fill="#FFFFFF"
        stroke="#111111"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* collar */}
      <path d="M88 40 L 104 78 L 120 60 L 136 78 L 152 40" stroke="#111111" strokeWidth="4" strokeLinejoin="round" fill="#DFEACA" />
      {/* placket */}
      <path d="M120 60 L 120 206" stroke="#111111" strokeWidth="4" />
      {[96, 126, 156, 186].map((y) => (
        <circle key={y} cx="128" cy={y} r="4" fill="#111111" />
      ))}
      {/* pockets */}
      <rect x="80" y="140" width="30" height="32" stroke="#111111" strokeWidth="4" fill="#DFEACA" />
      <rect x="132" y="140" width="30" height="32" stroke="#111111" strokeWidth="4" fill="#DFEACA" />
      <path d="M84 98 L 108 98 M84 106 L 104 106" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- page ---------- */

const PLATFORMS = [
  {
    name: "Depop",
    tag: "Vintage, Y2K & streetwear",
    text: "Know which pieces will actually move with Gen Z buyers, then post with a listing written for Depop.",
  },
  {
    name: "Poshmark",
    tag: "Brands & closet staples",
    text: "Spot the mall-brand finds worth listing and skip the ones that sit in your closet for months.",
  },
  {
    name: "eBay",
    tag: "Everything else",
    text: "Get a fast read on resale value for the odd stuff, so you don't spend 10 minutes scrolling sold comps in the aisle.",
  },
];

const FAQS = [
  {
    q: "How does Worth It? know what something will sell for?",
    a: "It identifies the item from your photo (brand, era, style) and estimates its resale price, then subtracts what you paid plus fees and shipping to show your real profit. It's an estimate, not a guarantee, but it's a lot better than guessing.",
  },
  {
    q: "Which platforms does it work for?",
    a: "Verdicts and profit estimates work whether you sell on Depop, Poshmark, or eBay. Ready-to-post listings are written for Depop.",
  },
  {
    q: "Do I need a credit card to try it?",
    a: "No. The free plan gives you 5 scans a day with no card required. Upgrade to Pro whenever you want unlimited scans.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes. Cancel whenever you like and you'll keep Pro until the end of the month you paid for.",
  },
];

export default function Home() {
  return (
    <>
      <div className="announce">
        Free to try — find your first flip today
      </div>

      <header className="nav wrap">
        <Link href="/" className="nav-logo" aria-label="worth it? home">
          worth it<span>?</span>
        </Link>
        <nav aria-label="Main">
          <a href="#how" className="nav-hide-sm">How it works</a>
          <a href="#who" className="nav-hide-sm">Who it&rsquo;s for</a>
          <a href="#pricing" className="nav-hide-sm">Pricing</a>
          <Link href={LOGIN_URL} className="nav-login">Log in</Link>
          <Link href={SIGNUP_URL} className="btn btn-primary btn-sm">Sign up</Link>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="hero wrap">
          <div className="wordmark" role="img" aria-label="worth it?">
            <span className="wm-text">worth it</span>
            <span className="wm-q">?</span>
            <svg className="wm-scribble" viewBox="0 0 1000 300" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <path className="wm-scribble-halo" pathLength="1" d={SCRIBBLE} />
              <path pathLength="1" d={SCRIBBLE} />
            </svg>
          </div>

          <div className="hero-body">
            <div className="hero-copy">
              <h1>
                Know what it&rsquo;s worth{" "}
                <span className="hl">
                  before you buy it.
                  <Underline className="hl-underline" />
                </span>
              </h1>
              <p className="lede">
                Snap a photo of anything on the rack. Our AI tells you what it&rsquo;ll resell for, your
                real profit after fees and shipping, and a clear <strong>Worth It</strong> or{" "}
                <strong>Pass</strong> in about 5 seconds.
              </p>
              <div className="cta-row">
                <Link href={SIGNUP_URL} className="btn btn-primary">Sign up free</Link>
                <a href="#how" className="btn btn-ghost">See how it works</a>
                <div className="cta-note" aria-hidden="true">
                  <CurlyArrow className="cta-arrow" />
                  <span>no card needed!</span>
                </div>
              </div>
              <p className="for-line">
                Made for resellers on
                <span className="chip">Depop</span>
                <span className="chip">Poshmark</span>
                <span className="chip">eBay</span>
              </p>
            </div>

            <div className="hero-stickers" aria-hidden="true">
              <div className="sticker sticker-lg tilt-l">5 sec<br />verdicts</div>
              <div className="pricetag tilt-r">
                <span className="pricetag-hole" />
                $8 → $64
              </div>
              <div className="badge tilt-l2">AI-powered</div>
              <Star className="hero-star" />
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-label="Example flips">
          <div className="ticker-track">
            {[...FLIPS, ...FLIPS].map((f, i) => (
              <span key={i} className="ticker-item" aria-hidden={i >= FLIPS.length}>
                {f}
                <span className="ticker-dot">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="how">
          <div className="wrap">
            <div className="section-head">
              <span className="badge">How it works</span>
              <h2>Three steps. Zero guesswork.</h2>
            </div>

            <ol className="steps">
              <li className="step">
                <span className="step-num">1</span>
                <h3>Snap a photo</h3>
                <p>Point your camera at the item, the tag, or both. Right there in the aisle.</p>
              </li>
              <li className="step-arrow" aria-hidden="true"><Arrow /></li>
              <li className="step">
                <span className="step-num">2</span>
                <h3>Get your verdict</h3>
                <p>
                  A clear <strong>&ldquo;Worth It&rdquo;</strong> or <strong>&ldquo;Pass&rdquo;</strong>{" "}
                  with the estimated resale price and your profit after fees and shipping.
                </p>
              </li>
              <li className="step-arrow" aria-hidden="true"><Arrow /></li>
              <li className="step">
                <span className="step-num">3</span>
                <h3>Post it</h3>
                <p>Bought it? Get a ready-to-post Depop listing with title, description, and hashtags.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* EXAMPLE CARD */}
        <section id="example" className="example wrap">
          <div className="section-head">
            <span className="badge">Example scan</span>
            <h2>Here&rsquo;s what you get.</h2>
          </div>

          <article className="card">
            <div className="card-media">
              <Jacket />
              <div className="verdict">WORTH IT ✓</div>
            </div>

            <div className="card-body">
              <p className="card-kicker">Scanned in 4 seconds</p>
              <h3>Vintage 90s canvas chore jacket</h3>

              <dl className="prices">
                <div>
                  <dt>Thrift price</dt>
                  <dd>$12</dd>
                </div>
                <div>
                  <dt>Est. resale</dt>
                  <dd>$85</dd>
                </div>
                <div className="profit">
                  <dt>Profit</dt>
                  <dd>+$62</dd>
                  <Circle className="profit-circle" />
                </div>
              </dl>

              <div className="profit-note" aria-hidden="true">
                <span>real profit, after fees + shipping</span>
                <Arrow className="profit-arrow" />
              </div>

              <div className="listing">
                <div className="listing-head">
                  <span className="badge badge-sm">Depop listing</span>
                  <span className="listing-copy">ready to post</span>
                </div>
                <p className="listing-title">Vintage 90s Canvas Chore Jacket — Workwear, Boxy Fit, Size L</p>
                <p>
                  Super rare 90s workwear chore coat in a faded canvas. Boxy fit, corduroy-style collar,
                  4 front pockets. Perfectly broken in with light natural fading. Fits like a men&rsquo;s L / oversized on women&rsquo;s M.
                </p>
                <p className="listing-tags">#vintage #workwear #90s #chorejacket #streetwear</p>
              </div>
            </div>
          </article>
        </section>

        {/* WHO IT'S FOR */}
        <section id="who" className="who">
          <div className="wrap">
            <div className="section-head">
              <span className="badge">Who it&rsquo;s for</span>
              <h2>Built for people who flip.</h2>
              <p className="section-sub">
                Side hustle or full-time closet, if you buy secondhand to resell, Worth It? is for you.
              </p>
            </div>

            <div className="who-grid">
              {PLATFORMS.map((p, i) => (
                <article key={p.name} className={`who-card who-card-${i}`}>
                  <span className="who-name">{p.name}</span>
                  <h3>{p.tag}</h3>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WHY IT'S WORTH PAYING FOR */}
        <section id="why" className="why wrap">
          <div className="section-head">
            <span className="badge">Why pay for it</span>
            <h2>It pays for itself with one flip.</h2>
          </div>

          <div className="compare">
            <div className="compare-col">
              <h3>Without Worth It?</h3>
              <ul>
                <li><span className="x">✕</span> Scrolling sold listings for 10 minutes per item</li>
                <li><span className="x">✕</span> Guessing, then finding out fees ate your profit</li>
                <li><span className="x">✕</span> Bins of stuff that never sells</li>
                <li><span className="x">✕</span> Writing every listing by hand at midnight</li>
              </ul>
            </div>
            <div className="compare-col compare-yes">
              <h3>With Worth It?</h3>
              <ul>
                <li><span className="check">✓</span> A verdict in about 5 seconds</li>
                <li><span className="check">✓</span> Profit shown after fees and shipping</li>
                <li><span className="check">✓</span> Only buy what&rsquo;s worth flipping</li>
                <li><span className="check">✓</span> Listings written for you, ready to post</li>
              </ul>
            </div>
          </div>

          <div className="roi">
            <div className="pricetag roi-tag tilt-l">
              <span className="pricetag-hole" />
              +$62
            </div>
            <p>
              The chore jacket above made <strong>$62 profit</strong>. That covers{" "}
              <span className="roi-hl">10 months of Pro</span>. Skip just one bad buy a month and
              you&rsquo;re already ahead.
            </p>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about">
          <div className="wrap about-inner">
            <div className="about-copy">
              <span className="badge">Our story</span>
              <h2>Made by a reseller, for resellers.</h2>
              <p>
                Worth It? identifies the brand, era, and style of anything you find, estimates what
                it&rsquo;ll resell for, and gives you a clear verdict based on your real profit. When you
                buy, it writes a ready-to-post Depop listing with the title, description, and hashtags,
                so you spend less time typing and more time flipping.
              </p>
              <p className="about-note">
                Built by {BUILDER_NAME}, a reseller who spent a summer doing all of this by hand.
              </p>
            </div>
            <ul className="features">
              <li><span className="check">✓</span> Identifies brand, era &amp; style</li>
              <li><span className="check">✓</span> Estimates the resale price</li>
              <li><span className="check">✓</span> Worth It or Pass, after fees &amp; shipping</li>
              <li><span className="check">✓</span> Ready-to-post Depop listings</li>
            </ul>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="pricing wrap">
          <div className="section-head">
            <span className="badge">Pricing</span>
            <h2>Cheaper than one bad flip.</h2>
          </div>

          <div className="plans">
            <div className="plan">
              <div className="pricetag plan-tag tilt-l">
                <span className="pricetag-hole" />
                $0
              </div>
              <h3>Free</h3>
              <ul className="plan-list">
                <li><span className="check">✓</span> 5 scans a day</li>
                <li><span className="check">✓</span> Worth It / Pass verdicts</li>
                <li><span className="check">✓</span> Profit after fees &amp; shipping</li>
              </ul>
              <Link href={SIGNUP_URL} className="btn btn-ghost">Sign up free</Link>
            </div>
            <div className="plan plan-pro">
              <div className="pricetag plan-tag tilt-r">
                <span className="pricetag-hole" />
                $6/mo
              </div>
              <span className="badge badge-sm plan-pop">Most popular</span>
              <h3>Pro</h3>
              <ul className="plan-list">
                <li><span className="check">✓</span> Unlimited scans</li>
                <li><span className="check">✓</span> Ready-to-post Depop listings</li>
                <li><span className="check">✓</span> Everything in Free</li>
              </ul>
              <Link href={`${SIGNUP_URL}?plan=pro`} className="btn btn-primary">Get Pro</Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq wrap">
          <div className="section-head">
            <span className="badge">FAQ</span>
            <h2>Questions? Fair.</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final wrap">
          <h2>
            Your next flip is <span className="final-circle">on the rack<Circle /></span> right now.
          </h2>
          <Link href={SIGNUP_URL} className="btn btn-primary btn-lg">Sign up free</Link>
          <p className="final-login">
            Already have an account? <Link href={LOGIN_URL}>Log in</Link>
          </p>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span className="nav-logo">worth it<span>?</span></span>
          <nav className="footer-links" aria-label="Footer">
            <a href="#how">How it works</a>
            <a href="#who">Who it&rsquo;s for</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <Link href={LOGIN_URL}>Log in</Link>
            <Link href={SIGNUP_URL}>Sign up</Link>
          </nav>
          <p>Built by {BUILDER_NAME}</p>
        </div>
      </footer>
    </>
  );
}
