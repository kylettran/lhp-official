import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'

const artistBySlugQuery = groq`
  *[_type == "artist" && slug.current == $slug][0]{
    name,
    role,
    bio,
    "imageUrl": coalesce(photo, image).asset->url,
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

  const normalizedName = (artist.name ?? '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .trim()
  const isAyeAre = normalizedName === 'ayeare'
  const isKat = normalizedName === 'katherinedeleon'
  const isAp = normalizedName === 'ap'
  const profileImageSrc = artist.imageUrl
    ? artist.imageUrl
    : isAyeAre
      ? '/assets/images/ar-portrait.png'
      : isKat
        ? '/assets/images/kat-pfp.png'
        : isAp
          ? '/assets/images/ap-portrait.png'
          : null

  const socialEntries = artist.socialLinks
    ? Object.entries(artist.socialLinks).filter(([, url]) => Boolean(url))
    : []

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Link
          href="/artists"
          className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 hover:bg-neutral-100"
        >
          Back to Team
        </Link>
        <Link
          href="/wof"
          className="inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 hover:bg-neutral-100"
        >
          Back to WOF
        </Link>
      </div>

      {profileImageSrc && (
        <div className="mb-6 flex justify-center">
          <img
            src={profileImageSrc}
            alt={artist.name}
            className="h-96 w-full max-w-3xl rounded-2xl object-cover object-center"
          />
        </div>
      )}

      <h1 className="mb-2 text-4xl font-bold">{artist.name}</h1>

      {artist.role && (
        <p className="mb-6 text-lg text-gray-600">{artist.role}</p>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900">About</h2>
        <p className="text-neutral-700">
          {artist.bio || 'Bio coming soon.'}
        </p>
      </section>

      {socialEntries.length > 0 && (
        <div className="flex gap-4">
          {socialEntries.map(([platform, url]) => (
            <a
              key={`${platform}-${url as string}`}
              href={url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {platform}
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
