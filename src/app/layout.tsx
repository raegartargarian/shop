import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import UserMenu from "@/components/UserMenu";
import { CartIcon } from "@/components/CartIcon";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shopfront",
    template: "%s | Shopfront",
  },
  description: "A small catalog of well-made things.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink-50 text-ink-900">
        <header className="border-b border-ink-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-ink-900"
            >
              Shopfront
            </Link>
            <nav className="flex items-center gap-6 text-sm text-ink-700">
              <Link href="/" className="hover:text-ink-900">
                Shop
              </Link>
              <UserMenu />
              <CartIcon />
            </nav>
          </div>
        </header>
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
