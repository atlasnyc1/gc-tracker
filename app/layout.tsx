import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GC Tracker",
  description: "The job tracker built for how small GCs actually work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
