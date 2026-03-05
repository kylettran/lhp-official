'use client'

import { useEffect, useRef } from 'react'

type HeroVideoProps = {
  src: string
  className?: string
}

export default function HeroVideo({ src, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.loop = true
    video.playsInline = true

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              /* Autoplay prevented even though muted; nothing to do */
            })
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  )
}
