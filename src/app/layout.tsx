// /src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

import { CartProvider } from "@/components/cart/cart-context";

import type { Metadata } from "next";

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
  metadataBase: new URL("https://kaif.infiqr.kz"),
  title: {
    default: "KAIF — Меню ресторана",
    template: "%s | KAIF",
  },
  description:
    "KAIF — авторская кухня. Просматривайте актуальное меню, цены и специальные предложения на kaif.infiqr.kz.",
  keywords: [
    "KAIF",
    "кафе KAIF",
    "ресторан Астана",
    "меню KAIF",
    "infiqr",
  ],
  authors: [{ name: "KAIF" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://kaif.infiqr.kz",
    title: "KAIF — Меню ресторана",
    description:
      "Полное меню KAIF: авторские коктейли, гастрономические блюда. Актуальные цены и наличие позиций.",
    siteName: "KAIF",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAIF — Меню ресторана",
    description: "Посмотрите актуальное меню KAIF на kaif.infiqr.kz: блюда, коктейли.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-secondary/30 antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
