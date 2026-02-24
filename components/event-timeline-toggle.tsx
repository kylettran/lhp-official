'use client'

import { useState } from 'react'
import Link from 'next/link'

type EventLink = {
  title: string
  slug: { current: string }
  date: string
}

type Props = {
  earlierEvents: EventLink[]
  laterEvents: EventLink[]
}

export default function EventTimelineToggle({
  earlierEvents,
  laterEvents,
}: Props) {
  const [view, setView] = useState<'earlier' | 'later'>('earlier')
  const items = view === 'earlier' ? earlierEvents : laterEvents

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="rounded-3xl border border-neutral-200 bg-white p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Keep Exploring
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-neutral-900">
              {view === 'earlier'
                ? 'Events before this night'
                : 'Events after this night'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setView('earlier')}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                view === 'earlier'
                  ? 'bg-neutral-900 text-white'
                  : 'border border-neutral-300 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Earlier
            </button>
            <button
              type="button"
              onClick={() => setView('later')}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                view === 'later'
                  ? 'bg-neutral-900 text-white'
                  : 'border border-neutral-300 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Later
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.length > 0 ? (
            items.map((event) => (
              <Link
                key={event.slug.current}
                href={`/events/${event.slug.current}`}
                className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-sm transition hover:border-neutral-400"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="mt-2 font-semibold text-neutral-900">
                  {event.title}
                </p>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-500">
              No events in this direction yet.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
