import { useEffect, useState } from 'react'

export interface FitSize {
  width: number
  height: number
}

// Space available for the canvas: the scroll viewport minus the padding reserved for the floating bars.
export function useFitSize(ref: React.RefObject<HTMLElement | null>): FitSize {
  const [size, setSize] = useState<FitSize>({ width: Infinity, height: Infinity })

  useEffect(() => {
    const el = ref.current
    const viewport = el?.parentElement
    if (!el || !viewport) return

    function measure() {
      const cs = getComputedStyle(el!)
      setSize({
        width: viewport!.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
        height: viewport!.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom),
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewport)
    return () => ro.disconnect()
  }, [ref])

  return size
}
