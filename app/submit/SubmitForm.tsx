'use client'

import { useActionState, useRef, useState } from 'react'
import { submitArtistApplication, type SubmitState } from './actions'
import { UploadCloud, Music, CheckCircle2, AlertCircle, X } from 'lucide-react'

const initialState: SubmitState = { status: 'idle' }

export default function SubmitForm() {
  const [state, formAction, isPending] = useActionState(submitArtistApplication, initialState)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleFile(file: File | null) {
    if (!file) return
    setSelectedFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0] ?? null
    handleFile(file)
    if (fileInputRef.current && file) {
      const dt = new DataTransfer()
      dt.items.add(file)
      fileInputRef.current.files = dt.files
    }
  }

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur">
        <CheckCircle2 className="h-14 w-14 text-[#78bfff]" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Submission received!</h2>
          <p className="text-white/60">
            We&apos;ve got your music and will be in touch. Keep creating.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedFile(null)
            formRef.current?.reset()
            window.location.reload()
          }}
          className="mt-2 rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Error banner */}
      {state.status === 'error' && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Name row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First Name" name="firstName" placeholder="Jordan" required />
        <Field label="Last Name" name="lastName" placeholder="Rivera" required />
      </div>

      {/* Instagram */}
      <Field
        label="Instagram Handle"
        name="instagram"
        placeholder="@yourhandle"
        required
      />

      {/* Email */}
      <Field
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
      />

      {/* Phone */}
      <Field
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="(555) 000-0000"
        required
      />

      {/* File Upload */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-[0.25em] text-[#8fb0ff]">
          Your Music / Art File <span className="text-rose-400">*</span>
        </label>

        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          className={`relative flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
            dragOver
              ? 'border-[#78bfff]/70 bg-[#78bfff]/5'
              : selectedFile
              ? 'border-[#78bfff]/40 bg-[#78bfff]/5'
              : 'border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5'
          }`}
        >
          {selectedFile ? (
            <>
              <Music className="h-10 w-10 text-[#78bfff]" />
              <div className="space-y-1">
                <p className="font-semibold text-white">{selectedFile.name}</p>
                <p className="text-sm text-white/50">
                  {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="absolute right-3 top-3 rounded-full p-1 text-white/40 transition hover:text-white"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <UploadCloud className="h-10 w-10 text-white/30" />
              <div className="space-y-1">
                <p className="font-medium text-white/70">
                  Drop your file here or{' '}
                  <span className="text-[#8fb0ff] underline underline-offset-2">browse</span>
                </p>
                <p className="text-xs text-white/40">MP3 or MP4 only · Max 25 MB</p>
              </div>
            </>
          )}
        </div>

        {/* Hidden actual file input */}
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept=".mp3,.mp4,audio/mpeg,video/mp4"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-rose-500 py-4 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-rose-900/40 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Submitting…' : 'Submit My Work'}
      </button>

      <p className="text-center text-xs text-white/30">
        By submitting you agree to let Lion Heart Productions review your work.
      </p>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-xs font-semibold uppercase tracking-[0.25em] text-[#8fb0ff]"
      >
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#78bfff]/50 focus:bg-white/8 focus:ring-1 focus:ring-[#78bfff]/30"
      />
    </div>
  )
}
