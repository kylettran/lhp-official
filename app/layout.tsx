import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lion Heart Productions',
  description: 'Events, artists, and experiences by Lion Heart Productions.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        
        {/* GLOBAL NAVIGATION */}
        <header className="border-b">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex gap-6">
            <Link href="/" className="font-semibold hover:underline">
              Home
            </Link>

            <Link href="/artists" className="hover:underline">
              Artists
            </Link>

            <Link href="/about" className="hover:underline">
              About
            </Link>
          </nav>
        </header>

        {/* PAGE CONTENT */}
        {children}

        <SpeedInsights />
      </body>
    </html>
  )
}