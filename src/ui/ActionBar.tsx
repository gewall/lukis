import { useState } from 'react'
import { Copy, Delete, Download, Redo2, Trash2, Undo2 } from 'lucide-react'
import type Konva from 'konva'
import { useEditorStore } from '../store/editorStore'
import { copyStageToClipboard, downloadStage } from '../export/exportCanvas'

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>
  onToast: (message: string) => void
}

export function ActionBar({ stageRef, onToast }: Props) {
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const clear = useEditorStore((s) => s.clear)
  const canUndo = useEditorStore((s) => s.history.past.length > 0)
  const canRedo = useEditorStore((s) => s.history.future.length > 0)
  const hasShapes = useEditorStore((s) => s.shapes.length > 0)
  const selectedId = useEditorStore((s) => s.selectedId)
  const [format, setFormat] = useState<'png' | 'jpg'>('png')

  return (
    <div className="flex items-center gap-0.5 rounded-panel border border-line bg-surface p-1.5 shadow-panel">
      <button
        title="Undo (Ctrl+Z)"
        disabled={!canUndo}
        onClick={undo}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-raised hover:text-fg disabled:opacity-30"
      >
        <Undo2 size={16} />
      </button>
      <button
        title="Redo (Ctrl+Shift+Z)"
        disabled={!canRedo}
        onClick={redo}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-raised hover:text-fg disabled:opacity-30"
      >
        <Redo2 size={16} />
      </button>

      <div className="mx-0.5 h-6 w-px shrink-0 bg-line sm:mx-1" />

      {selectedId && (
        <button
          title="Hapus yang dipilih (Delete)"
          onClick={() => {
            const store = useEditorStore.getState()
            store.commit()
            store.removeShape(selectedId)
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-raised hover:text-danger"
        >
          <Delete size={16} />
        </button>
      )}

      <button
        title="Hapus semua"
        disabled={!hasShapes}
        onClick={() => {
          if (confirm('Hapus semua isi kanvas?')) clear()
        }}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-raised hover:text-danger disabled:opacity-30"
      >
        <Trash2 size={16} />
      </button>

      <div className="mx-0.5 h-6 w-px shrink-0 bg-line sm:mx-1" />

      <button
        title="Salin ke clipboard (Ctrl+C)"
        disabled={!hasShapes}
        onClick={async () => {
          const stage = stageRef.current
          if (!stage) return
          const ok = await copyStageToClipboard(stage)
          onToast(ok ? 'Disalin ke clipboard' : 'Browser tidak mendukung — gunakan Download')
        }}
        className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted sm:px-3 transition-colors duration-150 hover:bg-raised hover:text-fg disabled:opacity-30"
      >
        <Copy size={15} />
        <span className="hidden sm:inline">Copy</span>
      </button>

      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as 'png' | 'jpg')}
        className="h-9 rounded-lg border border-line bg-raised px-1.5 text-sm text-fg sm:px-2"
      >
        <option value="png">PNG</option>
        <option value="jpg">JPG</option>
      </select>

      <button
        title="Download (Ctrl+S)"
        disabled={!hasShapes}
        onClick={() => {
          const stage = stageRef.current
          if (stage) downloadStage(stage, format)
        }}
        className="flex h-9 items-center gap-1.5 rounded-lg bg-accent-soft px-2.5 text-sm sm:px-3 text-accent transition-colors duration-150 hover:brightness-125 disabled:opacity-30"
      >
        <Download size={15} />
        <span className="hidden sm:inline">Download</span>
      </button>
    </div>
  )
}
