import type { Metadata } from 'next'
import SubmitForm from './SubmitForm'

export const metadata: Metadata = {
  title: 'Submit Your Work | Lion Heart Productions',
  description:
    'Aspiring artist? Submit your music or art to Lion Heart Productions for a chance to collaborate.',
}

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-[#0f0b1f] text-white">
      <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16">

        {/* Header */}
        <section className="space-y-5">
          <p className="text-xs uppercase tracking-[0.9em] text-[#8fb0ff]">
            Artist Submissions
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Ready to work with us?
            </h1>
            <p className="text-lg leading-relaxed text-white/70">
              We&apos;re always looking for artists and creatives who align with the Lion Heart
              vision. Fill out the form below and attach a track or clip that represents your
              sound. We review every submission personally.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#181430] to-[#1f1338] px-6 py-5">
            <p className="text-sm font-semibold text-white">What happens after you submit?</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li>• Our team listens to every submission — no auto-filters.</li>
              <li>• If there&apos;s a fit, we&apos;ll reach out via email or Instagram.</li>
              <li>• Response times vary, but we review on a rolling basis.</li>
            </ul>
          </div>
        </section>

        {/* Form card */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <SubmitForm />
        </section>

      </div>
    </main>
  )
}
