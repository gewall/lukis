import Konva from 'konva'

function stageToBlob(stage: Konva.Stage, mimeType: 'image/png' | 'image/jpeg'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let bgLayer: Konva.Layer | null = null
    if (mimeType === 'image/jpeg') {
      bgLayer = new Konva.Layer()
      bgLayer.add(
        new Konva.Rect({ x: 0, y: 0, width: stage.width(), height: stage.height(), fill: 'white' }),
      )
      stage.add(bgLayer)
      bgLayer.moveToBottom()
    }

    stage.toCanvas({ pixelRatio: 2 }).toBlob((blob) => {
      bgLayer?.destroy()
      stage.batchDraw()
      if (blob) resolve(blob)
      else reject(new Error('Gagal membuat gambar'))
    }, mimeType, 0.95)
  })
}

export async function downloadStage(stage: Konva.Stage, format: 'png' | 'jpg') {
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png'
  const blob = await stageToBlob(stage, mimeType)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lukis-${Date.now()}.${format}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function copyStageToClipboard(stage: Konva.Stage): Promise<boolean> {
  if (!navigator.clipboard || typeof ClipboardItem === 'undefined') {
    return false
  }
  try {
    const blob = await stageToBlob(stage, 'image/png')
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    return true
  } catch {
    return false
  }
}
