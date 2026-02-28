import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import { Playfair_Display, Space_Grotesk } from 'next/font/google'
import EventTimelineToggle from '@/components/event-timeline-toggle'
import {
  pastEventFallbackList,
  pastEventFallbacks,
} from '@/data/fallbacks'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})

const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0]{
    title,
    date,
    status,
    location,
    description,
    stripeProductId,
    ticketUrl,
    instagramUrl,
    teamMessage,
    posterImage{
      asset->{url}
    },
    gallery[]{
      asset->{url}
    },
    videoHighlights[]{
      title,
      url
    },
    attendees
  }
`

const allEventsQuery = groq`
  *[_type == "event"]{
    title,
    slug,
    date
  }
`

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (slug === 'lion-heart-past-event') {
    notFound()
  }

  const event = await sanityClient.fetch(eventBySlugQuery, {
    slug,
  })

  const allEvents = await sanityClient.fetch(allEventsQuery)

  const fallbackEvent = pastEventFallbacks[slug]
  const eventData =
    event ??
    fallbackEvent

  if (!eventData) {
    return <div>Event not found</div>
  }

  const excludedSlugs = new Set(['lion-heart-past-event'])
  const timelineEvents = Array.isArray(allEvents)
    ? allEvents.filter((item: any) => !excludedSlugs.has(item.slug?.current))
    : []
  const timelineSlugs = new Set<string>()
  timelineEvents.forEach((item: any) => {
    if (item.slug?.current) {
      timelineSlugs.add(item.slug.current)
    }
  })
  pastEventFallbackList.forEach((fallback) => {
    if (!excludedSlugs.has(fallback.slug) && !timelineSlugs.has(fallback.slug)) {
      timelineEvents.push({
        title: fallback.title,
        slug: { current: fallback.slug },
        date: fallback.date,
      })
      timelineSlugs.add(fallback.slug)
    }
  })

  const eventDateValue = new Date(eventData.date).getTime()
  const earlierEvents = timelineEvents
    .filter(
      (item: any) =>
        item.slug?.current !== slug &&
        new Date(item.date).getTime() < eventDateValue
    )
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 4)

  const laterEvents = timelineEvents
    .filter(
      (item: any) =>
        item.slug?.current !== slug &&
        new Date(item.date).getTime() > eventDateValue
    )
    .sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    .slice(0, 4)

  const eventDate = new Date(eventData.date)
  const hasGallery =
    Array.isArray(eventData.gallery) && eventData.gallery.length > 0
  const hasVideos =
    Array.isArray(eventData.videoHighlights) &&
    eventData.videoHighlights.length > 0
  const hasAttendees =
    Array.isArray(eventData.attendees) && eventData.attendees.length > 0

  return (
    <main className={`${spaceGrotesk.className} bg-[#fffdfd]`}>
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fdeef1_0%,#fff8f2_100%)]">
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              {eventData.status === 'past' && (
                <span className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white/90 px-4 py-1 text-xs uppercase tracking-[0.3em] text-rose-600">
                  Past Event
                </span>
              )}
              <div>
                <h1 className={`${playfair.className} text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl`}>
                  {eventData.title}
                </h1>
                <p className="mt-3 text-sm text-neutral-500">
                  {eventDate.toLocaleDateString()} · {eventData.location}
                </p>
              </div>
              <p className="max-w-xl text-base text-neutral-700">
                {eventData.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {eventData.instagramUrl && (
                  <a
                    href={eventData.instagramUrl}
                    className="inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-rose-400"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Instagram Recap
                  </a>
                )}
                {eventData.ticketUrl && (
                  <a
                    href={eventData.ticketUrl}
                    className="inline-flex items-center justify-center rounded-full border border-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Tickets
                  </a>
                )}
                {!eventData.ticketUrl && eventData.stripeProductId && (
                  <button className="rounded-full bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                    Tickets
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-rose-200 bg-white/90 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-500">
                    Venue
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">{eventData.location}</p>
                </div>
                <div className="rounded-2xl border border-rose-200 bg-white/90 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-500">
                    Date
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">
                    {eventDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              {eventData.posterImage?.asset?.url ? (
                <div className="overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-[0_20px_60px_-30px_rgba(120,45,45,0.35)]">
                  <img
                    src={eventData.posterImage.asset.url}
                    alt={`${eventData.title} poster`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-full min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-rose-300 bg-[#fff5f7] p-10 text-center text-sm text-neutral-500">
                  Add the event poster image in Sanity to spotlight the vibe.
                </div>
              )}
              {eventData.instagramUrl && (
                <a
                  href={eventData.instagramUrl}
                  className="absolute -bottom-6 left-8 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg"
                  rel="noreferrer"
                  target="_blank"
                >
                  View on Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between">
          <h2 className={`${playfair.className} text-3xl font-semibold text-neutral-900`}>
            Photo Gallery
          </h2>
          <p className="text-sm text-neutral-500">Highlights from the night</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasGallery ? (
            eventData.gallery.map((image: any, index: number) => (
              <div
                key={`${image?.asset?.url ?? 'photo'}-${index}`}
                className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-white"
              >
                {image?.asset?.url ? (
                  <img
                    src={image.asset.url}
                    alt={`${eventData.title} gallery ${index + 1}`}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
                    Add photo
                  </div>
                )}
              </div>
            ))
          ) : (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-[#fff5f7] text-sm text-neutral-400"
              >
                Upload photo highlight
              </div>
            ))
          )}
        </div>
      </section>

      <section className="bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <h2 className={`${playfair.className} text-3xl font-semibold`}>
                Video Highlights
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Short clips and recaps from the energy on the floor.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {hasVideos ? (
                eventData.videoHighlights.map((video: any, index: number) => (
                  <a
                    key={`${video?.url ?? 'video'}-${index}`}
                    href={video?.url ?? '#'}
                    className="group rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-white/40 hover:bg-white/10"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-rose-200">
                      Highlight {index + 1}
                    </p>
                    <p className="mt-3 text-lg font-semibold">
                      {video?.title ?? 'Add video title'}
                    </p>
                    <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/60">
                      Watch clip
                    </p>
                  </a>
                ))
              ) : (
                Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={`video-placeholder-${index}`}
                    className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/60"
                  >
                    Add video highlight link in Sanity.
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-rose-200 bg-[#fff5f7] p-8">
            <h2 className={`${playfair.className} text-3xl font-semibold text-neutral-900`}>
              Message From Our Team
            </h2>
            <p className="mt-4 text-neutral-700">
              {eventData.teamMessage ||
                'Drop a thank-you note or recap here. Highlight the artists, the energy, and what the night meant for the community.'}
            </p>
          </div>
          <div className="rounded-3xl border border-rose-100 bg-white p-8">
            <h3 className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Attendees
            </h3>
            <p className="mt-2 text-3xl font-semibold text-neutral-900">
              {hasAttendees ? eventData.attendees.length : '—'}
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Community members who showed love.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {hasAttendees ? (
                eventData.attendees.map((name: string, index: number) => (
                  <span
                    key={`${name}-${index}`}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs uppercase tracking-wide text-neutral-600"
                  >
                    {name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-neutral-400">
                  Add attendee names for social proof.
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <EventTimelineToggle
        earlierEvents={earlierEvents}
        laterEvents={laterEvents}
      />
    </main>
  )
}
