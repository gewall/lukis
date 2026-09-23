import { useRef } from 'react'
import type Konva from 'konva'
import { useEditorStore } from '../store/editorStore'
import type { Shape } from '../types/shapes'

function newId() {
  return Math.random().toString(36).slice(2, 10)
}

export function useDrawing() {
  const draftId = useRef<string | null>(null)
  const startPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const shiftHeld = useRef(false)

  const { updateShape, setSelectedId, setActiveTool } = useEditorStore.getState()

  function handlePointerDown(e: Konva.KonvaEventObject<PointerEvent>) {
    const stage = e.target.getStage()
    if (!stage) return
    // Only start a new shape when clicking on empty canvas area
    if (e.target !== stage) return

    const tool = useEditorStore.getState().activeTool
    if (tool === 'select' || tool === 'text') return

    const pos = stage.getPointerPosition()
    if (!pos) return

    useEditorStore.getState().setSelectedId(null)
    useEditorStore.getState().commit()

    const s = useEditorStore.getState().style
    const id = newId()
    draftId.current = id
    startPoint.current = pos

    const base = {
      id,
      x: 0,
      y: 0,
      rotation: 0,
      stroke: s.stroke,
      strokeWidth: s.strokeWidth,
      opacity: s.opacity,
    }

    let shape: Shape
    switch (tool) {
      case 'pen':
        shape = { ...base, type: 'pen', points: [pos.x, pos.y] }
        break
      case 'rect':
        shape = { ...base, x: pos.x, y: pos.y, type: 'rect', width: 1, height: 1, fill: s.fill, cornerRadius: 4 }
        break
      case 'ellipse':
        shape = { ...base, x: pos.x, y: pos.y, type: 'ellipse', radiusX: 1, radiusY: 1, fill: s.fill }
        break
      case 'arrow':
        shape = { ...base, type: 'arrow', points: [pos.x, pos.y, pos.x, pos.y] }
        break
      case 'line':
        shape = { ...base, type: 'line', points: [pos.x, pos.y, pos.x, pos.y] }
        break
      default:
        return
    }

    useEditorStore.getState().addShape(shape)
  }

  function handlePointerMove(e: Konva.KonvaEventObject<PointerEvent>) {
    const id = draftId.current
    if (!id) return
    const stage = e.target.getStage()
    if (!stage) return
    const pos = stage.getPointerPosition()
    if (!pos) return

    const tool = useEditorStore.getState().activeTool
    const start = startPoint.current
    const shift = e.evt.shiftKey

    if (tool === 'pen') {
      const shapes = useEditorStore.getState().shapes
      const current = shapes.find((sh) => sh.id === id)
      if (current && current.type === 'pen') {
        const points = current.points
        const lastX = points[points.length - 2]
        const lastY = points[points.length - 1]
        const dx = pos.x - lastX
        const dy = pos.y - lastY
        if (dx * dx + dy * dy > 4) {
          updateShape(id, { points: [...points, pos.x, pos.y] } as Partial<Shape>)
        }
      }
      return
    }

    if (tool === 'rect') {
      let w = pos.x - start.x
      let h = pos.y - start.y
      if (shift) {
        const size = Math.max(Math.abs(w), Math.abs(h))
        w = Math.sign(w || 1) * size
        h = Math.sign(h || 1) * size
      }
      updateShape(id, {
        x: w < 0 ? start.x + w : start.x,
        y: h < 0 ? start.y + h : start.y,
        width: Math.abs(w) || 1,
        height: Math.abs(h) || 1,
      } as Partial<Shape>)
      return
    }

    if (tool === 'ellipse') {
      let rx = pos.x - start.x
      let ry = pos.y - start.y
      if (shift) {
        const size = Math.max(Math.abs(rx), Math.abs(ry))
        rx = Math.sign(rx || 1) * size
        ry = Math.sign(ry || 1) * size
      }
      updateShape(id, {
        x: start.x + rx / 2,
        y: start.y + ry / 2,
        radiusX: Math.abs(rx) / 2 || 1,
        radiusY: Math.abs(ry) / 2 || 1,
      } as Partial<Shape>)
      return
    }

    if (tool === 'arrow' || tool === 'line') {
      let ex = pos.x
      let ey = pos.y
      if (shift) {
        const dx = pos.x - start.x
        const dy = pos.y - start.y
        const angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4)
        const dist = Math.hypot(dx, dy)
        ex = start.x + Math.cos(angle) * dist
        ey = start.y + Math.sin(angle) * dist
      }
      updateShape(id, { points: [start.x, start.y, ex, ey] } as Partial<Shape>)
      return
    }
  }

  function handlePointerUp() {
    const id = draftId.current
    if (!id) return
    draftId.current = null
    setActiveTool('select')
    setSelectedId(id)
  }

  return { handlePointerDown, handlePointerMove, handlePointerUp, shiftHeld }
}
