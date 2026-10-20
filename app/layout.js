import { Archivo, Caveat } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  variable: "--font-sans",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-hand",
});

export const metadata = {
  title: "worth it? — find your next flip in 5 seconds",
  description:
    "Worth It? is an AI tool for thrift resellers. Snap a photo, get a Worth It or Pass verdict with a profit estimate, and a ready-to-post Depop listing.",
  icons: { icon: "/favicon.svg" },
};

export const viewport = {
  themeColor: "#DFEACA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${archivo.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
