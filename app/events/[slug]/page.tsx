import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'

const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0]{
    title,
    date,
    location,
    description,
    stripeProductId
  }
`

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const event = await sanityClient.fetch(eventBySlugQuery, {
    slug,
  })

  if (!event) {
    return <div>Event not found</div>
  }

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

      <p className="text-lg text-gray-600 mb-2">
        {new Date(event.date).toLocaleDateString()} · {event.location}
      </p>

      <p className="mb-6">{event.description}</p>

      {event.stripeProductId && (
        <button className="bg-black text-white px-6 py-3 rounded">
          Buy Tickets
        </button>
      )}
    </main>
  )
}