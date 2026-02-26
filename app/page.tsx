import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'

const upcomingEventQuery = groq`
  *[_type == "event" && status == "upcoming"]
  | order(date asc)[0]{
    title,
    slug,
    date,
    location,
    description
  }
`

const pastEventsQuery = groq`
  *[_type == "event" && status == "past"]
  | order(date desc){
    title,
    slug,
    date,
    location,
    posterImage{
      asset->{url}
    }
  }
`

export default async function HomePage() {
  const upcomingEvent = await sanityClient.fetch(upcomingEventQuery)
  const pastEvents = await sanityClient.fetch(pastEventsQuery)
  const carouselEvents = Array.isArray(pastEvents) ? pastEvents.slice(0, 6) : []
  const highlightItems = [
    { type: 'video', label: 'MP4 Highlight' },
    { type: 'image', label: 'Photo Highlight' },
    { type: 'video', label: 'Stage Cut' },
    { type: 'image', label: 'Crowd Shot' },
    { type: 'video', label: 'DJ Moment' },
    { type: 'image', label: 'Backstage' },
  ]

  return (
    <main className="max-w-5xl mx-auto py-16 px-4 space-y-20">
      <section className="home-video">
        <iframe
          className="home-video__player"
          src="https://www.youtube.com/embed/B5iNbWAaeLA?autoplay=1&mute=1&playsinline=1&rel=0"
          title="LHP Highlight Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Recaps & Memories
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              Highlights Carousel
            </h2>
          </div>
          <p className="max-w-xl text-sm text-neutral-500">
            A rolling glimpse of past nights, packed with images and video
            moments to keep the energy alive.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white py-8">
          <div className="carousel-track-slow flex gap-5 px-6">
            {[...highlightItems, ...highlightItems].map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className={`h-40 w-64 shrink-0 rounded-2xl border ${
                  item.type === 'video'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-rose-200 bg-rose-50 text-rose-500'
                } flex flex-col items-center justify-center text-center`}
              >
                <p className="text-xs uppercase tracking-[0.3em] opacity-70">
                  {item.type === 'video' ? 'MP4' : 'Image'}
                </p>
                <p className="mt-2 text-sm font-semibold">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/30 to-white" />
        </div>
        {upcomingEvent && (
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/events/${upcomingEvent.slug.current}`}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white"
            >
              Get Tickets
            </Link>
            <Link
              href="/artists"
              className="inline-flex items-center justify-center rounded-full border border-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-black hover:text-white"
            >
              View Artists
            </Link>
          </div>
        )}
      </section>

      {/* HERO / CURRENT EVENT */}
      {upcomingEvent && (
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8">
          <div className="pointer-events-none absolute inset-0 opacity-30">
            <div className="carousel-track flex gap-6">
              {[...carouselEvents, ...carouselEvents].map(
                (event: any, index: number) => (
                  <div
                    key={`${event?.slug?.current ?? 'event'}-${index}`}
                    className="h-48 w-72 shrink-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100"
                  >
                    {event?.posterImage?.asset?.url ? (
                      <img
                        src={event.posterImage.asset.url}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-100 to-violet-100 text-xs uppercase tracking-[0.3em] text-neutral-500">
                        Past Event
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/30" />
          <div className="relative">
            <h1 className="text-4xl font-bold mb-4">
              {upcomingEvent.title}
            </h1>

            <p className="text-lg text-gray-600 mb-2">
              {new Date(upcomingEvent.date).toLocaleDateString()} ·{' '}
              {upcomingEvent.location}
            </p>

            <p className="max-w-2xl mb-6">
              {upcomingEvent.description}
            </p>
          </div>
        </section>
      )}

    </main>
  )
}
