import { headers } from "next/headers";
import QRCode from "qrcode";

// Desktop-only card (hidden on phones by CSS) with a QR code that opens the scanner on your phone.
export default async function PhoneQr() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const url = `${proto}://${h.get("host")}/dashboard#scan`;
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    color: { dark: "#111111", light: "#FFFFFF" },
  });

  return (
    <aside className="phone-qr" aria-label="Use your phone's camera">
      <div className="phone-qr-code" dangerouslySetInnerHTML={{ __html: svg }} />
      <div>
        <p className="phone-qr-title">Easier with your phone?</p>
        <p>
          Scan this with your phone&rsquo;s camera to open the scanner there and snap the item directly.
          Log in with the same account.
        </p>
      </div>
    </aside>
  );
}
