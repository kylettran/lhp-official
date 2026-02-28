import groq from 'groq'

export const allArtistsQuery = groq`
  *[_type == "artist"] | order(name asc) {
    _id,
    name,
    slug,
    role,
    socialLinks,
    bio,
    "image": coalesce(photo, image) {
      asset->{
        url
      }
    }
  }
`
