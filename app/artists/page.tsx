import { sanityClient } from '@/lib/sanity.client'
import { allArtistsQuery } from '@/lib/sanity.queries'
import Link from 'next/link'

export default async function ArtistsPage() {
  const artists = await sanityClient.fetch(allArtistsQuery)
  const minimumCards = 9
  const placeholderCount = Math.max(0, minimumCards - artists.length)
  const ayeAreOverride = '/assets/images/ar-portrait.png'
  const katOverride = '/assets/images/kat-pfp.png'
  const apOverride = '/assets/images/ap-portrait.png'

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="mb-10 text-4xl font-bold">Members</h1>
      <div id="artists-grid" className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {artists.map((artist: any) => {
          const normalizedName = (artist.name ?? '')
            .toLowerCase()
            .replace(/[^a-z]/g, '')
            .trim()
          const isAyeAre = normalizedName === 'ayeare'
          const isKat = normalizedName === 'katherinedeleon'
          const isAp = normalizedName === 'ap'
          const displayRole = isAyeAre
            ? 'Co-Founder/Artist'
            : isKat
              ? 'Co-Founder and Director of Business Development'
            : isAp
              ? 'Videographer/Creative Director'
              : artist.role
          const profilePath = artist.slug?.current
            ? `/artists/${artist.slug.current}`
            : null

          const imageSrc = isAyeAre
            ? ayeAreOverride
            : isKat
              ? katOverride
              : isAp
                ? apOverride
              : artist.image?.asset?.url || null

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
                      alt={artist.name}
                      className={`h-48 w-full rounded-lg mb-4 ${
                        isAyeAre
                          ? 'object-cover object-[50%_35%]'
                          : isKat
                            ? 'object-cover object-[50%_20%]'
                            : 'object-cover object-center'
                      }`}
                    />
                  </Link>
                ) : (
                  <img
                    src={imageSrc}
                    alt={artist.name}
                    className={`h-48 w-full rounded-lg mb-4 ${
                      isAyeAre
                        ? 'object-cover object-[50%_35%]'
                        : isKat
                          ? 'object-cover object-[50%_20%]'
                          : 'object-cover object-center'
                    }`}
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
                    {artist.name}
                  </Link>
                </h2>
              ) : (
                <h2 className="text-2xl font-semibold">{artist.name}</h2>
              )}

              {displayRole && (
                <p className="text-sm text-gray-500 mt-1">{displayRole}</p>
              )}
            </div>
          )
        })}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <div
            key={`placeholder-member-${index}`}
            className="rounded-xl border border-dashed p-6 bg-neutral-50"
          >
            <div className="h-48 w-full rounded-lg mb-4 flex items-center justify-center bg-white text-gray-400 border border-dashed">
              Photo Slot
            </div>
            <h2 className="text-2xl font-semibold text-neutral-700">
              Open Member Slot
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add artist/member in Sanity
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
