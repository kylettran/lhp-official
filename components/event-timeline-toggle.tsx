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
    <section
      aria-label="Event navigation"
      className="relative z-10 mx-auto mt-8 max-w-6xl px-4 pb-28"
    >
      <div className="fixed inset-x-0 bottom-4 z-[120] flex justify-center px-4 md:bottom-6 lg:bottom-8">
        <div className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-neutral-200 bg-white/95 px-4 py-3 shadow-lg transition-all duration-200 backdrop-blur-sm md:px-5 md:py-3">
          <div className="flex-1">
            {previousEvent ? (
              <Link
                href={`/events/${previousEvent.slug.current}`}
                className="w-full rounded-full bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-900 transition hover:bg-neutral-100 sm:px-5 sm:py-3 sm:text-xs"
              >
                ‹ Previous event
              </Link>
            ) : (
              <button
                type="button"
                disabled
              className="w-full rounded-full bg-neutral-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 sm:px-5 sm:py-3 sm:text-xs"
              >
                This was our first event!
              </button>
            )}
          </div>
          <div className="flex-1 text-right">
            {nextEvent ? (
              <Link
                href={`/events/${nextEvent.slug.current}`}
                className="w-full rounded-full bg-neutral-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-800 sm:px-5 sm:py-3 sm:text-xs"
              >
                Next event ›
              </Link>
            ) : (
              <button
                type="button"
                disabled
              className="w-full rounded-full bg-neutral-50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-400 sm:px-5 sm:py-3 sm:text-xs"
              >
                No upcoming event yet
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
