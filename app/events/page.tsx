import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'
import {
  curatedImpactEventStats,
  pastEventFallbackList,
  pastEventFallbacks,
} from '@/data/fallbacks'
import ImpactDonutChart, { ImpactSegment } from '@/components/impact-donut-chart'

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
  const excludedSlugs = new Set(['lion-heart-past-event'])
  const pastEvents = await sanityClient.fetch(pastEventsQuery)
  const fallbackEventsToAdd = pastEventFallbackList.filter(
    (fallback) =>
      !excludedSlugs.has(fallback.slug) &&
      !pastEvents.some((event: any) => event.slug?.current === fallback.slug)
  )
  const combinedPastEvents = [
    ...pastEvents,
    ...fallbackEventsToAdd.map((event) => ({
      ...event,
      slug: { current: event.slug },
    })),
  ]
    .filter((event) => !excludedSlugs.has(event.slug?.current))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const impactEvents = curatedImpactEventStats.map((impact) => {
    const fallback = pastEventFallbacks[impact.slug]
    return {
      name: fallback?.title ?? impact.slug,
      attendees: impact.attendees,
      href: `/events/${impact.slug}`,
    }
  })
  const totalAttendees = impactEvents.reduce(
    (sum, event) => sum + event.attendees,
    0
  )
  const colors = ['#3f92f6', '#fb7185', '#c084fc', '#38bdf8']
  const impactSegments: ImpactSegment[] = impactEvents.map((event, index) => ({
    ...event,
    color: colors[index % colors.length],
    percent: totalAttendees ? (event.attendees / totalAttendees) * 100 : 0,
  }))
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

        <ImpactDonutChart segments={impactSegments} total={totalAttendees} />
      </section>

      <div className="mt-12 flex flex-col items-center gap-4">
        {combinedPastEvents.map((event: any) => (
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
