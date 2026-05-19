import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Cinzel, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AppShell from "@/components/app-shell"
import Live2dWrapper from "@/components/live2d/live2d-wrapper"
import ScrollState from "@/components/scroll-state"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-serif",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif-italic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "VanX Stream — Anime · Drama · Film · Komik · Live TV",
  description: "Streaming anime, drama, film, komik, novel, dan live TV — gaya klasik Yunani, kualitas premium.",
  generator: "Vanx Dev",
  keywords: ["anime", "drama", "film", "donghua", "komik", "novel", "live tv", "streaming", "indonesia"],
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon-192.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon-192.svg" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0a0e1a",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${cinzel.variable} ${cormorant.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ScrollState />
          <AppShell>{children}</AppShell>
          <Live2dWrapper />
        </ThemeProvider>
      </body>
    </html>
  )
}
