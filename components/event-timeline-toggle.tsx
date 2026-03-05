'use client'

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
  const previousEvent = earlierEvents[0]
  const nextEvent = laterEvents[0]

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          {previousEvent ? (
            <Link
              href={`/events/${previousEvent.slug.current}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-900 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900 transition hover:border-neutral-600 hover:text-neutral-900"
            >
              ‹ Previous event
            </Link>
          ) : (
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              This was our first event!
            </button>
          )}
        </div>
        <div className="flex-1 text-right">
          {nextEvent ? (
            <Link
              href={`/events/${nextEvent.slug.current}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-900 bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800"
            >
              Next event ›
            </Link>
          ) : (
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              No upcoming event yet
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
