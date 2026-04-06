import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'
import Image from 'next/image'
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
      fallback.status !== 'upcoming' &&
      !pastEvents.some((event: any) => event.slug?.current === fallback.slug)
  )
  const upcomingFallbacks = pastEventFallbackList.filter(
    (fallback) => fallback.status === 'upcoming' && !excludedSlugs.has(fallback.slug)
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
      {upcomingFallbacks.length > 0 && (
        <section className="mb-16">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-neutral-500">Upcoming</p>
          <div className="flex flex-col gap-6">
            {upcomingFallbacks.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="grid sm:grid-cols-[auto_1fr] gap-0">
                  {event.posterImage?.asset?.url && (
                    <div className="relative h-52 sm:h-auto sm:w-52 sm:min-h-[208px] shrink-0 overflow-hidden">
                      <Image
                        src={event.posterImage.asset.url}
                        alt={event.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 208px"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center gap-3 p-6">
                    <span className="inline-flex w-fit items-center rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
                      Coming Up
                    </span>
                    <h2 className="text-2xl font-bold text-neutral-900">{event.title}</h2>
                    <p className="text-sm text-neutral-500">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-neutral-500">{event.location}</p>
                    {event.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2">{event.description}</p>
                    )}
                    <span className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 underline-offset-4 group-hover:underline">
                      View Event →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Lion Heart Productions
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-neutral-900">
          All Events
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-500">
          Upcoming nights, past recaps, and everything in between. Every event has a story.
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
