import type { ReactElement } from 'react'
import { sanityClient } from '@/lib/sanity.client'
import groq from 'groq'
import Link from 'next/link'
import {
  manualArtistProfilesBySlug,
  normalizeName,
} from '@/data/fallbacks'

const artistBySlugQuery = groq`
  *[_type == "artist" && slug.current == $slug][0]{
    name,
    role,
    bio,
    "imageUrl": coalesce(photo, image).asset->url,
    socialLinks
  }
`

const socialIconMap: Record<string, ReactElement> = {
  instagram: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 text-neutral-900"
      role="img"
    >
      <path
        d="M7 2C4.238 2 2 4.238 2 7v10c0 2.762 2.238 5 5 5h10c2.762 0 5-2.238 5-5V7c0-2.762-2.238-5-5-5H7zm0 2h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zm5 3.5A4.5 4.5 0 1016.5 12 4.505 4.505 0 0012 7.5zm0 2A2.5 2.5 0 1114.5 12 2.503 2.503 0 0112 9.5zm4.75-.5a.75.75 0 11-.75.75.75.75 0 01.75-.75z"
        fill="currentColor"
      />
    </svg>
  ),
  linkedin: (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 text-neutral-900"
      role="img"
    >
      <path
        d="M4.98 3.5C4.98 2.12 3.86 1 2.5 1S.02 2.12.02 3.5 1.14 6 2.5 6 4.98 4.88 4.98 3.5zM2.5 7H5V21H2.5zm5.5 0H13V12.5c0 3.19 4 3.44 4 0V7H22V21h-2.5V14c0-2.16-2.5-2-2.5 0V21H13.5z"
        fill="currentColor"
      />
    </svg>
  ),
}

const fallbackInstagramBySlug: Record<string, string> = {
  ap: 'https://www.instagram.com/ap',
  'aye-are': 'https://www.instagram.com/aye.are',
  katherinedeleon: 'https://www.instagram.com/katherinedeleon',
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const sanityArtist = await sanityClient.fetch(artistBySlugQuery, { slug })
  const manualArtist = manualArtistProfilesBySlug[slug]

  let profile = sanityArtist
  if (manualArtist) {
    profile = {
      ...sanityArtist,
      ...manualArtist,
    }
  }

  if (!profile) {
    return <div>Artist not found</div>
  }

  const normalizedName = normalizeName(profile.name)
  const displayName =
    normalizedName === 'ap'
      ? 'AP'
      : normalizedName === 'ayeare'
        ? 'Aye.Are'
        : profile.name || 'Artist'
  const isAyeAre = normalizedName === 'ayeare'
  const isKat = normalizedName === 'katherinedeleon'
  const isAp = normalizedName === 'ap'
  const profileImageSrc = profile.imageUrl
    ? profile.imageUrl
    : isAyeAre
      ? '/assets/images/ar-portrait.png'
      : isKat
        ? '/assets/images/kat-pfp.png'
        : isAp
          ? '/assets/images/ap-portrait.png'
          : profile.image?.asset?.url || null

  const fallbackInstagramUrl = fallbackInstagramBySlug[normalizedName]
  const mergedSocialLinks = {
    ...(profile.socialLinks ?? {}),
  }
  if (fallbackInstagramUrl && !mergedSocialLinks.instagram) {
    mergedSocialLinks.instagram = fallbackInstagramUrl
  }
  const socialEntries = Object.entries(mergedSocialLinks).filter(([, url]) => Boolean(url))

  const renderSocialLink = ([platform, url]: [string, string]) => {
    const normalizedPlatform = platform.toLowerCase()
    const icon = socialIconMap[normalizedPlatform]
    const label = `${platform} profile`

    if (icon) {
      return (
        <a
          key={`${platform}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/5 text-neutral-900 transition hover:bg-neutral-900/10"
        >
          {icon}
          <span className="sr-only">{label}</span>
        </a>
      )
    }

    return (
      <a
        key={`${platform}-${url}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 transition hover:border-neutral-900"
      >
        {platform}
      </a>
    )
  }

  const imageObjectPosition =
    profile.imageFocus ?? (slug === 'kt' ? '50% 35%' : '50% 50%')

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
            alt={displayName}
            className="w-full max-w-3xl rounded-2xl object-cover"
            style={{
              width: '100%',
              maxHeight: 'min(80vh, 36rem)',
              objectPosition: imageObjectPosition,
            }}
          />
        </div>
      )}

      <h1 className="mb-2 text-4xl font-bold">{displayName}</h1>

      {profile.role && (
        <p className="mb-6 text-lg text-gray-600">{profile.role}</p>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900">About</h2>
        <p className="text-neutral-700">
          {manualArtist?.bio ?? profile.bio ?? 'Bio coming soon.'}
        </p>
      </section>

      {socialEntries.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {socialEntries.map((entry) => renderSocialLink(entry as [string, string]))}
        </div>
      )}
    </main>
  )
}
