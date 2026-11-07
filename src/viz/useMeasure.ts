import { useEffect, useRef, useState } from 'react'

/** Width of an element in CSS pixels, updated on resize. */
export function useMeasure<T extends HTMLElement>(fallback = 600) {
  const ref = useRef<T | null>(null)
  const [width, setWidth] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const w = Math.round(el.getBoundingClientRect().width)
      if (w > 0) setWidth((old) => (Math.abs(old - w) >= 1 ? w : old))
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}
