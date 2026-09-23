export type ToolId =
  | 'select'
  | 'pen'
  | 'rect'
  | 'ellipse'
  | 'arrow'
  | 'line'
  | 'text'

interface BaseShape {
  id: string
  x: number
  y: number
  rotation: number
  stroke: string
  strokeWidth: number
  opacity: number
}

export interface ImageShape extends BaseShape {
  type: 'image'
  src: string
  width: number
  height: number
}

export interface PenShape extends BaseShape {
  type: 'pen'
  points: number[]
}

export interface RectShape extends BaseShape {
  type: 'rect'
  width: number
  height: number
  fill: string
  cornerRadius: number
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse'
  radiusX: number
  radiusY: number
  fill: string
}

export interface ArrowShape extends BaseShape {
  type: 'arrow'
  points: number[]
}

export interface LineShape extends BaseShape {
  type: 'line'
  points: number[]
}

export interface TextShape extends BaseShape {
  type: 'text'
  text: string
  fontSize: number
  fill: string
}

export type Shape =
  | ImageShape
  | PenShape
  | RectShape
  | EllipseShape
  | ArrowShape
  | LineShape
  | TextShape

export interface ShapeStyle {
  stroke: string
  strokeWidth: number
  fill: string
  fontSize: number
  opacity: number
}
