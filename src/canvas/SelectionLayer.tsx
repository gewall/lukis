import { useEffect, useRef } from 'react'
import { Transformer } from 'react-konva'
import type Konva from 'konva'

interface Props {
  selectedNode: Konva.Node | null
}

const coarsePointer = window.matchMedia('(pointer: coarse)').matches

export function SelectionLayer({ selectedNode }: Props) {
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    const tr = trRef.current
    if (!tr) return
    if (selectedNode) {
      tr.nodes([selectedNode])
      tr.getLayer()?.batchDraw()
    } else {
      tr.nodes([])
    }
  }, [selectedNode])

  return (
    <Transformer
      ref={trRef}
      rotateAnchorOffset={coarsePointer ? 32 : 24}
      borderStroke="#38bdf8"
      anchorStroke="#38bdf8"
      anchorFill="#0b0f14"
      anchorSize={coarsePointer ? 16 : 9}
      borderStrokeWidth={1.5}
      flipEnabled={false}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) return oldBox
        return newBox
      }}
    />
  )
}
