import type { Metadata } from "next";
import { VeltSetup } from "@/components/velt/VeltSetup";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const root = document.documentElement
                const savedTheme = localStorage.getItem('theme')
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark
                root.classList.toggle('dark', shouldUseDark)
                root.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light')
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <VeltSetup>{children}</VeltSetup>
      </body>
    </html>
  );
}
