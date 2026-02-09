import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Excallidraw Demo",
  description: "A lightweight whiteboard built with Next.js and canvas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
