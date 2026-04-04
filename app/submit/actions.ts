'use server'

import { put } from '@vercel/blob'
import { createClient } from '@sanity/client'

// Separate write client — needs SANITY_WRITE_TOKEN env var (not the public read client)
const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB in bytes
const ALLOWED_EXTENSIONS = ['.mp3', '.mp4']
const ALLOWED_MIME_TYPES = ['audio/mpeg', 'video/mp4', 'audio/mp3']

export type SubmitState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; error: string }

export async function submitArtistApplication(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const firstName = (formData.get('firstName') as string | null)?.trim()
  const lastName = (formData.get('lastName') as string | null)?.trim()
  const instagram = (formData.get('instagram') as string | null)?.trim()
  const email = (formData.get('email') as string | null)?.trim()
  const phone = (formData.get('phone') as string | null)?.trim()
  const file = formData.get('file') as File | null

  // Field validation
  if (!firstName || !lastName || !instagram || !email || !phone) {
    return { status: 'error', error: 'All fields are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: 'error', error: 'Please enter a valid email address.' }
  }

  if (!file || file.size === 0) {
    return { status: 'error', error: 'Please upload your MP3 or MP4 file.' }
  }

  // File type validation — check both extension and MIME type
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return { status: 'error', error: 'File must be an MP3 or MP4.' }
  }

  // File size validation
  if (file.size > MAX_FILE_SIZE) {
    return { status: 'error', error: 'File must be smaller than 25MB.' }
  }

  // Upload file to Vercel Blob
  let blobUrl: string
  try {
    const blob = await put(
      `artist-submissions/${Date.now()}-${file.name.replace(/\s+/g, '-')}`,
      file,
      { access: 'public' },
    )
    blobUrl = blob.url
  } catch {
    return { status: 'error', error: 'File upload failed. Please try again.' }
  }

  // Write submission record to Sanity
  try {
    await sanityWriteClient.create({
      _type: 'artistSubmission',
      firstName,
      lastName,
      instagram: instagram.replace(/^@/, ''),
      email,
      phone,
      fileUrl: blobUrl,
      fileName: file.name,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    })
  } catch {
    return {
      status: 'error',
      error: 'Submission could not be saved. Please try again.',
    }
  }

  return { status: 'success' }
}
