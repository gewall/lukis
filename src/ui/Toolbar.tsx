import { ArrowUpRight, Circle, MinusIcon, MousePointer2, Pencil, Square, Type } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import type { ToolId } from '../types/shapes'

const TOOLS: { id: ToolId; icon: typeof MousePointer2; label: string; key: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Pilih', key: 'V' },
  { id: 'pen', icon: Pencil, label: 'Pena', key: 'P' },
  { id: 'rect', icon: Square, label: 'Kotak', key: 'R' },
  { id: 'ellipse', icon: Circle, label: 'Bulat', key: 'O' },
  { id: 'arrow', icon: ArrowUpRight, label: 'Panah', key: 'A' },
  { id: 'line', icon: MinusIcon, label: 'Garis', key: 'L' },
  { id: 'text', icon: Type, label: 'Teks', key: 'T' },
]

export function Toolbar() {
  const activeTool = useEditorStore((s) => s.activeTool)
  const setActiveTool = useEditorStore((s) => s.setActiveTool)

  return (
    <div className="flex flex-col gap-1 rounded-panel border border-line bg-surface p-2 shadow-panel">
      {TOOLS.map(({ id, icon: Icon, label, key }) => (
        <button
          key={id}
          title={`${label} (${key})`}
          onClick={() => setActiveTool(id)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150 ${
            activeTool === id
              ? 'bg-accent-soft text-accent'
              : 'text-muted hover:bg-raised hover:text-fg'
          }`}
        >
          <Icon size={18} strokeWidth={2} />
        </button>
      ))}
    </div>
  )
}
