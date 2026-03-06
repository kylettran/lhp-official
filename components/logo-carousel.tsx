'use client'

const logos = [
  { label: 'TCR LOGO', src: '/assets/images/tcr%20logo.png' },
  { label: '' },
  { label: '' },
  { label: '' },
  { label: '' },
  { label: '' },
]

export default function LogoCarousel() {
  // TODO: Replace placeholder logo-slots with real <img> tags
  return (
    <section className="logo-carousel-section">
      <div className="logo-label">
        <p>PARTNERS &amp; SPONSORS</p>
      </div>
      <div className="logo-marquee-wrapper">
        <div className="logo-marquee">
          {[...logos, ...logos].map((logo, index) => (
            <div key={`${index}`} className="logo-slot">
              {logo.src ? (
                <img src={logo.src} alt={logo.label} className="logo-image" />
              ) : (
                <span aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .logo-carousel-section {
          width: 100%;
          background: transparent;
          padding: 32px 0;
          color: #ffffff;
        }

        .logo-label {
          text-align: center;
          margin-bottom: 18px;
        }

        .logo-label p {
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #ffffffcc;
        }

        .logo-marquee-wrapper {
          position: relative;
          overflow: hidden;
        }

        .logo-marquee {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: marquee 30s linear infinite;
          will-change: transform;
        }

        .logo-slot {
          width: 240px;
          height: 96px;
          border-radius: 26px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          font-size: 14px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #ffffffcc;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .logo-image {
          max-width: 85%;
          max-height: 85%;
          object-fit: contain;
          opacity: 0.8;
          filter: saturate(1.2) brightness(1.3);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .logo-slot:hover {
          opacity: 1;
          transform: scale(1.05);
        }

        .logo-slot:hover .logo-image {
          opacity: 1;
        }

        .logo-marquee-wrapper:hover .logo-marquee,
        .logo-marquee-wrapper:hover .logo-slot {
          animation-play-state: paused;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
