import { sanityClient } from '@/lib/sanity.client'
import { allArtistsQuery } from '@/lib/sanity.queries'

export default async function ArtistsPage() {
  const artists = await sanityClient.fetch(allArtistsQuery)
  const ayeAreOverride = '/assets/images/ar.png'

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10">Artists & Members</h1>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {artists.map((artist: any) => {
          const normalizedName = (artist.name ?? '')
            .toLowerCase()
            .replace(/[^a-z]/g, '')
            .trim()
          const isAyeAre = normalizedName === 'ayeare'

          const imageSrc =
            artist.image?.asset?.url || isAyeAre ? (
              isAyeAre ? ayeAreOverride : artist.image.asset.url
            ) : null

          return (
            <div
              key={artist._id}
              className="rounded-xl border p-6 shadow-sm hover:shadow-md transition"
            >
              {imageSrc ? (
                isAyeAre ? (
                  <a
                    href="https://www.instagram.com/aye.are/"
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img
                      src={imageSrc}
                      alt={artist.name}
                      className={`h-48 w-full rounded-lg mb-4 ${
                        isAyeAre
                          ? 'object-contain bg-black'
                          : 'object-cover object-center'
                      }`}
                    />
                  </a>
                ) : (
                  <img
                    src={imageSrc}
                    alt={artist.name}
                    className={`h-48 w-full rounded-lg mb-4 ${
                      isAyeAre
                        ? 'object-contain bg-black'
                        : 'object-cover object-center'
                    }`}
                  />
                )
              ) : (
                <div className="h-48 w-full rounded-lg bg-gray-100 mb-4 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <h2 className="text-2xl font-semibold">{artist.name}</h2>

              {artist.role && (
                <p className="text-sm text-gray-500 mt-1">{artist.role}</p>
              )}

              {artist.bio && (
                <p className="text-sm text-gray-700 mt-3">{artist.bio}</p>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
