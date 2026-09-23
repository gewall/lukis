import { useEffect } from 'react'
import type Konva from 'konva'
import { useEditorStore } from '../store/editorStore'
import { copyStageToClipboard, downloadStage } from '../export/exportCanvas'
import type { ToolId } from '../types/shapes'

const TOOL_KEYS: Record<string, ToolId> = {
  v: 'select',
  p: 'pen',
  r: 'rect',
  o: 'ellipse',
  a: 'arrow',
  l: 'line',
  t: 'text',
}

interface Options {
  stageRef: React.RefObject<Konva.Stage | null>
  onToast: (message: string) => void
}

export function useKeyboard({ stageRef, onToast }: Options) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      const store = useEditorStore.getState()
      const mod = e.ctrlKey || e.metaKey

      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) store.redo()
        else store.undo()
        return
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        store.redo()
        return
      }
      if (mod && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        const stage = stageRef.current
        if (stage) {
          copyStageToClipboard(stage).then((ok) => {
            onToast(ok ? 'Disalin ke clipboard' : 'Browser tidak mendukung — gunakan Download')
          })
        }
        return
      }
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault()
        const stage = stageRef.current
        if (stage) downloadStage(stage, 'png')
        return
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (store.selectedId) {
          e.preventDefault()
          store.commit()
          store.removeShape(store.selectedId)
        }
        return
      }
      if (e.key === 'Escape') {
        store.setSelectedId(null)
        return
      }

      const tool = TOOL_KEYS[e.key.toLowerCase()]
      if (tool) {
        store.setActiveTool(tool)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [stageRef, onToast])
}
