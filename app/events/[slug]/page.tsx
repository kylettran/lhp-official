import { notFound } from 'next/navigation'
import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import { Playfair_Display, Space_Grotesk } from 'next/font/google'
import EventTimelineToggle from '@/components/event-timeline-toggle'
import EventGallery from '@/components/event-gallery'
import HeroVideo from '@/components/hero-video'
import PosterViewer from '@/components/poster-viewer'
import VideoHighlightCard from '@/components/video-highlight-card'
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
    posterVideo{
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

  if (slug === 'lion-heart-past-event' || slug === 'lion-heart-kickoff-night') {
    notFound()
  }

  const event = await sanityClient.fetch(eventBySlugQuery, {
    slug,
  })

  const allEvents = await sanityClient.fetch(allEventsQuery)

  const fallbackEvent = pastEventFallbacks[slug]
  let eventData =
    event ??
    fallbackEvent

  if (
    slug === '2k25-rager' &&
    typeof eventData?.description === 'string'
  ) {
    eventData = {
      ...eventData,
      description: eventData.description.replace('Just Ken', 'KYLO'),
    }
  }

  if (!eventData) {
    return <div>Event not found</div>
  }

  const excludedSlugs = new Set(['lion-heart-past-event', 'lion-heart-kickoff-night'])
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
  const recapLink = eventData.instagramRecapUrl ?? eventData.instagramUrl
  const viewLink = eventData.instagramViewUrl ?? eventData.instagramUrl
  const venueLink = eventData.venueLink
  const baseAttendeeCount =
    typeof eventData.attendeesCount === 'number'
      ? eventData.attendeesCount
      : hasAttendees
      ? eventData.attendees.length
      : '—'
  const attendeeCount = slug === '2k25-rager' ? 60 : baseAttendeeCount
  const lineupByRole = eventData.lineupByRole
  const showLineupSections =
    slug === '2k25-rager' &&
    lineupByRole &&
    Object.keys(lineupByRole).some(
      (key) => Array.isArray(lineupByRole[key]) && lineupByRole[key].length > 0
    )

  return (
    <main
      className={`${spaceGrotesk.className} relative bg-black text-white`}
      style={{
        backgroundImage: "url('/assets/images/liquid chrome background.avif')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 55%),' +
            'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.04), transparent 60%),' +
            'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.6) 70%),' +
            'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.6) 50%, rgba(255,255,255,0.01) 100%)',
          backgroundSize: '250% 250%, 250% 250%, 100% 200%, 100% 100%',
          filter: 'blur(1px)',
          opacity: 0.5,
        }}
      />
      <div className="relative z-10 overflow-hidden bg-black/80 backdrop-blur-sm">
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              {eventData.status === 'past' && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/80">
                  Past Event
                </span>
              )}
              <div>
                <h1
                  className={`${playfair.className} text-4xl font-semibold tracking-tight text-white sm:text-5xl`}
                >
                  {eventData.title}
                </h1>
                <p className="mt-3 text-sm text-white/70">
                  {eventDate.toLocaleDateString()} · {eventData.location}
                </p>
              </div>
              {showLineupSections ? (
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  {(['hosts', 'artists', 'djs'] as Array<
                    keyof typeof lineupByRole
                  >).map((role) => {
                    const label =
                      role === 'hosts'
                        ? 'Hosts'
                        : role === 'artists'
                        ? 'Artists'
                        : 'DJs'
                    const names = Array.isArray(lineupByRole[role])
                      ? lineupByRole[role]
                      : []
                    if (!names.length) {
                      return null
                    }
                    return (
                      <div key={String(role)} className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                          {label}
                        </p>
                        <ul className="text-base font-semibold text-white">
                          {names.map((name) => (
                            <li key={name}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="max-w-xl text-base text-white/70">
                  {eventData.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {recapLink && (
                  <a
                    href={recapLink}
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
                    className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
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
                {venueLink ? (
                <a
                  href={venueLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block cursor-grab active:cursor-grabbing rounded-2xl border border-white/40 bg-white/10 p-4 transition hover:border-white/60"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                      Venue
                    </p>
                    <p className="mt-2 text-sm text-white">
                      {eventData.location}
                    </p>
                  </a>
                ) : (
                  <div className="rounded-2xl border border-white/40 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                      Venue
                    </p>
                    <p className="mt-2 text-sm text-white">{eventData.location}</p>
                  </div>
                )}
                <div className="rounded-2xl border border-white/40 bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                    Date
                  </p>
                  <p className="mt-2 text-sm text-white">
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
              {eventData.posterVideo?.asset?.url ? (
                <div className="mx-auto w-full max-w-[560px]">
                  <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-black shadow-[0_20px_60px_-30px_rgba(120,45,45,0.35)] aspect-[4/5]">
                    <HeroVideo
                      src={eventData.posterVideo.asset.url}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : eventData.posterImage?.asset?.url ? (
                <PosterViewer
                  imageUrl={eventData.posterImage.asset.url}
                  title={eventData.title}
                />
              ) : (
                <div className="flex h-full min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-rose-300 bg-[#fff5f7] p-10 text-center text-sm text-neutral-500">
                  Add the event poster image in Sanity to spotlight the vibe.
                </div>
              )}
            {viewLink && (
              <a
                href={viewLink}
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-black/60 to-black"
      />
    </div>

      <section className="relative overflow-hidden max-w-6xl mx-auto px-6 py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-transparent"
        />
        <div className="relative z-10 flex items-end justify-between">
          <h2 className={`${playfair.className} text-3xl font-semibold text-white`}>
            Photo Gallery
          </h2>
          <p className="text-sm text-white/70">Highlights from the night</p>
        </div>
        <div className="mt-8">
          {hasGallery ? (
            <EventGallery images={eventData.gallery} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`placeholder-${index}`}
                    className="flex h-64 items-center justify-center rounded-2xl border border-white/30 bg-neutral-900/50 text-sm text-white/50"
                  >
                  Upload photo highlight
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-transparent"
        />
        <div className="relative z-10 flex justify-center px-4">
          <div className="w-full max-w-6xl rounded-[36px] border border-white/5 bg-neutral-950/90 px-6 py-16 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
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
                    <VideoHighlightCard
                      key={`${video?.url ?? 'video'}-${index}`}
                      highlight={video}
                    />
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
        </div>
      </section>

      <section className="relative overflow-hidden max-w-6xl mx-auto px-6 py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-transparent"
        />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black/40 bg-neutral-900/60 p-8">
            <h2
              className={`${playfair.className} text-3xl font-semibold text-white`}
            >
              Message From Our Team
            </h2>
            <p className="mt-4 text-white/70">
              {eventData.teamMessage ||
                'Drop a thank-you note or recap here. Highlight the artists, the energy, and what the night meant for the community.'}
            </p>
          </div>
          <div className="rounded-3xl border border-black/40 bg-neutral-900/70 p-8">
            <h3 className="text-sm uppercase tracking-[0.2em] text-white/70">
              Attendees
            </h3>
            <p className="mt-2 text-3xl font-semibold text-white">
              {attendeeCount}
            </p>
            <p className="mt-2 text-sm text-white/70">
              Community members who showed love.
            </p>
            {hasAttendees && (
              <div className="mt-6 flex flex-wrap gap-2">
                {eventData.attendees.map((name: string, index: number) => (
                  <span
                    key={`${name}-${index}`}
                    className="rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-wide text-white/70"
                    >
                    {name}
                  </span>
                ))}
              </div>
            )}
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
