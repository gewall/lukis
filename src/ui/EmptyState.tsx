import { ClipboardPaste, ImagePlus } from 'lucide-react'
import { useRef } from 'react'

interface Props {
  onFile: (file: File) => void
}

export function EmptyState({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex w-[480px] flex-col items-center gap-4 rounded-panel border border-dashed border-line bg-surface/60 px-10 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <ClipboardPaste size={26} />
      </div>
      <div>
        <p className="text-fg font-medium">Tempel gambar untuk mulai</p>
        <p className="mt-1 text-sm text-muted">
          Salin screenshot lalu tekan <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 text-xs">Ctrl+V</kbd>
        </p>
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-lg border border-line bg-raised px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-fg"
      >
        <ImagePlus size={16} />
        atau pilih berkas
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
