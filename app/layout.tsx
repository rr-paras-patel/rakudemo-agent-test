import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { themeInitScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: { default: "RakuDemo | Cash back on every purchase", template: "%s | RakuDemo" },
  description: "Earn cash back at your favorite stores with RakuDemo, a demo cashback shopping platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
