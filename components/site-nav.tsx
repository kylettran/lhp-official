'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/events', label: 'Past Events' },
  { href: '/artists', label: 'Team' },
  { href: '/wof#artists-section', label: 'WOF' },
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
            const baseHref = item.href.split('#')[0]
            const isActive =
              baseHref === '/events'
                ? pathname.startsWith('/events')
                : pathname === baseHref

            if (item.label === 'WOF') {
              return (
                <div
                  key={`${item.href}-${item.label}`}
                  className="group relative"
                >
                  <Link
                    href={item.href}
                    className={`text-sm font-semibold uppercase tracking-wide transition ${
                      isActive
                        ? 'text-violet-700 underline decoration-violet-500 underline-offset-8'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                  <div className="invisible absolute left-1/2 top-full z-20 min-w-40 -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <Link
                      href="/wof#artists-section"
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      Artists
                    </Link>
                    <Link
                      href="/wof#djs-section"
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      DJs
                    </Link>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={`${item.href}-${item.label}`}
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
