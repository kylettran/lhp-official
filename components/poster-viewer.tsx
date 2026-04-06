'use client'

import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type PosterViewerProps = {
  imageUrl: string
  title: string
}

export default function PosterViewer({ imageUrl, title }: PosterViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  // Refs so event handlers never have stale closure values
  const posRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 })

  const open = useCallback(() => {
    posRef.current = { x: 0, y: 0 }
    setPosition({ x: 0, y: 0 })
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    dragRef.current.active = false
    posRef.current = { x: 0, y: 0 }
    setPosition({ x: 0, y: 0 })
    setIsDragging(false)
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  const beginDrag = useCallback((clientX: number, clientY: number) => {
    dragRef.current = {
      active: true,
      startX: clientX,
      startY: clientY,
      originX: posRef.current.x,
      originY: posRef.current.y,
    }
    setIsDragging(true)
  }, [])

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragRef.current.active) return
    const x = dragRef.current.originX + (clientX - dragRef.current.startX)
    const y = dragRef.current.originY + (clientY - dragRef.current.startY)
    posRef.current = { x, y }
    setPosition({ x, y })
  }, [])

  const endDrag = useCallback(() => {
    dragRef.current.active = false
    setIsDragging(false)
  }, [])

  const handleBackdropClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close()
  }, [close])

  return (
    <>
      <div className="mx-auto w-[80%] max-w-[560px]">
        <button
          type="button"
          onClick={open}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-[0_20px_60px_-30px_rgba(120,45,45,0.35)] transition hover:border-rose-300 hover:scale-105 w-full"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={`${title} poster`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 80vw, 448px"
              priority
            />
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/90 backdrop-blur touch-none select-none"
          role="dialog"
          aria-modal="true"
          onClick={handleBackdropClick}
          onMouseMove={(e) => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchEnd={endDrag}
          onTouchCancel={endDrag}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/60 text-lg font-bold text-white transition hover:bg-black/80 active:bg-black/90"
            aria-label="Close poster"
          >
            ✕
          </button>
          <Image
            src={imageUrl}
            alt={`${title} poster expanded`}
            width={800}
            height={1100}
            draggable={false}
            className="max-h-[85dvh] max-w-[92vw] object-contain w-auto h-auto"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            onMouseDown={(e) => { e.preventDefault(); beginDrag(e.clientX, e.clientY) }}
            onTouchStart={(e) => beginDrag(e.touches[0].clientX, e.touches[0].clientY)}
            sizes="92vw"
          />
        </div>
      )}
    </>
  )
}
