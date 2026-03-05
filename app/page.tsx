import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'

const upcomingEventQuery = groq`
  *[_type == "event" && status == "upcoming" && slug.current != "lion-heart-kickoff-night"]
  | order(date asc)[0]{
    title,
    slug,
    date,
    location,
    description
  }
`

export default async function HomePage() {
  const upcomingEvent = await sanityClient.fetch(upcomingEventQuery)
  const highlightItems = [
    { type: 'video', label: 'MP4 Highlight' },
    { type: 'image', label: 'Photo Highlight' },
    { type: 'video', label: 'Stage Cut' },
    { type: 'image', label: 'Crowd Shot' },
    { type: 'video', label: 'DJ Moment' },
    { type: 'image', label: 'Backstage' },
  ]

  return (
    <main
      className="min-h-screen bg-black bg-cover bg-center py-16 px-4"
      style={{
        backgroundImage: "url('/assets/images/liquid chrome background.avif')",
      }}
    >
      <div className="mx-auto max-w-5xl space-y-20">
        <section className="home-video">
        <video
          className="home-video__player"
          src="/assets/videos/48-seconds.mov"
          title="LHP Highlight Video"
          autoPlay
          loop
          muted
          playsInline
          controls
          preload="metadata"
        />
        </section>

        <section className="relative space-y-6 rounded-3xl border border-white/20 bg-black/70 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Recaps & Memories
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Highlights Carousel
              </h2>
            </div>
            <p className="max-w-xl text-sm text-white/70">
              A rolling glimpse of past nights, packed with images and video
              moments to keep the energy alive.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/80 py-8">
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
          </div>
        </section>

        <section className="rounded-3xl border border-white/20 bg-black/80 p-8 text-white">
        {upcomingEvent ? (
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Upcoming Event
            </p>
            <h2 className="text-4xl font-bold text-white">
              {upcomingEvent.title}
            </h2>
            <p className="text-base text-white/70">
              {new Date(upcomingEvent.date).toLocaleDateString()} ·{' '}
              {upcomingEvent.location}
            </p>
            <Link
              href={`/events/${upcomingEvent.slug.current}`}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white"
            >
              Buy Tickets
            </Link>
          </div>
        ) : (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50">
            <img
              src="/assets/images/lhp-logo.jpeg"
              alt="Lion Heart Productions"
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        )}
      </section>
      </div>
    </main>
  )
}
