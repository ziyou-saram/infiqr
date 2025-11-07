import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { CartProvider } from "@/components/cart/cart-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrlInput = process.env.NEXT_PUBLIC_APP_URL ?? "https://infiqr.vercel.app"
const siteUrl = siteUrlInput.startsWith("http") ? siteUrlInput : `https://${siteUrlInput}`
const siteName = "INFIQR"
const siteDescription =
  "Цифровое меню INFIQR — удобный способ быстро изучить ассортимент бара: кофе, напитки, алкоголь и авторские блюда."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} · Меню`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "INFIQR",
    "infiqr",
    "меню",
    "бар",
    "кофе",
    "напитки",
    "алкоголь",
    "десерты",
    "цифровое меню",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} · Цифровое меню`,
    description: siteDescription,
    images: [
      {
        url: "/infiLogo.svg",
        width: 230,
        height: 187,
        alt: "INFIQR",
      },
    ],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    site: "@infiqr",
    creator: "@infiqr",
    title: `${siteName} · Цифровое меню`,
    description: siteDescription,
    images: ["/infiLogo.svg"],
  },
  authors: [{ name: "INFIQR" }],
  icons: {
    icon: "/infiLogo.svg",
    shortcut: "/infiLogo.svg",
    apple: "/infiLogo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#f7f7f8] text-[#111111] antialiased`}
      >
        <CartProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-16 pt-12 sm:px-8">
            <header className="flex items-center justify-between gap-4 border-b border-black/5 pb-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.34em] text-black/50">
                  Infiqr
                </span>
                <h1 className="text-2xl font-semibold text-black">
                  Меню
                </h1>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70">
                <span className="inline-flex size-2 rounded-full bg-emerald-400" />
                Круглосуточно
              </div>
            </header>
            <main className="flex-1 py-10">{children}</main>
            <footer className="mt-auto border-t border-black/5 pt-6 text-xs text-black/50">
              Digital меню Infiqr · {new Date().getFullYear()}
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
