// Hand-drawn style illustrations of thrift finds, in the brand's mint / white / black.
const INK = "#111111";
const MINT = "#DFEACA";
const WHITE = "#FFFFFF";

const line = { stroke: INK, strokeWidth: 4, strokeLinejoin: "round", strokeLinecap: "round" };

function Art({ label, children }) {
  return (
    <svg className="find-art" viewBox="0 0 240 240" role="img" aria-label={label}>
      <rect width="240" height="240" fill={MINT} />
      {children}
    </svg>
  );
}

export function WesternShirt() {
  return (
    <Art label="Drawing of a pearl-snap western shirt">
      <path d="M80 44 L58 54 L28 128 L44 188 L64 184 L66 126 L70 206 L170 206 L174 126 L176 184 L196 188 L212 128 L182 54 L160 44 L120 58 Z" fill={WHITE} {...line} />
      <path d="M66 84 Q92 94 104 112 L120 98 L136 112 Q148 94 174 84" fill="none" {...line} />
      <path d="M80 44 L96 76 L120 58 L144 76 L160 44" fill={WHITE} {...line} />
      <path d="M120 58 V206" {...line} />
      <path d="M80 120 H112 V150 H80 Z" fill={WHITE} {...line} />
      <path d="M80 120 L96 133 L112 120 Z" fill={MINT} {...line} />
      <path d="M128 120 H160 V150 H128 Z" fill={WHITE} {...line} />
      <path d="M128 120 L144 133 L160 120 Z" fill={MINT} {...line} />
      {[92, 116, 140, 164, 188].map((y) => (
        <circle key={y} cx="120" cy={y} r="5" fill={MINT} stroke={INK} strokeWidth="2.5" />
      ))}
      <path d="M44 174 L64 170 M196 174 L176 170" {...line} />
    </Art>
  );
}

export function Jeans() {
  return (
    <Art label="Drawing of vintage straight-leg jeans">
      <path d="M60 48 L54 210 L108 210 L120 94 L132 210 L186 210 L180 48 Z" fill={WHITE} {...line} />
      <rect x="60" y="30" width="120" height="18" fill={WHITE} {...line} />
      {[74, 102, 132, 160].map((x) => (
        <rect key={x} x={x} y="24" width="7" height="28" rx="2" fill={WHITE} {...line} strokeWidth="3" />
      ))}
      <circle cx="120" cy="39" r="4.5" fill={MINT} stroke={INK} strokeWidth="2.5" />
      <path d="M120 48 Q123 76 108 92" fill="none" {...line} />
      <path d="M62 62 Q80 82 98 56 M178 62 Q160 82 142 56" fill="none" {...line} />
      <path d="M56 194 H106 M134 194 H184" {...line} strokeWidth="3" />
      <path d="M140 140 h26 v24 h-26 Z" fill={MINT} {...line} strokeWidth="3" />
    </Art>
  );
}

export function CableKnit() {
  return (
    <Art label="Drawing of a chunky cable-knit sweater">
      <path d="M84 46 Q120 70 156 46 L184 58 L214 140 L194 150 L176 104 L176 204 L64 204 L64 104 L46 150 L26 140 L56 58 Z" fill={WHITE} {...line} />
      <path d="M90 50 Q120 64 150 50" fill="none" {...line} strokeWidth="3" />
      <path d="M64 120 H176 V138 H64 Z" fill={MINT} {...line} />
      <path d="M120 70 C104 80 136 92 120 102 M120 150 C104 160 136 170 120 180" fill="none" {...line} />
      <path d="M92 76 v40 M148 76 v40 M92 146 v40 M148 146 v40" {...line} strokeWidth="3" strokeDasharray="5 6" />
      <path d="M64 190 H176" {...line} />
      {[74, 90, 106, 122, 138, 154, 168].map((x) => (
        <path key={x} d={`M${x} 191 V204`} {...line} strokeWidth="2.5" />
      ))}
    </Art>
  );
}

export function ShoulderBag() {
  return (
    <Art label="Drawing of a leather shoulder bag">
      <path d="M84 100 Q84 38 120 38 Q156 38 156 100" fill="none" {...line} strokeWidth="7" />
      <path d="M50 100 L190 100 L178 200 L62 200 Z" fill={WHITE} {...line} />
      <path d="M50 100 L190 100 L182 150 Q120 170 58 150 Z" fill={MINT} {...line} />
      <path d="M60 110 L180 110" stroke={INK} strokeWidth="2" strokeDasharray="6 6" />
      <path d="M68 188 L172 188" stroke={INK} strokeWidth="2" strokeDasharray="6 6" />
      <rect x="108" y="148" width="24" height="18" rx="4" fill={WHITE} {...line} strokeWidth="3" />
    </Art>
  );
}

export function Sneaker() {
  return (
    <Art label="Drawing of a retro court sneaker">
      <path d="M26 150 Q28 124 58 120 L102 114 L118 96 Q130 84 150 84 L182 84 Q198 86 202 104 L210 150 Z" fill={WHITE} {...line} />
      <path d="M150 84 Q166 100 200 98" fill="none" {...line} strokeWidth="3" />
      <path d="M118 96 Q126 78 146 82" fill={WHITE} {...line} strokeWidth="3" />
      <path d="M108 114 L130 100 M118 124 L142 108 M128 134 L154 116" {...line} strokeWidth="3" />
      <path d="M62 142 Q112 118 176 138" fill="none" {...line} strokeWidth="7" />
      <path d="M26 150 Q32 130 58 126" fill="none" {...line} strokeWidth="3" />
      <path d="M20 150 H216 Q220 172 202 178 H36 Q16 172 20 150 Z" fill={MINT} {...line} />
      <path d="M30 164 H206" {...line} strokeWidth="2.5" />
    </Art>
  );
}

export function TourTee() {
  return (
    <Art label="Drawing of a vintage 1994 tour t-shirt">
      <path d="M78 44 L42 62 L24 104 L52 116 L62 98 L62 204 L178 204 L178 98 L188 116 L216 104 L198 62 L162 44 Q120 72 78 44 Z" fill={WHITE} {...line} />
      <path d="M86 48 Q120 66 154 48" fill="none" {...line} strokeWidth="3" />
      <circle cx="120" cy="124" r="34" fill={MINT} {...line} />
      <path d="M126 98 L104 130 L118 130 L112 154 L136 120 L122 120 L130 98 Z" fill={INK} />
      <text x="120" y="186" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily="Archivo, sans-serif">
        TOUR &rsquo;94
      </text>
    </Art>
  );
}
