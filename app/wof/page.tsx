import { manualArtistProfiles, normalizeName } from '@/data/fallbacks'
import { sanityClient } from '@/lib/sanity.client'
import { allArtistsQuery } from '@/lib/sanity.queries'
import Link from 'next/link'
import type { CSSProperties } from 'react'

type Artist = {
  _id: string
  name?: string
  slug?: { current?: string }
  role?: string
  image?: { asset?: { url?: string } }
  imageUrl?: string
  socialLinks?: Record<string, string>
  imageFocus?: string
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
    const manualImage =
      manualProfile?.imageUrl ?? manualProfile?.image?.asset?.url ?? null
    const imageSrc = manualProfile
      ? manualImage
      : artist.imageUrl ?? artist.image?.asset?.url ?? null
    const focus = manualProfile?.imageFocus ?? artist.imageFocus ?? '50% 50%'
    const normalizedRole = (artist.role ?? '').toLowerCase()
    return {
      ...artist,
      normalizedName,
      profilePath,
      imageSrc,
      imageFocus: focus,
      isDj: normalizedRole.includes('dj'),
      isHost: normalizedRole.includes('host'),
    }
  })

  const eligibleEntries = normalized.filter(
    (item) => !excludedTeamMembers.has(item.normalizedName)
  )
  const artistEntries = eligibleEntries.filter(
    (item) => !item.isDj && !item.isHost
  )
  const djEntries = eligibleEntries.filter((item) => item.isDj)
  const hostEntries = eligibleEntries.filter((item) => item.isHost)
  const minimumArtistCards = Math.max(3, artistEntries.length)
  const minimumDjCards = Math.max(3, djEntries.length)
  const artistPlaceholders = Math.max(0, minimumArtistCards - artistEntries.length)
  const djPlaceholders = Math.max(0, minimumDjCards - djEntries.length)

  const sortByName = <T extends { normalizedName?: string }>(items: T[]) =>
    [...items].sort((a, b) =>
      (a.normalizedName ?? '').localeCompare(b.normalizedName ?? '', undefined, {
        sensitivity: 'base',
      })
    )

  const sortedArtistEntries = sortByName(artistEntries)
  const sortedDjEntries = sortByName(djEntries)
  const sortedHostEntries = sortByName(hostEntries)

  const renderPortrait = (artist: typeof normalized[number]) => {
    const imageStyle: CSSProperties = {
      objectPosition: artist.imageFocus ?? '50% 50%',
    }

    const portrait = artist.imageSrc ? (
      <img
        src={artist.imageSrc}
        alt={artist.name ?? 'Artist portrait'}
        className="mb-4 h-48 w-full rounded-lg object-cover object-center"
        style={imageStyle}
      />
    ) : (
      <div className="mb-4 flex h-48 w-full flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-white/70 text-center text-xs uppercase tracking-[0.3em] text-neutral-500">
        <span>Portrait pending</span>
        <p className="mt-1 text-[11px] text-neutral-400">Drop in the guest image soon.</p>
      </div>
    )
    return artist.profilePath ? (
      <Link href={`${artist.profilePath}?from=wof`} className="block">
        {portrait}
      </Link>
    ) : (
      portrait
    )
  }

  const renderCardFooter = (artist: typeof normalized[number]) => {
    const label = artist.role
      ? artist.role
      : artist.isHost
        ? 'Host'
        : artist.isDj
          ? 'DJ'
          : 'Artist'
    return (
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          {label}
        </span>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 text-4xl font-bold">WOF</h1>

      <section id="artists-section" className="mb-12 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-neutral-900">Artists</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {sortedArtistEntries.map((artist) => (
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
          {sortedDjEntries.map((artist) => (
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

      <section id="hosts-section" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-neutral-900">Hosts</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {sortedHostEntries.map((host) => (
            <article key={`wof-host-${host._id}`} className="rounded-xl border p-6 shadow-sm">
              {renderPortrait(host)}
              {host.profilePath ? (
                <h3 className="text-2xl font-semibold">
                  <Link href={host.profilePath} className="hover:underline">
                    {host.name}
                  </Link>
                </h3>
              ) : (
                <h3 className="text-2xl font-semibold">{host.name}</h3>
              )}
              {renderCardFooter(host)}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
