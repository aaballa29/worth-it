import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800;900&family=Caveat:wght@600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
