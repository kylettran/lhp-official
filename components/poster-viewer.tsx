'use client'

import { MouseEvent, useCallback, useEffect, useState } from 'react'

type PosterViewerProps = {
  imageUrl: string
  title: string
}

export default function PosterViewer({ imageUrl, title }: PosterViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        close()
      }
    },
    [close]
  )

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="group relative cursor-grab active:cursor-grabbing overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-[0_20px_60px_-30px_rgba(120,45,45,0.35)] transition hover:border-rose-300 hover:scale-105"
      >
        <img
          src={imageUrl}
          alt={`${title} poster`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex cursor-grab active:cursor-grabbing items-center justify-center bg-neutral-900/90 backdrop-blur"
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-6 top-6 z-50 cursor-grab active:cursor-grabbing rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/60"
            aria-label="Close poster"
          >
            X
          </button>
          <img
            src={imageUrl}
            alt={`${title} poster expanded`}
            className="mx-auto max-h-[90vh] max-w-[90vw] cursor-grab active:cursor-grabbing object-contain"
          />
        </div>
      )}
    </>
  )
}
