import type { Shape } from '../types/shapes'

const MAX_HISTORY = 50

export interface HistoryState {
  past: Shape[][]
  future: Shape[][]
}

export function createHistory(): HistoryState {
  return { past: [], future: [] }
}

export function pushHistory(history: HistoryState, snapshot: Shape[]): HistoryState {
  const past = [...history.past, snapshot].slice(-MAX_HISTORY)
  return { past, future: [] }
}

export function undo(
  history: HistoryState,
  current: Shape[],
): { history: HistoryState; shapes: Shape[] } | null {
  if (history.past.length === 0) return null
  const previous = history.past[history.past.length - 1]
  const past = history.past.slice(0, -1)
  const future = [current, ...history.future].slice(0, MAX_HISTORY)
  return { history: { past, future }, shapes: previous }
}

export function redo(
  history: HistoryState,
  current: Shape[],
): { history: HistoryState; shapes: Shape[] } | null {
  if (history.future.length === 0) return null
  const next = history.future[0]
  const future = history.future.slice(1)
  const past = [...history.past, current].slice(-MAX_HISTORY)
  return { history: { past, future }, shapes: next }
}
