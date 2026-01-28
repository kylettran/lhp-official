import groq from 'groq'

export const allArtistsQuery = groq`
  *[_type == "artist"] | order(name asc) {
    _id,
    name,
    role,
    bio,
    image {
      asset->{
        url
      }
    }
  }
`