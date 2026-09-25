import { useCallback, useEffect, useRef, useState } from 'react'
import { Layer, Stage } from 'react-konva'
import type Konva from 'konva'
import { useEditorStore } from '../store/editorStore'
import { ShapeRenderer } from './ShapeRenderer'
import { SelectionLayer } from './SelectionLayer'
import { useDrawing } from './useDrawing'
import type { Shape, TextShape } from '../types/shapes'
import type { FitSize } from './useFitSize'

interface Props {
  stageRef: React.RefObject<Konva.Stage | null>
  fitSize: FitSize
}

function newId() {
  return Math.random().toString(36).slice(2, 10)
}

export function CanvasStage({ stageRef, fitSize }: Props) {
  const shapes = useEditorStore((s) => s.shapes)
  const selectedId = useEditorStore((s) => s.selectedId)
  const activeTool = useEditorStore((s) => s.activeTool)
  const canvasSize = useEditorStore((s) => s.canvasSize)
  const style = useEditorStore((s) => s.style)
  const setSelectedId = useEditorStore((s) => s.setSelectedId)
  const setActiveTool = useEditorStore((s) => s.setActiveTool)
  const updateShape = useEditorStore((s) => s.updateShape)
  const addShape = useEditorStore((s) => s.addShape)
  const commit = useEditorStore((s) => s.commit)

  // Shrink the stage to fit small screens; shapes keep full-resolution coordinates.
  const scale = Math.max(0.1, Math.min(1, fitSize.width / canvasSize.width, fitSize.height / canvasSize.height))

  const nodesRef = useRef<Map<string, Konva.Node>>(new Map())
  const [, forceUpdate] = useState(0)
  const [editing, setEditing] = useState<{ id: string; x: number; y: number; value: string; isNew: boolean } | null>(
    null,
  )

  const { handlePointerDown, handlePointerMove, handlePointerUp } = useDrawing()

  const registerNode = useCallback((id: string, node: Konva.Node | null) => {
    if (node) nodesRef.current.set(id, node)
    else nodesRef.current.delete(id)
    forceUpdate((n) => n + 1)
  }, [])

  const selectedNode = selectedId ? nodesRef.current.get(selectedId) ?? null : null
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!editing) return
    // Konva's stage container grabs focus on pointerdown; steal it back on the next tick.
    const raf = requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.select()
    })
    return () => cancelAnimationFrame(raf)
  }, [editing?.id])

  function startTextEdit(id: string, x: number, y: number, value: string, isNew: boolean) {
    setEditing({ id, x, y, value, isNew })
  }

  function commitTextEdit() {
    if (!editing) return
    const { id, value, isNew } = editing
    setEditing(null)
    if (!value.trim()) {
      if (!isNew) {
        commit()
        useEditorStore.getState().removeShape(id)
      }
      return
    }
    if (isNew) {
      updateShape(id, { text: value } as Partial<Shape>)
      setSelectedId(id)
    } else {
      commit()
      updateShape(id, { text: value } as Partial<Shape>)
    }
  }

  return (
    <div
      className="checkerboard rounded-panel shadow-panel overflow-hidden border border-line relative"
      style={{ width: canvasSize.width * scale, height: canvasSize.height * scale, touchAction: 'none' }}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width * scale}
        height={canvasSize.height * scale}
        scaleX={scale}
        scaleY={scale}
        onPointerDown={(e) => {
          const stage = e.target.getStage()
          if (activeTool === 'text' && e.target === stage && stage) {
            const pos = stage.getRelativePointerPosition()
            if (!pos) return
            commit()
            const id = newId()
            const shape: TextShape = {
              id,
              type: 'text',
              text: '',
              x: pos.x,
              y: pos.y,
              rotation: 0,
              stroke: 'transparent',
              strokeWidth: 0,
              opacity: 1,
              fontSize: style.fontSize,
              fill: style.stroke,
            }
            addShape(shape)
            startTextEdit(id, pos.x, pos.y, '', true)
            return
          }
          if (activeTool === 'select' && e.target === stage) {
            setSelectedId(null)
          }
          handlePointerDown(e)
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
      >
        <Layer listening={activeTool === 'select'}>
          {shapes.filter((shape) => shape.id !== editing?.id).map((shape: Shape) => (
            <ShapeRenderer
              key={shape.id}
              shape={shape}
              isSelected={shape.id === selectedId}
              draggable={activeTool === 'select'}
              onSelect={() => {
                if (activeTool === 'select') setSelectedId(shape.id)
              }}
              onChange={(patch) => updateShape(shape.id, patch)}
              onDragCommit={commit}
              registerNode={registerNode}
              onDblClick={() => {
                if (shape.type === 'text' && activeTool === 'select') {
                  setActiveTool('select')
                  startTextEdit(shape.id, shape.x, shape.y, shape.text, false)
                }
              }}
            />
          ))}
          <SelectionLayer selectedNode={activeTool === 'select' ? selectedNode : null} />
        </Layer>
      </Stage>

      {editing && (
        <textarea
          ref={textareaRef}
          value={editing.value}
          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
          onBlur={commitTextEdit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditing(null)
              return
            }
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              commitTextEdit()
            }
          }}
          style={{
            position: 'absolute',
            left: editing.x * scale,
            top: editing.y * scale,
            fontSize: style.fontSize * scale,
            color: style.stroke,
            lineHeight: 1.2,
            minWidth: 80,
          }}
          className="bg-transparent border border-accent/60 rounded px-1 outline-none resize-none"
        />
      )}
    </div>
  )
}
