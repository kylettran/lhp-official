export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0f0b1f] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-[0.9em] text-[#8fb0ff]">
            ABOUT LION HEART PRODUCTIONS
          </p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white">
              Artist-led production rooted in vision, execution, and culture.
            </h1>
            <p className="text-lg leading-relaxed text-white/80">
              Lion Heart Productions is an artist-led event and creative production company built on vision, execution, and culture. Founded by Aye.Are &amp; Kat, LHP started as a way to throw intimate, intentional shows and quickly evolved into the premium experiences the community now looks forward to.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#181430] to-[#1f1338] p-8 shadow-2xl shadow-[#1f1338]/60 md:flex md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-white">We don’t just throw shows.</p>
              <p className="text-lg text-white/80">We curate moments.</p>
            </div>
            <p className="mt-4 text-sm uppercase tracking-[0.6em] text-[#78bfff] md:mt-0">Crafted intentionally.</p>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur">
            <p className="text-2xl font-semibold text-white">Story</p>
            <p className="text-lg text-white/80">
              What began as intimate gatherings of 20 people quickly scaled into sold-out productions hosting over 150 attendees, proving that intention and quality always scale.
            </p>
            <p className="text-lg text-white/80">
              From high-energy ragers to emotionally driven nights like Lovers &amp; Loners, every Lion Heart event is designed with purpose—melding music, visuals, and atmosphere into a premium experience.
            </p>
            <p className="text-lg text-white/80">
              Behind the scenes, our team moves like a production house: every partnership, operation, creative direction, and lighting call is choreographed to shape unforgettable energy.
            </p>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/5 bg-gradient-to-b from-[#111025] to-[#1f1831] p-8">
            <p className="text-2xl font-semibold text-white">Values</p>
            <ul className="space-y-3 text-white/80">
              <li>• Strategic partnerships that open new doors</li>
              <li>• Operations that keep every beat flawless</li>
              <li>• Creative direction that elevates visuals</li>
              <li>• Lighting and atmosphere that guide the energy</li>
            </ul>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.6em] text-[#8fb0ff]">Growth over hype</p>
              <p className="text-lg text-white/90">
                Lion Heart Productions is built on earning every milestone and building culture that lasts. This isn’t just an event company—it’s a movement of creators, artists, and supporters who believe in doing things at a higher level.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-white/5 bg-black/30 p-8">
          <div className="space-y-3">
            <p className="text-2xl font-semibold text-white">What we deliver</p>
            <p className="text-lg text-white/80">
              From charged night ragers to emotionally driven themed rooms, each Lion Heart event is choreographed across music, visuals, and people, so the atmosphere feels deeper than the headline.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">Impact</p>
              <p className="text-3xl font-semibold text-white">150+ live attendees</p>
              <p className="text-sm text-white/60">sold-out, premium experiences</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">Intent</p>
              <p className="text-3xl font-semibold text-white">Every detail</p>
              <p className="text-sm text-white/60">from curtain drop to exit set</p>
            </div>
          </div>
          <p className="text-lg text-white/80">
            Behind the scenes, King Heart operates like a family—curating rooms where DJs, artists, and creatives can grow together. We believe in building culture that lasts.
          </p>
          <div className="text-lg font-semibold text-[#78bfff]">Welcome to Lion Heart.</div>
        </section>
      </div>
    </main>
  )
}
