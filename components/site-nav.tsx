'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/events', label: 'Past Events' },
  { href: '/artists', label: 'Team' },
  { href: '/about', label: 'About' },
]

export default function SiteNav() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/assets/images/lhp-logo.jpeg"
            alt="Lion Heart Productions"
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="sr-only">Home</span>
        </Link>

        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              item.href === '/events'
                ? pathname.startsWith('/events')
                : pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold uppercase tracking-wide transition ${
                  isActive
                    ? 'text-violet-700 underline decoration-violet-500 underline-offset-8'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
