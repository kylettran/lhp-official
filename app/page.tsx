import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'
import LogoCarousel from '@/components/logo-carousel'
import HighlightsMarquee, { HighlightItem } from '@/components/highlights-marquee'
import { pastEventFallbackList } from '@/data/fallbacks'

const upcomingEventQuery = groq`
  *[_type == "event" && status == "upcoming" && slug.current != "lion-heart-kickoff-night"]
  | order(date asc)[0]{
    title,
    slug,
    date,
    location,
    description,
    posterImage{ asset->{url} }
  }
`

export default async function HomePage() {
  const sanityUpcomingEvent = await sanityClient.fetch(upcomingEventQuery)
  const fallbackUpcoming = pastEventFallbackList.find((e) => e.status === 'upcoming')
  const upcomingEvent = sanityUpcomingEvent ?? (fallbackUpcoming
    ? {
        title: fallbackUpcoming.title,
        slug: { current: fallbackUpcoming.slug },
        date: fallbackUpcoming.date,
        location: fallbackUpcoming.location,
        description: fallbackUpcoming.description,
        posterImage: fallbackUpcoming.posterImage ?? null,
      }
    : null)
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

        {upcomingEvent && (
          <section className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/80 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-950/40 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 grid sm:grid-cols-[1fr_auto] gap-0">
              <div className="flex flex-col justify-center gap-4 p-8">
                <span className="inline-flex w-fit items-center rounded-full border border-rose-400/50 bg-rose-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">
                  Next Event
                </span>
                <h2 className="text-4xl font-bold text-white">{upcomingEvent.title}</h2>
                <div className="space-y-1">
                  <p className="text-sm text-white/60">
                    {new Date(upcomingEvent.date).toLocaleDateString(undefined, {
                      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-white/60">{upcomingEvent.location}</p>
                </div>
                {upcomingEvent.description && (
                  <p className="max-w-md text-sm text-white/70">{upcomingEvent.description}</p>
                )}
                <Link
                  href={`/events/${upcomingEvent.slug?.current ?? upcomingEvent.slug}`}
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-rose-400"
                >
                  View Event
                </Link>
              </div>
              {upcomingEvent.posterImage?.asset?.url && (
                <div className="hidden sm:block w-64 shrink-0 overflow-hidden">
                  <img
                    src={upcomingEvent.posterImage.asset.url}
                    alt={upcomingEvent.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        </div>
    </main>
  )
}
