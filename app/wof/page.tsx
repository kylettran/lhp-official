import { sanityClient } from '@/lib/sanity.client'
import { allArtistsQuery } from '@/lib/sanity.queries'
import Link from 'next/link'

type Artist = {
  _id: string
  name?: string
  slug?: { current?: string }
  role?: string
  image?: { asset?: { url?: string } }
}

export default async function WofPage() {
  const artists = (await sanityClient.fetch(allArtistsQuery)) as Artist[]
  const excludedTeamMembers = new Set(['ayeare', 'katherinedeleon', 'ap'])

  const normalized = artists.map((artist) => {
    const normalizedName = (artist.name ?? '')
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .trim()
    const isAyeAre = normalizedName === 'ayeare'
    const isKat = normalizedName === 'katherinedeleon'
    const isAp = normalizedName === 'ap'
    const imageSrc = isAyeAre
      ? '/assets/images/ar-portrait.png'
      : isKat
        ? '/assets/images/kat-pfp.png'
        : isAp
          ? '/assets/images/ap-portrait.png'
          : artist.image?.asset?.url || null

    return {
      ...artist,
      normalizedName,
      profilePath: artist.slug?.current ? `/artists/${artist.slug.current}` : null,
      imageSrc,
      isDj: (artist.role ?? '').toLowerCase().includes('dj'),
    }
  })

  const eligibleEntries = normalized.filter(
    (item) => !excludedTeamMembers.has(item.normalizedName)
  )
  const artistEntries = eligibleEntries.filter((item) => !item.isDj)
  const djEntries = eligibleEntries.filter((item) => item.isDj)
  const minimumArtistCards = Math.max(3, artistEntries.length)
  const minimumDjCards = Math.max(3, djEntries.length)
  const artistPlaceholders = Math.max(0, minimumArtistCards - artistEntries.length)
  const djPlaceholders = Math.max(0, minimumDjCards - djEntries.length)

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 text-4xl font-bold">WOF</h1>

      <section id="artists-section" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-neutral-900">Artists</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {artistEntries.map((artist) => (
            <article
              key={`wof-artist-${artist._id}`}
              className="rounded-xl border p-6 shadow-sm"
            >
              {artist.profilePath && artist.imageSrc ? (
                <Link href={artist.profilePath} className="block">
                  <img
                    src={artist.imageSrc}
                    alt={artist.name ?? 'Artist'}
                    className="mb-4 h-48 w-full rounded-lg object-cover object-center"
                  />
                </Link>
              ) : artist.imageSrc ? (
                <img
                  src={artist.imageSrc}
                  alt={artist.name ?? 'Artist'}
                  className="mb-4 h-48 w-full rounded-lg object-cover object-center"
                />
              ) : (
                <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                  No Image
                </div>
              )}
              {artist.profilePath ? (
                <h3 className="text-2xl font-semibold">
                  <Link href={artist.profilePath} className="hover:underline">
                    {artist.name}
                  </Link>
                </h3>
              ) : (
                <h3 className="text-2xl font-semibold">{artist.name}</h3>
              )}
              {artist.role && <p className="mt-1 text-sm text-gray-500">{artist.role}</p>}
            </article>
          ))}
          {Array.from({ length: artistPlaceholders }).map((_, index) => (
            <article
              key={`wof-artist-placeholder-${index}`}
              className="rounded-xl border border-dashed bg-neutral-50 p-6"
            >
              <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg border border-dashed bg-white text-gray-400">
                Guest Slot
              </div>
              <h3 className="text-2xl font-semibold text-neutral-700">Special Guest</h3>
              <p className="mt-1 text-sm text-gray-500">Coming soon</p>
            </article>
          ))}
        </div>
      </section>

      <section id="djs-section" className="scroll-mt-24">
        <h2 className="text-2xl font-semibold text-neutral-900">DJs</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {djEntries.map((artist) => (
            <article
              key={`wof-dj-${artist._id}`}
              className="rounded-xl border p-6 shadow-sm"
            >
              {artist.profilePath && artist.imageSrc ? (
                <Link href={artist.profilePath} className="block">
                  <img
                    src={artist.imageSrc}
                    alt={artist.name ?? 'DJ'}
                    className="mb-4 h-48 w-full rounded-lg object-cover object-center"
                  />
                </Link>
              ) : artist.imageSrc ? (
                <img
                  src={artist.imageSrc}
                  alt={artist.name ?? 'DJ'}
                  className="mb-4 h-48 w-full rounded-lg object-cover object-center"
                />
              ) : (
                <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                  No Image
                </div>
              )}
              {artist.profilePath ? (
                <h3 className="text-2xl font-semibold">
                  <Link href={artist.profilePath} className="hover:underline">
                    {artist.name}
                  </Link>
                </h3>
              ) : (
                <h3 className="text-2xl font-semibold">{artist.name}</h3>
              )}
              {artist.role && <p className="mt-1 text-sm text-gray-500">{artist.role}</p>}
            </article>
          ))}
          {Array.from({ length: djPlaceholders }).map((_, index) => (
            <article
              key={`wof-dj-placeholder-${index}`}
              className="rounded-xl border border-dashed bg-neutral-50 p-6"
            >
              <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg border border-dashed bg-white text-gray-400">
                Partner Slot
              </div>
              <h3 className="text-2xl font-semibold text-neutral-700">Featured DJ</h3>
              <p className="mt-1 text-sm text-gray-500">Coming soon</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
