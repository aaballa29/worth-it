import "./globals.css";

export const metadata = {
  title: "worth it? — know what it's worth before you buy",
  description:
    "Stop wasting money on thrift finds that won't sell. Snap a photo and Worth It? shows what it really resells for, with a Buy it, Maybe, or Skip it verdict.",
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
