import { create } from 'zustand'
import type { Shape, ShapeStyle, ToolId } from '../types/shapes'
import { createHistory, pushHistory, redo, undo, type HistoryState } from './history'

interface EditorState {
  shapes: Shape[]
  selectedId: string | null
  activeTool: ToolId
  style: ShapeStyle
  history: HistoryState
  canvasSize: { width: number; height: number }

  setActiveTool: (tool: ToolId) => void
  setStyle: (style: Partial<ShapeStyle>) => void
  setSelectedId: (id: string | null) => void
  setCanvasSize: (size: { width: number; height: number }) => void

  addShape: (shape: Shape) => void
  updateShape: (id: string, patch: Partial<Shape>) => void
  removeShape: (id: string) => void
  commit: () => void
  undo: () => void
  redo: () => void
  clear: () => void
}

const defaultStyle: ShapeStyle = {
  stroke: '#38bdf8',
  strokeWidth: 4,
  fill: 'transparent',
  fontSize: 24,
  opacity: 1,
}

export const useEditorStore = create<EditorState>((set, get) => ({
  shapes: [],
  selectedId: null,
  activeTool: 'select',
  style: defaultStyle,
  history: createHistory(),
  canvasSize: { width: 960, height: 600 },

  setActiveTool: (tool) => set({ activeTool: tool, selectedId: null }),
  setStyle: (patch) => set((s) => ({ style: { ...s.style, ...patch } })),
  setSelectedId: (id) => set({ selectedId: id }),
  setCanvasSize: (size) => set({ canvasSize: size }),

  addShape: (shape) => set((s) => ({ shapes: [...s.shapes, shape] })),
  updateShape: (id, patch) =>
    set((s) => ({
      shapes: s.shapes.map((sh) => (sh.id === id ? ({ ...sh, ...patch } as Shape) : sh)),
    })),
  removeShape: (id) =>
    set((s) => ({
      shapes: s.shapes.filter((sh) => sh.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  commit: () =>
    set((s) => ({
      history: pushHistory(s.history, structuredClone(s.shapes)),
    })),

  undo: () => {
    const s = get()
    const result = undo(s.history, structuredClone(s.shapes))
    if (!result) return
    set({ history: result.history, shapes: result.shapes, selectedId: null })
  },

  redo: () => {
    const s = get()
    const result = redo(s.history, structuredClone(s.shapes))
    if (!result) return
    set({ history: result.history, shapes: result.shapes, selectedId: null })
  },

  clear: () => {
    const s = get()
    set({
      history: pushHistory(s.history, structuredClone(s.shapes)),
      shapes: [],
      selectedId: null,
    })
  },
}))
