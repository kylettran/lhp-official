'use client'

import { useEffect, useRef, useState } from 'react'

export type HighlightItem = {
  type: 'video' | 'image'
  label: string
  src?: string
}

const SPEED = 0.12
const SLOWDOWN_MS = 12000

export default function HighlightsMarquee({
  items,
}: {
  items: HighlightItem[]
}) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const pauseRef = useRef(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let totalWidth = 0
    let loopSpeed = SPEED
    const updateWidth = () => {
      totalWidth = track.scrollWidth / 2
      loopSpeed =
        totalWidth > 0
          ? totalWidth / (totalWidth / SPEED + SLOWDOWN_MS)
          : SPEED
      return totalWidth
    }
    let offset = 0
    let prevTimestamp = 0
    let requestId: number

    updateWidth()

    const handleResize = () => {
      totalWidth = updateWidth()
    }
    window.addEventListener('resize', handleResize)

    const step = (timestamp: number) => {
      if (prevTimestamp && !pauseRef.current) {
        const delta = timestamp - prevTimestamp
        offset += loopSpeed * delta
        if (totalWidth > 0 && offset >= totalWidth) {
          offset -= totalWidth
        }
        track.style.transform = `translateX(-${offset}px)`
      }
      prevTimestamp = timestamp
      requestId = requestAnimationFrame(step)
    }

    requestId = requestAnimationFrame(step)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(requestId)
    }
  }, [items])

  const marqueeItems = [...items, ...items]

  const handleOpen = (index: number) => {
    setOpenIndex(index)
    pauseRef.current = true
  }

  const handleClose = () => {
    setOpenIndex(null)
    pauseRef.current = false
  }

  return (
    <>
      <div
        className="carousel-track-slow flex gap-5 px-6"
        ref={trackRef}
        onMouseEnter={() => {
          pauseRef.current = true
        }}
        onMouseLeave={() => {
          if (openIndex === null) {
            pauseRef.current = false
          }
        }}
      >
        {marqueeItems.map((item, index) => (
          <button
            type="button"
            key={`${item.label}-${index}`}
            onClick={() => handleOpen(index)}
            className="relative h-40 w-64 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-black/70 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          >
            {item.src && item.type === 'video' && (
              <video
                src={item.src}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            )}
            {item.src && item.type === 'image' && (
              <img src={item.src} alt={item.label} className="h-full w-full object-cover" />
            )}
            {!item.src && (
              <div
                className={`flex h-full w-full flex-col items-center justify-center text-center ${
                  item.type === 'video' ? 'bg-neutral-900 text-white' : 'bg-rose-50 text-rose-500'
                }`}
              >
                <p className="text-xs uppercase tracking-[0.3em] opacity-70">
                  {item.type === 'video' ? 'MP4' : 'Image'}
                </p>
                <p className="mt-2 text-sm font-semibold">{item.label}</p>
              </div>
            )}
          </button>
        ))}
      </div>
      {openIndex !== null && marqueeItems[openIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-6 top-6 text-white"
          >
            Close
          </button>
          <div className="max-w-3xl w-full">
            {marqueeItems[openIndex].src && marqueeItems[openIndex].type === 'video' ? (
              <video
                src={marqueeItems[openIndex].src}
                className="h-[70vh] w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : marqueeItems[openIndex].src ? (
              <img
                src={marqueeItems[openIndex].src}
                alt={marqueeItems[openIndex].label}
                className="h-[70vh] w-full object-cover"
              />
            ) : (
              <div className="h-[70vh] w-full rounded-3xl bg-neutral-900" />
            )}
          </div>
        </div>
      )}
    </>
  )
}
