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
    location
  }
`

export default async function HomePage() {
  const upcomingEvent = await sanityClient.fetch(upcomingEventQuery)
  const pastEvents = await sanityClient.fetch(pastEventsQuery)

  return (
    <main className="max-w-5xl mx-auto py-16 px-4 space-y-20">
      
      {/* HERO / CURRENT EVENT */}
      {upcomingEvent && (
        <section>
          <h1 className="text-4xl font-bold mb-4">
            {upcomingEvent.title}
          </h1>

          <p className="text-lg text-gray-600 mb-2">
            {new Date(upcomingEvent.date).toLocaleDateString()} · {upcomingEvent.location}
          </p>

          <p className="max-w-2xl mb-6">
            {upcomingEvent.description}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <Link
              href={`/events/${upcomingEvent.slug.current}`}
              className="inline-block bg-black text-white px-6 py-3 rounded"
            >
              Buy Tickets
            </Link>

            <Link
              href="/artists"
              className="inline-block border border-black px-6 py-3 rounded hover:bg-black hover:text-white transition"
            >
              View Artists
            </Link>
          </div>
        </section>
      )}

      {/* PAST EVENTS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Past Events</h2>

        <ul className="space-y-3">
          {pastEvents.map((event: any) => (
            <li key={event.slug.current}>
              <Link
                href={`/events/${event.slug.current}`}
                className="underline"
              >
                {event.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </main>
  )
}