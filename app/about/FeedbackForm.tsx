'use client'

import { useActionState, useState } from 'react'
import { submitFeedback, type FeedbackState } from './feedbackActions'
import { Star, CheckCircle2, AlertCircle } from 'lucide-react'

const CATEGORIES = [
  { label: 'Design', value: 'design' },
  { label: 'Navigation', value: 'navigation' },
  { label: 'Events Info', value: 'events' },
  { label: 'Content', value: 'content' },
  { label: 'Other', value: 'other' },
]

const initialState: FeedbackState = { status: 'idle' }

export default function FeedbackForm() {
  const [state, formAction, isPending] = useActionState(submitFeedback, initialState)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('')

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-[#78bfff]" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Thanks for the feedback.</p>
          <p className="text-sm text-white/50">We read every message and use it to improve.</p>
        </div>
      </div>
    )
  }

  const activeStar = hoveredStar || selectedStar

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields */}
      <input type="hidden" name="page" value="/about" />
      <input type="hidden" name="rating" value={selectedStar || ''} />
      <input type="hidden" name="category" value={selectedCategory} />

      {/* Error */}
      {state.status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Star rating */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8fb0ff]">
          How was your experience?
        </p>
        <div
          className="flex gap-1"
          onMouseLeave={() => setHoveredStar(0)}
          role="group"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setSelectedStar(star)}
              onMouseEnter={() => setHoveredStar(star)}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
              className="transition-transform hover:scale-110 focus:outline-none"
            >
              <Star
                className={`h-7 w-7 transition-colors ${
                  star <= activeStar
                    ? 'fill-[#78bfff] text-[#78bfff]'
                    : 'fill-transparent text-white/20'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8fb0ff]">
          What area is this about?
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() =>
                setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)
              }
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                selectedCategory === cat.value
                  ? 'border-[#78bfff]/60 bg-[#78bfff]/15 text-[#78bfff]'
                  : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback textarea */}
      <div className="space-y-2">
        <label
          htmlFor="feedback"
          className="block text-xs font-semibold uppercase tracking-[0.25em] text-[#8fb0ff]"
        >
          Your Feedback <span className="text-rose-400">*</span>
        </label>
        <textarea
          id="feedback"
          name="feedback"
          rows={4}
          required
          placeholder="Tell us what we can improve, what you loved, or what felt off…"
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#78bfff]/50 focus:ring-1 focus:ring-[#78bfff]/30"
        />
      </div>

      {/* Optional email */}
      <div className="space-y-2">
        <label
          htmlFor="feedbackEmail"
          className="block text-xs font-semibold uppercase tracking-[0.25em] text-[#8fb0ff]"
        >
          Email{' '}
          <span className="normal-case tracking-normal text-white/30 text-[10px] font-normal">
            — optional, for follow-up
          </span>
        </label>
        <input
          id="feedbackEmail"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#78bfff]/50 focus:ring-1 focus:ring-[#78bfff]/30"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-rose-500 py-3.5 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-rose-900/40 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Sending…' : 'Send Feedback'}
      </button>
    </form>
  )
}
