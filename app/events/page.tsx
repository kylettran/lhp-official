import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'
import type { CSSProperties } from 'react'

const pastEventsQuery = groq`
  *[_type == "event" && status == "past"]
  | order(date desc){
    title,
    slug,
    date,
    location,
    description
  }
`

export default async function PastEventsPage() {
  const pastEvents = await sanityClient.fetch(pastEventsQuery)
  const loveSlug = 'loves-and-lones'
  const hasLoveEvent = pastEvents.some(
    (event: any) => event.slug?.current === loveSlug
  )
  const impactEvents = [
    {
      name: '2K24 Rager',
      attendees: 20,
      href: '/rager-2k24.html',
    },
    {
      name: '2K25 Sundown',
      attendees: 25,
      href: '/sundown-2k25.html',
    },
    {
      name: '2K25 Rager',
      attendees: 65,
      href: '/rager-2k25.html',
    },
    {
      name: 'Lovers & Loners',
      attendees: 150,
      href: '/events/loves-and-lones',
    },
  ]
  const totalAttendees = 260
  const maxAttendees = Math.max(...impactEvents.map((event) => event.attendees))

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Past Events
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
          Recaps & Memories
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-500">
          Every night has a story. Tap the date and event name to dive into the
          full recap.
        </p>
      </div>

      <section className="impact-section mt-12">
        <div className="impact-header">
          <p className="impact-kicker">Our Impact</p>
          <p className="impact-total-number">{totalAttendees}+</p>
          <p className="impact-total-label">Total Event Attendees</p>
        </div>

        <div className="impact-chart" aria-label="Event attendee bar chart">
          {impactEvents.map((event, index) => {
            const widthPercentage = (event.attendees / maxAttendees) * 100
            return (
              <a
                key={event.name}
                href={event.href}
                className={`impact-row ${event.name === 'Lovers & Loners' ? 'impact-row--featured' : ''}`}
              >
                <div className="impact-row-meta">
                  <span className="impact-event-name">{event.name}</span>
                  <span className="impact-event-count">{event.attendees}</span>
                </div>
                <div className="impact-bar-track">
                  <span
                    className="impact-bar-fill"
                    style={
                      {
                        '--bar-width': `${widthPercentage}%`,
                        '--bar-delay': `${index * 140}ms`,
                      } as CSSProperties
                    }
                  />
                </div>
              </a>
            )
          })}
        </div>

        <details className="impact-breakdown">
          <summary>Event Breakdown</summary>
          <div className="impact-cards">
            {impactEvents.map((event) => (
              <a key={`${event.name}-card`} href={event.href} className="impact-card">
                <p className="impact-card-name">{event.name}</p>
                <p className="impact-card-count">{event.attendees} attendees</p>
              </a>
            ))}
          </div>
        </details>
      </section>

      <div className="mt-12 flex flex-col items-center gap-4">
        {!hasLoveEvent && (
          <Link
            href="/events/loves-and-lones"
            className="w-full max-w-2xl rounded-2xl border border-rose-200 bg-[#fff5f7] px-6 py-5 text-center transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-rose-500">
              2/12/2026
            </p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">
              Loves and Lones
            </p>
          </Link>
        )}
        {pastEvents.map((event: any) => (
          <Link
            key={event.slug.current}
            href={`/events/${event.slug.current}`}
            className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-center transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="mt-2 text-lg font-semibold text-neutral-900">
              {event.title}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
