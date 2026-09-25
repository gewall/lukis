import { useCallback, useEffect, useRef, useState } from 'react'
import type Konva from 'konva'
import { useEditorStore } from './store/editorStore'
import { CanvasStage } from './canvas/CanvasStage'
import { usePasteImage } from './canvas/usePasteImage'
import { useKeyboard } from './canvas/useKeyboard'
import { useFitSize } from './canvas/useFitSize'
import { Toolbar } from './ui/Toolbar'
import { StyleBar } from './ui/StyleBar'
import { ActionBar } from './ui/ActionBar'
import { EmptyState } from './ui/EmptyState'
import { Toast } from './ui/Toast'

export default function App() {
  const hasShapes = useEditorStore((s) => s.shapes.length > 0)
  const stageRef = useRef<Konva.Stage | null>(null)
  const fitRef = useRef<HTMLDivElement>(null)
  const fitSize = useFitSize(fitRef)
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
    <div className="relative h-dvh w-screen bg-base" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <div className="h-full w-full overflow-auto">
        <div
          ref={fitRef}
          className="flex min-h-full min-w-full items-center justify-center px-3 pt-16 pb-36 md:py-24 md:pl-32 md:pr-12"
        >
          {hasShapes ? (
            <CanvasStage stageRef={stageRef} fitSize={fitSize} />
          ) : (
            <EmptyState onFile={handleFileInput} />
          )}
        </div>
      </div>

      {hasShapes && (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-10 flex justify-center px-3 md:top-4">
          <div className="pointer-events-auto max-w-full">
            <StyleBar />
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-10 flex justify-center md:inset-x-auto md:inset-y-0 md:left-4 md:items-center">
        <div className="pointer-events-auto">
          <Toolbar />
        </div>
      </div>

      {hasShapes && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[72px] z-10 flex justify-center px-3 md:bottom-4">
          <div className="pointer-events-auto max-w-full">
            <ActionBar stageRef={stageRef} onToast={showToast} />
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  )
}
