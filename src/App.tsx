import { useCallback, useEffect, useRef, useState } from 'react'
import type Konva from 'konva'
import { useEditorStore } from './store/editorStore'
import { CanvasStage } from './canvas/CanvasStage'
import { usePasteImage } from './canvas/usePasteImage'
import { useKeyboard } from './canvas/useKeyboard'
import { Toolbar } from './ui/Toolbar'
import { StyleBar } from './ui/StyleBar'
import { ActionBar } from './ui/ActionBar'
import { EmptyState } from './ui/EmptyState'
import { Toast } from './ui/Toast'

export default function App() {
  const hasShapes = useEditorStore((s) => s.shapes.length > 0)
  const stageRef = useRef<Konva.Stage | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const { handleFileInput, handleDrop } = usePasteImage()

  const showToast = useCallback((message: string) => {
    setToast(message)
  }, [])

  useKeyboard({ stageRef, onToast: showToast })

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <div className="relative h-screen w-screen bg-base" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <div className="h-full w-full overflow-auto">
        <div className="flex min-h-full min-w-full items-center justify-center py-24 pl-32 pr-12">
          {hasShapes ? <CanvasStage stageRef={stageRef} /> : <EmptyState onFile={handleFileInput} />}
        </div>
      </div>

      {hasShapes && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-10 flex justify-center">
          <div className="pointer-events-auto">
            <StyleBar />
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-y-0 left-4 z-10 flex items-center">
        <div className="pointer-events-auto">
          <Toolbar />
        </div>
      </div>

      {hasShapes && (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-10 flex justify-center">
          <div className="pointer-events-auto">
            <ActionBar stageRef={stageRef} onToast={showToast} />
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  )
}
