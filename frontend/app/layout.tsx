import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Social Table — Split Bill, Tanpa Ribet",
  description: "Bagi bill jadi gampang. Scan receipt, tambah teman, langsung split.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}