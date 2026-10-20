import type { Metadata } from "next";
import { serverEnvironment } from "@/server/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(serverEnvironment.NEXT_PUBLIC_SITE_URL),
  title: "IshpreetOS",
  description: "Ishpreet's personal operating system on the web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>{children}</body>
    </html>
  );
}
