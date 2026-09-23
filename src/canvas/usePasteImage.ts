import { useEffect } from 'react'
import { useEditorStore } from '../store/editorStore'
import type { ImageShape } from '../types/shapes'

function newId() {
  return Math.random().toString(36).slice(2, 10)
}

const MAX_DIM = 900

function addImageFromFile(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    const src = reader.result as string
    const img = new window.Image()
    img.onload = () => {
      let width = img.naturalWidth
      let height = img.naturalHeight
      const scale = Math.min(1, MAX_DIM / Math.max(width, height))
      width *= scale
      height *= scale

      const { canvasSize, setCanvasSize, addShape, commit, shapes } = useEditorStore.getState()
      commit()

      const isFirstImage = shapes.length === 0
      const targetSize = isFirstImage
        ? { width: Math.max(width, 480), height: Math.max(height, 320) }
        : canvasSize

      const shape: ImageShape = {
        id: newId(),
        type: 'image',
        src,
        x: Math.max(0, (targetSize.width - width) / 2),
        y: Math.max(0, (targetSize.height - height) / 2),
        width,
        height,
        rotation: 0,
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
      }

      if (isFirstImage) {
        setCanvasSize(targetSize)
      }

      addShape(shape)
    }
    img.src = src
  }
  reader.readAsDataURL(file)
}

export function usePasteImage() {
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            e.preventDefault()
            addImageFromFile(file)
          }
          break
        }
      }
    }

    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [])

  function handleFileInput(file: File) {
    addImageFromFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      addImageFromFile(file)
    }
  }

  return { handleFileInput, handleDrop }
}
