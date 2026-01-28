import { sanityClient } from '@/lib/sanity.client'
import { allArtistsQuery } from '@/lib/sanity.queries'

export default async function ArtistsPage() {
  const artists = await sanityClient.fetch(allArtistsQuery)

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-10">Artists & Members</h1>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
  {artists.map((artist: any) => (
    <div
      key={artist._id}
      className="rounded-xl border p-6 shadow-sm hover:shadow-md transition"
    >
      {artist.image?.asset?.url ? (
        <img
          src={artist.image.asset.url}
          alt={artist.title}
          className="h-48 w-full object-cover rounded-lg mb-4"
        />
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
  ))}
</div>
    </main>
  )
}