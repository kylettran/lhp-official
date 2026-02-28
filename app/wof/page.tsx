import { manualArtistProfiles, normalizeName } from '@/data/fallbacks'
import { sanityClient } from '@/lib/sanity.client'
import { allArtistsQuery } from '@/lib/sanity.queries'
import Link from 'next/link'

type Artist = {
  _id: string
  name?: string
  slug?: { current?: string }
  role?: string
  image?: { asset?: { url?: string } }
  imageUrl?: string
  socialLinks?: Record<string, string>
}

export default async function WofPage() {
  const artists = (await sanityClient.fetch(allArtistsQuery)) as Artist[]
  const manualProfiles = manualArtistProfiles.filter((profile) => profile.showOnWof)
  const manualProfileById = new Map(manualProfiles.map((profile) => [profile._id, profile]))

  const combinedEntries = [...artists, ...manualProfiles]
  const excludedTeamMembers = new Set(['ayeare', 'katherinedeleon', 'ap'])
  const normalized = combinedEntries.map((artist) => {
    const normalizedName = normalizeName(artist.name)
    const manualProfile = manualProfileById.get(artist._id)
    const profilePath = artist.slug?.current ? `/artists/${artist.slug.current}` : null
    const imageSrc = manualProfile
      ? null
      : artist.imageUrl ?? artist.image?.asset?.url ?? null
    return {
      ...artist,
      normalizedName,
      profilePath,
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

  const renderPortrait = (artist: typeof normalized[number]) => {
    const portrait = artist.imageSrc ? (
      <img
        src={artist.imageSrc}
        alt={artist.name ?? 'Artist portrait'}
        className="mb-4 h-48 w-full rounded-lg object-cover object-center"
      />
    ) : (
      <div className="mb-4 flex h-48 w-full flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white/70 text-center text-xs uppercase tracking-[0.3em] text-neutral-500">
        <span>Portrait pending</span>
        <p className="mt-1 text-[11px] text-neutral-400">Drop in the guest image soon.</p>
      </div>
    )
    return artist.profilePath ? (
      <Link href={artist.profilePath} className="block">
        {portrait}
      </Link>
    ) : (
      portrait
    )
  }

  const renderCardFooter = (artist: typeof normalized[number]) => (
    <div className="mt-3 flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
        {artist.isDj ? 'DJ' : 'Artist'}
      </span>
    </div>
  )

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
              {renderPortrait(artist)}
              {artist.profilePath ? (
                <h3 className="text-2xl font-semibold">
                  <Link href={artist.profilePath} className="hover:underline">
                    {artist.name}
                  </Link>
                </h3>
              ) : (
                <h3 className="text-2xl font-semibold">{artist.name}</h3>
              )}
              {renderCardFooter(artist)}
            </article>
          ))}
          {Array.from({ length: artistPlaceholders }).map((_, index) => (
            <article
              key={`wof-artist-placeholder-${index}`}
              className="rounded-xl border border-dashed bg-neutral-50 p-6"
            >
              <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg border border-dashed bg-white text-sm text-neutral-400">
                Guest Slot
              </div>
              <h3 className="text-2xl font-semibold text-neutral-700">Special Guest</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-neutral-500">Artist coming soon</p>
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
              {renderPortrait(artist)}
              {artist.profilePath ? (
                <h3 className="text-2xl font-semibold">
                  <Link href={artist.profilePath} className="hover:underline">
                    {artist.name}
                  </Link>
                </h3>
              ) : (
                <h3 className="text-2xl font-semibold">{artist.name}</h3>
              )}
              {renderCardFooter(artist)}
            </article>
          ))}
          {Array.from({ length: djPlaceholders }).map((_, index) => (
            <article
              key={`wof-dj-placeholder-${index}`}
              className="rounded-xl border border-dashed bg-neutral-50 p-6"
            >
              <div className="mb-4 flex h-48 w-full items-center justify-center rounded-lg border border-dashed bg-white text-sm text-neutral-400">
                Partner Slot
              </div>
              <h3 className="text-2xl font-semibold text-neutral-700">Featured DJ</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-neutral-500">Lineup coming soon</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
