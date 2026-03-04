'use client'

import { MouseEvent, useCallback, useEffect, useState } from 'react'

type GalleryImage = {
  asset?: {
    url?: string
  }
}

export default function EventGallery({
  images,
}: {
  images: GalleryImage[]
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const close = useCallback(() => setOpenIndex(null), [])
  const open = useCallback((index: number) => {
    setOpenIndex(index)
  }, [])

  const totalImages = images.length

  const goNext = useCallback(() => {
    if (totalImages === 0) {
      return
    }
    setOpenIndex((prev) => {
      if (prev === null) return 0
      return (prev + 1) % totalImages
    })
  }, [totalImages])

  const goPrev = useCallback(() => {
    if (totalImages === 0) {
      return
    }
    setOpenIndex((prev) => {
      if (prev === null) return 0
      return (prev - 1 + totalImages) % totalImages
    })
  }, [totalImages])

  const currentImage = openIndex !== null ? images[openIndex]?.asset?.url : null

  useEffect(() => {
    if (openIndex === null) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [openIndex, close, goNext, goPrev])

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => {
          const url = image?.asset?.url
          if (!url) {
            return (
              <div
                key={`gallery-placeholder-${index}`}
                className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-[#fff5f7] text-sm text-neutral-400"
              >
                Add photo
              </div>
            )
          }

          return (
            <button
              key={`gallery-image-${index}`}
              type="button"
              className="group relative cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl border border-rose-100 bg-white transition hover:border-rose-200"
              onClick={() => open(index)}
            >
              <img
                src={url}
                alt={`Gallery image ${index + 1}`}
                className="h-64 w-full cursor-grab active:cursor-grabbing object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="sr-only">Open gallery image</span>
            </button>
          )
        })}
      </div>

      {currentImage && (
        <div
          className="fixed inset-0 z-40 flex cursor-grab active:cursor-grabbing items-center justify-center bg-neutral-900/90 backdrop-blur"
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-6 top-6 z-50 cursor-grab active:cursor-grabbing rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-black/60"
            aria-label="Close gallery"
          >
            X
          </button>
          <img
            src={currentImage}
            alt="Expanded gallery"
            className="mx-auto max-h-[90vh] max-w-[90vw] cursor-grab object-contain"
          />
        </div>
      )}
    </>
  )
}
