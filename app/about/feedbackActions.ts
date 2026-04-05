'use server'

import { createClient } from '@sanity/client'

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

export type FeedbackState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; error: string }

export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const feedback = (formData.get('feedback') as string | null)?.trim()
  const category = (formData.get('category') as string | null) ?? null
  const email = (formData.get('email') as string | null)?.trim() || null
  const rating = Number(formData.get('rating'))
  const page = (formData.get('page') as string | null) ?? '/about'

  if (!feedback || feedback.length < 5) {
    return { status: 'error', error: 'Please share a little more detail (at least 5 characters).' }
  }

  if (rating && (rating < 1 || rating > 5)) {
    return { status: 'error', error: 'Invalid rating.' }
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { status: 'error', error: 'Please enter a valid email address.' }
    }
  }

  try {
    await sanityWriteClient.create({
      _type: 'websiteFeedback',
      feedback,
      category,
      rating: rating || null,
      email,
      page,
      submittedAt: new Date().toISOString(),
      status: 'new',
    })
  } catch {
    return { status: 'error', error: 'Something went wrong. Please try again.' }
  }

  return { status: 'success' }
}
