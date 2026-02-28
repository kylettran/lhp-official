export const normalizeName = (name?: string) =>
  (name ?? '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .trim()

export interface ManualArtistProfile {
  _id: string
  name: string
  slug: { current: string }
  role: string
  bio: string
  image?: { asset: { url: string } }
  imageUrl?: string
  socialLinks?: Record<string, string>
  showOnWof?: boolean
  showOnTeam?: boolean
  imageFocus?: string
}

const manualProfiles: ManualArtistProfile[] = [
  {
    _id: 'manual-ayeare',
    name: 'Aye.Are',
    slug: { current: 'ayeare' },
    role: 'Co-Founder/Artist',
    bio: `Aye.Are didn’t wait for opportunity — he built it.

Growing up in the High Desert where stages were limited and doors rarely opened, he created Lion Heart Productions to curate his own shows and get his reps in. What started as a way to perform quickly became something bigger: a platform to network, learn the industry, and build real momentum from the ground up.

Believing there’s no single blueprint to success, Aye.Are stands for artists finding their own path. Inspired by independence but guided by self-discovery, he built his career through consistency, reflection, and relentless growth. From chasing opportunities to attracting them, his evolution reflects a deeper shift — no longer proving, but building. No longer waiting, but creating.

Lion Heart isn’t just about him. It’s about creating rooms he once wished existed. Alongside a team that believed from day one, he’s building a space where DJs, artists, and creatives can grow, perform, and find their voice. In a culture that often celebrates individual wins, Aye.Are believes in winning together.

There’s more than one way to make it.
This is his.`,
    socialLinks: {
      instagram: 'https://www.instagram.com/aye.are',
    },
    showOnWof: false,
    showOnTeam: false,
  },
  {
    _id: 'manual-rozez',
    name: '_.Rozez._',
    slug: { current: 'rozez' },
    role: 'Guest DJ',
    bio: 'Underground selector _.Rozez._ fused ambient basslines with late-night club energy for the December 21, 2024 takeover.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/_.rozez._',
      tiktok: 'https://www.tiktok.com/@rozez',
      soundcloud: 'https://soundcloud.com/rozez',
    },
    showOnWof: true,
  },
  {
    _id: 'manual-byplazasam',
    name: 'By Plaza Sam',
    slug: { current: 'byplazasam' },
    role: 'Special Guest DJ',
    bio: 'By Plaza Sam curated a sun-soaked house set for 2K25 Sundown, keeping the energy radiant as daylight faded.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/byplazasam',
      soundcloud: 'https://soundcloud.com/byplazasam',
      website: 'https://byplazasam.com',
    },
    showOnWof: true,
  },
  {
    _id: 'manual-angelothesinger',
    name: 'Angelo The Singer',
    slug: { current: 'angelothesinger' },
    role: 'Guest Vocalist',
    bio: 'Angelo blended R&B warmth with soaring falsettos on the 2K25 Sundown stage, elevating every chorus.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/angelothesinger',
      twitter: 'https://twitter.com/angelothesinger',
      website: 'https://angelothesinger.com',
    },
    showOnWof: true,
  },
  {
    _id: 'manual-rawtakem',
    name: 'Raw Takem',
    slug: { current: 'rawtakem' },
    role: 'Photographer',
    bio: 'Raw Takem documented the neon-lit details of both Sundown and Rager, pairing cinematic angles with breathless timing.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/rawtakem',
      website: 'https://rawtakem.com',
    },
    showOnWof: false,
  },
  {
    _id: 'manual-wetball909',
    name: 'Wetball909',
    slug: { current: 'wetball909' },
    role: 'Guest Artist',
    bio: 'Wetball909 brought high-energy cadences to 2K25 Rager, layering percussion-heavy hooks that kept the floor bouncing.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/wetball909',
      website: 'https://wetball909.com',
    },
    showOnWof: true,
  },
  {
    _id: 'manual-atom-black',
    name: 'Atom Black',
    slug: { current: 'atom-black' },
    role: 'Guest Artist',
    bio: 'Atom Black injected dark synthwave textures into 2K25 Rager, turning every breakdown into a cinematic moment.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/atom.black',
      tiktok: 'https://www.tiktok.com/@atom.black',
    },
    showOnWof: true,
  },
  {
    _id: 'manual-djdloop',
    name: 'DJ Dloop',
    slug: { current: 'djdloop' },
    role: 'Guest DJ',
    bio: 'DJ Dloop fused dubstep grit with melodic swells for the 2K25 Rager warm-up slot.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/djdloop_',
      soundcloud: 'https://soundcloud.com/djdloop',
    },
    showOnWof: true,
  },
  {
    _id: 'manual-justken',
    name: 'Just Ken',
    slug: { current: 'justken' },
    role: 'Guest DJ',
    bio: 'Just Ken closed 2K25 Rager with heady future house, balancing hypnotic grooves and vinyl-era flair.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/justken',
      mixcloud: 'https://www.mixcloud.com/justken',
    },
    showOnWof: true,
  },
  {
    _id: 'manual-angel-iglesias',
    name: 'Angel Iglesias',
    slug: { current: 'angel-iglesias' },
    role: 'Host / Curator',
    bio: 'Angel Iglesias hosted 2K25 Rager, guiding the night with sharp energy and a community-first mindset.',
    image: {
      asset: {
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    socialLinks: {
      instagram: 'https://www.instagram.com/angel.iglesias00',
      website: 'https://angeliglesias.com',
    },
    showOnWof: true,
  },
  {
    _id: 'manual-kt',
    name: 'KT',
    slug: { current: 'kt' },
    role: 'Director of Operations',
    bio: 'KT keeps LHP running behind the scenes, coordinating artists, logistics, and the crew every step of the way.',
    imageUrl: '/assets/images/kt-portrait.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/kt_lhp',
      linkedin: 'https://www.linkedin.com/in/ktoperations',
    },
    showOnWof: false,
    showOnTeam: true,
    imageFocus: '50% 35%',
  },
  {
    _id: 'manual-long',
    name: 'Long',
    slug: { current: 'long' },
    role: 'Director of the Floor',
    bio: 'Long ensures the floor stays safe, hype, and unforgettable—he is the heartbeat of every LHP room.',
    imageUrl: '/assets/images/long-portrait.jpg',
    socialLinks: {
      instagram: 'https://www.instagram.com/longfloor',
    },
    showOnWof: false,
    showOnTeam: true,
    imageFocus: '50% 45%',
  },
]

export const manualArtistProfiles: ManualArtistProfile[] = manualProfiles

export const manualArtistProfilesBySlug = manualProfiles.reduce<Record<string, ManualArtistProfile>>(
  (acc, profile) => {
    const slug = profile.slug?.current
    if (slug) {
      acc[slug] = profile
    }
    return acc
  },
  {}
)

export interface PastEventFallback {
  slug: string
  title: string
  date: string
  status: 'past'
  location: string
  description: string
  instagramUrl?: string
  teamMessage?: string
  posterImage?: { asset: { url: string } } | null
  gallery?: { asset: { url: string } }[]
  videoHighlights?: { title: string; url: string }[]
  attendees?: string[]
}

export const pastEventFallbacks: Record<string, PastEventFallback> = {
  'loves-and-lones': {
    slug: 'loves-and-lones',
    title: 'Lovers & Loners',
    date: '2026-02-12T21:00:00.000Z',
    status: 'past',
    location: 'The Continental Room · Fullerton, CA',
    description:
      'An emotionally charged night where AYE.ARE and FRESE traded verses, vinyl spun vinyl, and the room felt like a single pulse.',
    instagramUrl: 'https://www.instagram.com/lhpofficial',
    teamMessage:
      'Raising the roof with Lovers & Loners was a love letter to the community—thank you for showing up for every verse and every beat.',
    posterImage: null,
    gallery: [],
    videoHighlights: [],
    attendees: ['Ari Moss', 'Dorian Rae', 'Eli Vance', 'Mina Glass', 'Sasha Lor'],
  },
  '2k24-rager': {
    slug: '2k24-rager',
    title: '2K24 Rager',
    date: '2024-12-21T23:30:00.000Z',
    status: 'past',
    location: 'District 1890 · Los Angeles, CA',
    description:
      '_.Rozez._ transformed the winter floor into the 2K24 Rager, rolling bass-heavy crescendos and cinematic synth waves into every beat.',
    instagramUrl: 'https://www.instagram.com/_.rozez._',
    teamMessage:
      'Appreciate the crew who let _.Rozez._ morph the night into the 2K24 Rager—every body ignited the countdown into the new year.',
    posterImage: { asset: { url: '/assets/images/lal1.png' } },
    gallery: [
      { asset: { url: '/assets/images/lal2.png' } },
      { asset: { url: '/assets/images/lal3.png' } },
      { asset: { url: '/assets/images/lal4.png' } },
    ],
    videoHighlights: [],
    attendees: ['Amelia Hart', 'Kai Vega', 'Zara Kline', 'Theo Mora', 'Brynn Vale'],
  },
  '2k25-sundown': {
    slug: '2k25-sundown',
    title: '2K25 Sundown',
    date: '2025-08-16T21:00:00.000Z',
    status: 'past',
    location: 'Skyline Warehouse · Los Angeles, CA',
    description:
      'Sundown turned into a multi-sensory cascade—By Plaza Sam warming up the skyline, Angelo The Singer adding velvet vocals, and Raw Takem freezing every rooftop glow.',
    instagramUrl: 'https://www.instagram.com/lhpofficial',
    teamMessage:
      'Big love to everyone who welcomed the sunlight-to-night transition and danced across the Loft floor.',
    posterImage: { asset: { url: '/assets/images/lal5.png' } },
    gallery: [
      { asset: { url: '/assets/images/lal6.png' } },
      { asset: { url: '/assets/images/lal7.png' } },
      { asset: { url: '/assets/images/lal8.png' } },
    ],
    videoHighlights: [
      {
        title: 'Sundown Recap',
        url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
      },
    ],
    attendees: ['Nova Quinn', 'Milo Dane', 'Sasha Lor', 'River Blue', 'Chevy Lane'],
  },
  '2k25-rager': {
    slug: '2k25-rager',
    title: '2K25 Rager',
    date: '2025-11-08T22:00:00.000Z',
    status: 'past',
    location: 'The Hive · Downtown Los Angeles, CA',
    description:
      '2K25 Rager was a charged battleground of guest artists, DJs, and the host energy—wetball909, Atom Black, Just Ken, DJ Dloop, Raw Takem framed every burst.',
    instagramUrl: 'https://www.instagram.com/angel.iglesias00',
    teamMessage:
      'Thanks for showing up hard, for being the heat of the floor, and for trusting Angel Iglesias to keep the pulse racing.',
    posterImage: { asset: { url: '/assets/images/lal9.png' } },
    gallery: [
      { asset: { url: '/assets/images/lal1.png' } },
      { asset: { url: '/assets/images/lal2.png' } },
      { asset: { url: '/assets/images/lal3.png' } },
    ],
    videoHighlights: [
      {
        title: 'Rager Aftermovie',
        url: 'https://vimeo.com/76979871',
      },
    ],
    attendees: ['Nico Sora', 'Lia Storm', 'Cruz Maddox', 'Elena Rue', 'Oak Rivers'],
  },
}

export const pastEventFallbackList = Object.values(pastEventFallbacks)

export interface ImpactEventStat {
  slug: string
  attendees: number
}

export const curatedImpactEventStats: ImpactEventStat[] = [
  { slug: '2k24-rager', attendees: 25 },
  { slug: '2k25-sundown', attendees: 25 },
  { slug: '2k25-rager', attendees: 65 },
  { slug: 'loves-and-lones', attendees: 150 },
]
