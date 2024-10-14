import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MochieByte",
  description: "Programmed To Eat",
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
