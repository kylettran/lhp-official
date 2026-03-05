'use client'

import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'

type HighlightType = {
  title?: string
  url: string
  type?: 'video' | 'link'
}

const LOCAL_VIDEO_PREFIX = '/assets/videos/'

const shouldRenderVideo = (highlight: HighlightType) =>
  highlight.type === 'video' || highlight.url.startsWith(LOCAL_VIDEO_PREFIX)

export default function VideoHighlightCard({ highlight }: { highlight: HighlightType }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])

  useEffect(() => {
    if (!isModalOpen) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isModalOpen, closeModal])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previousOverflow
      }
    }
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isModalOpen])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement || !shouldRenderVideo(highlight)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoElement.muted = true
            videoElement.loop = true
            videoElement.play().catch(() => {
              /* autoplay might still be blocked until the user interacts */
            })
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(videoElement)
    return () => observer.disconnect()
  }, [highlight])

  if (shouldRenderVideo(highlight)) {
    return (
      <>
        <div className="group relative cursor-grab overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-xl">
          <video
            ref={videoRef}
            src={highlight.url}
            title={highlight.title ?? 'Video highlight'}
            className="h-full w-full cursor-grab object-cover"
            playsInline
            muted
            loop
            preload="metadata"
            controls
          />
          <button
            type="button"
            onClick={openModal}
            className="absolute right-4 top-4 cursor-grab rounded-full border border-white/40 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white hover:bg-black/60"
          >
            Expand
          </button>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-[80] flex cursor-grab items-center justify-center bg-neutral-900/95 backdrop-blur-lg"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0"
              onClick={(event: MouseEvent<HTMLDivElement>) => {
                if (event.target === event.currentTarget) {
                  closeModal()
                }
              }}
            />
            <button
              type="button"
              onClick={closeModal}
              className="relative z-10 cursor-grab rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/60"
            >
              X
            </button>
            <video
              className="relative z-10 mx-auto mt-16 max-h-[85vh] max-w-[90vw] cursor-grab object-contain"
              src={highlight.url}
              title={highlight.title ?? 'Expanded highlight'}
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
        )}
      </>
    )
  }

  return (
    <a
      href={highlight.url}
      className="group cursor-grab rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-white/40 hover:bg-white/10"
      rel="noreferrer"
      target="_blank"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-rose-200">Highlight</p>
      <p className="mt-3 text-lg font-semibold text-white">
        {highlight.title ?? 'Add video title'}
      </p>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/60">Watch clip</p>
    </a>
  )
}
