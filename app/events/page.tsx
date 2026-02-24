import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'

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
