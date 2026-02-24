import { Bricolage_Grotesque, Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
})

export default function AboutPage() {
  return (
    <main className={`${bricolage.className} bg-[#0f0b1f] text-white`}>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(158,97,255,0.55),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,125,208,0.35),_transparent_45%)]" />
        <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-[#6f2cff]/40 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-10%] h-72 w-72 rounded-full bg-[#ff7ad9]/30 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-[0.5em] text-violet-200/70">
            About Lion Heart Productions
          </p>
          <h1
            className={`${playfair.className} mt-6 text-4xl font-semibold leading-tight text-white sm:text-6xl`}
          >
            We throw nights that feel like a movie and move like a heartbeat.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-violet-100/80">
            Lion Heart Productions is a culture-first entertainment crew building
            unforgettable experiences in music, art, and nightlife. We believe
            the best nights are a mix of atmosphere, storytellers, and community
            that feels seen.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full border border-violet-300/40 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em]">
              Purple Energy
            </span>
            <span className="rounded-full border border-violet-300/40 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em]">
              Artist Forward
            </span>
            <span className="rounded-full border border-violet-300/40 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em]">
              Community First
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-violet-400/20 bg-white/5 p-8">
            <h2 className={`${playfair.className} text-3xl font-semibold`}>
              Why we do it
            </h2>
            <p className="mt-4 text-base text-violet-100/80">
              We started LHP because the city needed nights that were more than
              just a lineup. We wanted a room where every detail feels curated,
              the music hits like a plot twist, and the energy makes strangers
              feel like day-ones.
            </p>
            <p className="mt-4 text-base text-violet-100/80">
              Our story is about celebrating talent, making space for creative
              risk, and turning a single night into a memory people talk about
              for weeks.
            </p>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#2a144d] via-[#1b1032] to-[#120b22] p-8">
              <p className="text-xs uppercase tracking-[0.4em] text-violet-200/70">
                Our vibe
              </p>
              <h3 className="mt-4 text-2xl font-semibold">Bold. Romantic. Loud.</h3>
              <p className="mt-3 text-sm text-violet-100/70">
                Think midnight purple, cinematic lighting, and a dance floor that
                moves like a wave. We chase the wow-factor without ever losing
                the heart.
              </p>
            </div>
            <div className="rounded-3xl border border-violet-400/20 bg-white/5 p-8">
              <p className="text-xs uppercase tracking-[0.4em] text-violet-200/70">
                What we promise
              </p>
              <p className="mt-3 text-sm text-violet-100/70">
                Fresh talent, unforgettable moments, and a community that feels
                like family.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-[#170f2c]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-violet-500/70">
                Meet the team
              </p>
              <h2 className={`${playfair.className} mt-3 text-3xl font-semibold`}>
                Storytellers, curators, vibe architects.
              </h2>
            </div>
            <p className="max-w-xl text-sm text-[#403154]">
              We are a crew of producers, creatives, and connectors building the
              next chapter of nightlife in SoCal. We care about the details and
              the people in the room.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Creative Direction',
                note: 'Visual tone, stage design, and the magic in the details.',
              },
              {
                title: 'Talent & Booking',
                note: 'Curating the lineup and spotlighting rising stars.',
              },
              {
                title: 'Experience & Hospitality',
                note: 'Welcoming the crowd and keeping the energy up all night.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-violet-200 bg-violet-50 p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-violet-500">
                  {item.title}
                </p>
                <p className="mt-3 text-sm text-[#3f2d59]">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-violet-400/20 bg-white/5 p-8">
            <h2 className={`${playfair.className} text-3xl font-semibold`}>
              Our mission
            </h2>
            <p className="mt-4 text-base text-violet-100/80">
              To build experiences where music, fashion, and culture collide.
              Every event is a chapter. Every chapter makes the community
              louder, brighter, and more connected.
            </p>
          </div>
          <div className="rounded-3xl border border-violet-400/20 bg-gradient-to-b from-[#1d1235] to-[#120b22] p-8">
            <h3 className="text-sm uppercase tracking-[0.4em] text-violet-200/70">
              Want in?
            </h3>
            <p className="mt-4 text-lg text-white">
              Follow the story, bring your people, and let us handle the rest.
            </p>
            <p className="mt-6 text-sm text-violet-100/70">
              We are always looking for collaborators, vendors, and artists who
              want to shape the next night.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
