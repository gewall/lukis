import { useEditorStore } from '../store/editorStore'

const SWATCHES = ['#38bdf8', '#f87171', '#facc15', '#4ade80', '#c084fc', '#e4eaf2']

export function StyleBar() {
  const style = useEditorStore((s) => s.style)
  const setStyle = useEditorStore((s) => s.setStyle)
  const activeTool = useEditorStore((s) => s.activeTool)

  const showFill = activeTool === 'rect' || activeTool === 'ellipse'
  const showFontSize = activeTool === 'text'

  return (
    <div className="flex items-center gap-4 rounded-panel border border-line bg-surface px-4 py-2 shadow-panel">
      <div className="flex items-center gap-1.5">
        {SWATCHES.map((color) => (
          <button
            key={color}
            onClick={() => setStyle({ stroke: color })}
            className={`h-6 w-6 rounded-full border-2 transition-transform duration-150 ${
              style.stroke === color ? 'scale-110 border-accent' : 'border-line'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="h-6 w-px bg-line" />

      <label className="flex items-center gap-2 text-xs text-muted">
        Tebal
        <input
          type="range"
          min={1}
          max={20}
          value={style.strokeWidth}
          onChange={(e) => setStyle({ strokeWidth: Number(e.target.value) })}
          className="accent-accent"
        />
      </label>

      {showFill && (
        <>
          <div className="h-6 w-px bg-line" />
          <button
            onClick={() => setStyle({ fill: style.fill === 'transparent' ? style.stroke : 'transparent' })}
            className="rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-fg"
          >
            {style.fill === 'transparent' ? 'Isi: kosong' : 'Isi: warna'}
          </button>
        </>
      )}

      {showFontSize && (
        <>
          <div className="h-6 w-px bg-line" />
          <label className="flex items-center gap-2 text-xs text-muted">
            Ukuran
            <input
              type="range"
              min={12}
              max={64}
              value={style.fontSize}
              onChange={(e) => setStyle({ fontSize: Number(e.target.value) })}
              className="accent-accent"
            />
          </label>
        </>
      )}
    </div>
  )
}
