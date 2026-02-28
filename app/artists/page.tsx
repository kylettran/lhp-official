import { sanityClient } from '@/lib/sanity.client'
import { allArtistsQuery } from '@/lib/sanity.queries'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { manualArtistProfiles, normalizeName } from '@/data/fallbacks'

const formatDisplayName = (name?: string, normalizedName?: string) => {
  if (normalizedName === 'ap') {
    return 'AP'
  }
  if (normalizedName === 'ayeare') {
    return 'Aye.Are'
  }
  return name || 'Artist'
}

type Artist = {
  _id: string
  name?: string
  slug?: { current?: string }
  role?: string
  image?: { asset?: { url?: string } }
  imageUrl?: string
  imageFocus?: string
}

export default async function ArtistsPage() {
  const artists = await sanityClient.fetch(allArtistsQuery)
  const manualTeamMembers = manualArtistProfiles
    .filter((profile) => profile.showOnTeam)
    .map((profile) => ({
      ...profile,
      role: profile.role,
      slug: profile.slug,
      imageUrl: profile.imageUrl,
      imageFocus: profile.imageFocus,
    }))
  const combinedMembers = [...artists, ...manualTeamMembers]
  const ayeAreOverride = '/assets/images/ar-portrait.png'
  const katOverride = '/assets/images/kat-pfp.png'
  const apOverride = '/assets/images/ap-portrait.png'

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="mb-10 text-4xl font-bold">Members</h1>
      <div id="artists-grid" className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {combinedMembers.map((artist: any) => {
          const normalizedName = normalizeName(artist.name)
          const displayName = formatDisplayName(artist.name, normalizedName)
          const isAyeAre = normalizedName === 'ayeare'
          const isKat = normalizedName === 'katherinedeleon'
          const isAp = normalizedName === 'ap'
          const isKt = normalizedName === 'kt'
          const displayRole = isAyeAre
            ? 'Co-Founder/Artist'
            : isKat
              ? 'Co-Founder/Booking Agent'
              : isAp
                ? 'Videographer/Creative Director'
                : artist.role
          const profilePath = artist.slug?.current
            ? `/artists/${artist.slug.current}`
            : null

          const imageSrc = artist.imageUrl
            ? artist.imageUrl
            : isAyeAre
              ? ayeAreOverride
              : isKat
                ? katOverride
                : isAp
                  ? apOverride
                  : artist.image?.asset?.url || null
          const focus = isAyeAre
            ? '50% 35%'
            : isKat
              ? '50% 20%'
              : isKt
                ? artist.imageFocus ?? '50% 35%'
                : '50% 50%'
          const imageStyle: CSSProperties = { objectPosition: focus }
          if (isAyeAre) {
            imageStyle.transform = 'scale(0.8)'
            imageStyle.transformOrigin = 'center'
          }

          return (
            <div
              key={artist._id}
              className="rounded-xl border p-6 shadow-sm hover:shadow-md transition"
            >
              {imageSrc ? (
                profilePath ? (
                  <Link href={profilePath} className="block">
                    <img
                      src={imageSrc}
                      alt={displayName}
                      className="h-48 w-full rounded-lg mb-4 object-cover"
                      style={imageStyle}
                    />
                  </Link>
                ) : (
                    <img
                      src={imageSrc}
                      alt={displayName}
                      className="h-48 w-full rounded-lg mb-4 object-cover"
                      style={imageStyle}
                    />
                )
              ) : (
                <div className="h-48 w-full rounded-lg bg-gray-100 mb-4 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {profilePath ? (
                <h2 className="text-2xl font-semibold">
                  <Link href={profilePath} className="hover:underline">
                    {displayName}
                  </Link>
                </h2>
              ) : (
                <h2 className="text-2xl font-semibold">{displayName}</h2>
              )}

              {displayRole && (
                <p className="text-sm text-gray-500 mt-1">{displayRole}</p>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
