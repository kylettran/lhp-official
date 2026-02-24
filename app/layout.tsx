import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import SiteNav from '@/components/site-nav'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lion Heart Productions',
  description: 'Events, Team, and experiences by Lion Heart Productions.',
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
        <SiteNav />

        {/* PAGE CONTENT */}
        {children}

        <SpeedInsights />
      </body>
    </html>
  )
}
