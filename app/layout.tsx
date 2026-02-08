import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'

const _inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InvestStart - Connect Startups & Investors',
  description: 'Platform connecting entrepreneurs with investors. Find funding, manage deals, and track investments.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0f0f12',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${_inter.className} antialiased bg-background text-foreground`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
