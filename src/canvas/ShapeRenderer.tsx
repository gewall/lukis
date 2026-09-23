import { useEffect, useRef, useState } from 'react'
import { Arrow, Ellipse, Image as KonvaImage, Line, Rect, Text } from 'react-konva'
import type Konva from 'konva'
import type { Shape } from '../types/shapes'

interface Props {
  shape: Shape
  isSelected: boolean
  draggable: boolean
  onSelect: () => void
  onChange: (patch: Partial<Shape>) => void
  onDragCommit: () => void
  registerNode: (id: string, node: Konva.Node | null) => void
  onDblClick?: () => void
}

function useImageEl(src: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    const el = new window.Image()
    el.src = src
    el.onload = () => setImg(el)
  }, [src])
  return img
}

export function ShapeRenderer({
  shape,
  draggable,
  onSelect,
  onChange,
  onDragCommit,
  registerNode,
  onDblClick,
}: Props) {
  const ref = useRef<Konva.Node>(null)
  const imageEl = useImageEl(shape.type === 'image' ? shape.src : '')

  useEffect(() => {
    registerNode(shape.id, ref.current)
    return () => registerNode(shape.id, null)
  }, [shape.id, registerNode])

  const common = {
    id: shape.id,
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation,
    opacity: shape.opacity,
    draggable,
    onClick: onSelect,
    onTap: onSelect,
    onDblClick,
    onDblTap: onDblClick,
    onDragStart: onDragCommit,
    onTransformStart: onDragCommit,
    onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
      onChange({ x: e.target.x(), y: e.target.y() } as Partial<Shape>)
    },
  }

  if (shape.type === 'image') {
    return (
      <KonvaImage
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...common}
        image={imageEl ?? undefined}
        width={shape.width}
        height={shape.height}
        onTransformEnd={(e) => {
          const node = e.target as Konva.Image
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          node.scaleX(1)
          node.scaleY(1)
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, shape.width * scaleX),
            height: Math.max(5, shape.height * scaleY),
          } as Partial<Shape>)
        }}
      />
    )
  }

  if (shape.type === 'pen') {
    return (
      <Line
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...common}
        points={shape.points}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        lineCap="round"
        lineJoin="round"
        tension={0.4}
      />
    )
  }

  if (shape.type === 'rect') {
    return (
      <Rect
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...common}
        width={shape.width}
        height={shape.height}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        fill={shape.fill}
        cornerRadius={shape.cornerRadius}
        onTransformEnd={(e) => {
          const node = e.target as Konva.Rect
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          node.scaleX(1)
          node.scaleY(1)
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: Math.max(5, shape.width * scaleX),
            height: Math.max(5, shape.height * scaleY),
          } as Partial<Shape>)
        }}
      />
    )
  }

  if (shape.type === 'ellipse') {
    return (
      <Ellipse
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...common}
        radiusX={shape.radiusX}
        radiusY={shape.radiusY}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        fill={shape.fill}
        onTransformEnd={(e) => {
          const node = e.target as Konva.Ellipse
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()
          node.scaleX(1)
          node.scaleY(1)
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            radiusX: Math.max(5, shape.radiusX * scaleX),
            radiusY: Math.max(5, shape.radiusY * scaleY),
          } as Partial<Shape>)
        }}
      />
    )
  }

  if (shape.type === 'arrow') {
    return (
      <Arrow
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...common}
        points={shape.points}
        stroke={shape.stroke}
        fill={shape.stroke}
        strokeWidth={shape.strokeWidth}
      />
    )
  }

  if (shape.type === 'line') {
    return (
      <Line
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...common}
        points={shape.points}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        lineCap="round"
      />
    )
  }

  if (shape.type === 'text') {
    return (
      <Text
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...common}
        text={shape.text}
        fontSize={shape.fontSize}
        fill={shape.fill}
        onTransformEnd={(e) => {
          const node = e.target as Konva.Text
          const scaleX = node.scaleX()
          node.scaleX(1)
          node.scaleY(1)
          onChange({
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            fontSize: Math.max(6, shape.fontSize * scaleX),
          } as Partial<Shape>)
        }}
      />
    )
  }

  return null
}
