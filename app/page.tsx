import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'
import LogoCarousel from '@/components/logo-carousel'
import HighlightsMarquee, { HighlightItem } from '@/components/highlights-marquee'

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
  const highlightItems: HighlightItem[] = [
    {
      type: 'video',
      label: 'Main Promo',
      src: '/assets/videos/main-promo.mov',
    },
    {
      type: 'image',
      label: 'Angel VIP',
      src: '/assets/images/angel-vip-2.png',
    },
    {
      type: 'image',
      label: 'LAL9 Gallery',
      src: '/assets/images/lal9.png',
    },
    {
      type: 'video',
      label: 'RAGER Final',
      src: '/assets/videos/RAGER_FINAL.mov',
    },
    {
      type: 'video',
      label: 'Main Promo Video',
      src: '/assets/videos/main promo video.mov',
    },
    {
      type: 'image',
      label: 'Stage Cut',
      src: '/assets/images/lal4.png',
    },
    {
      type: 'image',
      label: 'Crowd Shot',
      src: '/assets/images/lal5.png',
    },
    {
      type: 'image',
      label: 'DJ Moment',
      src: '/assets/images/lal7.png',
    },
    {
      type: 'image',
      label: 'Backstage',
      src: '/assets/images/lal2.png',
    },
  ]
  const marqueeItems = [...highlightItems, ...highlightItems]

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

        <LogoCarousel />

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
            <HighlightsMarquee items={highlightItems} />
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
