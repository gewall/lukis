import { ClipboardPaste, ImagePlus } from 'lucide-react'
import { useRef } from 'react'

interface Props {
  onFile: (file: File) => void
}

export function EmptyState({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex w-full max-w-[480px] flex-col items-center gap-4 rounded-panel border border-dashed border-line bg-surface/60 px-6 py-10 text-center md:px-10 md:py-14">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <ClipboardPaste size={26} />
      </div>
      <div>
        <p className="text-fg font-medium">
          <span className="md:hidden">Pilih gambar untuk mulai</span>
          <span className="hidden md:inline">Tempel gambar untuk mulai</span>
        </p>
        <p className="mt-1 text-sm text-muted md:hidden">Ambil dari galeri atau file di HP-mu</p>
        <p className="mt-1 hidden text-sm text-muted md:block">
          Salin screenshot lalu tekan <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 text-xs">Ctrl+V</kbd>
        </p>
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-lg border border-line bg-raised px-3 py-2 text-sm text-muted transition-colors duration-150 hover:text-fg"
      >
        <ImagePlus size={16} />
        <span className="md:hidden">Pilih gambar</span>
        <span className="hidden md:inline">atau pilih berkas</span>
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
