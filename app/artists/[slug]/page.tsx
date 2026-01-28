import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'

const artistBySlugQuery = groq`
  *[_type == "artist" && slug.current == $slug][0]{
    title,
    role,
    bio,
    image,
    socialLinks
  }
`

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const artist = await sanityClient.fetch(artistBySlugQuery, { slug })

  if (!artist) {
    return <div>Artist not found</div>
  }

  return (
    <main className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>

      {artist.role && (
        <p className="text-lg text-gray-600 mb-6">{artist.role}</p>
      )}

      {artist.bio && <p className="mb-6">{artist.bio}</p>}

      {artist.socialLinks && (
        <div className="flex gap-4">
          {artist.socialLinks.map((link: any) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </main>
  )
}