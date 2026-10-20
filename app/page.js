// Your name for the footer.
const BUILDER_NAME = "Annalise Aballa";

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

export default function Home() {
  return (
    <>
      <div className="announce">
        Free to try — find your first flip today
      </div>

      <header className="nav wrap">
        <a href="#" className="nav-logo" aria-label="worth it? home">
          worth it<span>?</span>
        </a>
        <nav aria-label="Main">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#login" className="nav-login">Log in</a>
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
                Is it worth it?{" "}
                <span className="hl">
                  Find out in 5 seconds.
                  <Underline className="hl-underline" />
                </span>
              </h1>
              <p className="lede">
                Standing in the thrift aisle wondering if that jacket will flip?
                Snap a photo and our AI tells you what it&rsquo;ll resell for, what
                you&rsquo;ll actually profit, and writes the listing for you.
              </p>
              <div className="cta-row">
                <a href="#try" className="btn btn-primary">Try it free</a>
                <a href="#how" className="btn btn-ghost">See how it works</a>
                <div className="cta-note" aria-hidden="true">
                  <CurlyArrow className="cta-arrow" />
                  <span>no card needed!</span>
                </div>
              </div>
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
        <div className="ticker" aria-label="Recent flips">
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
                <p>Point your camera at the tag, the item, or both. Right there in the aisle.</p>
              </li>
              <li className="step-arrow" aria-hidden="true"><Arrow /></li>
              <li className="step">
                <span className="step-num">2</span>
                <h3>Get your verdict</h3>
                <p>
                  A clear <strong>&ldquo;Worth It&rdquo;</strong> or <strong>&ldquo;Pass&rdquo;</strong>{" "}
                  with an estimated resale price and profit.
                </p>
              </li>
              <li className="step-arrow" aria-hidden="true"><Arrow /></li>
              <li className="step">
                <span className="step-num">3</span>
                <h3>Post it</h3>
                <p>Get a ready-to-post Depop listing: title, description, tags, and price.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* EXAMPLE CARD */}
        <section id="try" className="example wrap">
          <div className="section-head">
            <span className="badge">Real example</span>
            <h2>Here&rsquo;s what you get.</h2>
          </div>

          <article className="card">
            <div className="card-media">
              <Jacket />
              <div className="verdict">WORTH IT ✓</div>
            </div>

            <div className="card-body">
              <p className="card-kicker">Scanned 2 seconds ago</p>
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

        {/* ABOUT / PRODUCT DESCRIPTION */}
        <section id="about" className="about">
          <div className="wrap about-inner">
            <div className="about-copy">
              <span className="badge">What is Worth It?</span>
              <h2>Know what it&rsquo;s worth before you buy it.</h2>
              <p>
                Worth It? is an AI tool for thrift resellers. Snap a photo of anything on the rack and
                it identifies the brand, era, and style, estimates what it&rsquo;ll resell for, and gives
                you a clear verdict, <strong>Worth It</strong> or <strong>Pass</strong>, based on your
                real profit after fees and shipping.
              </p>
              <p>
                When you buy, Worth It? writes a ready-to-post Depop listing with the title,
                description, and hashtags, so you spend less time typing and more time flipping.
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
              <p>5 scans a day. Every verdict, every profit estimate.</p>
              <a href="#try" className="btn btn-ghost">Start free</a>
            </div>
            <div className="plan plan-pro">
              <div className="pricetag plan-tag tilt-r">
                <span className="pricetag-hole" />
                $6/mo
              </div>
              <span className="badge badge-sm plan-pop">Most popular</span>
              <h3>Pro</h3>
              <p>Unlimited scans plus ready-to-post Depop listings for every find.</p>
              <a href="#try" className="btn btn-primary">Go Pro</a>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final wrap">
          <h2>
            Your next flip is <span className="final-circle">on the rack<Circle /></span> right now.
          </h2>
          <a href="#try" className="btn btn-primary btn-lg">Find out if it&rsquo;s worth it</a>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <span className="nav-logo">worth it<span>?</span></span>
          <p>Built by {BUILDER_NAME}</p>
        </div>
      </footer>
    </>
  );
}
