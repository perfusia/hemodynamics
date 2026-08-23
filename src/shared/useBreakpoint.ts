import { useState, useEffect } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'

export function useBreakpoint(): Breakpoint {
  const getBreakpoint = (): Breakpoint => {
    if (typeof window === 'undefined') return 'desktop'
    if (window.innerWidth < 768)  return 'mobile'
    if (window.innerWidth < 1024) return 'tablet'
    return 'desktop'
  }

  const [bp, setBp] = useState<Breakpoint>(getBreakpoint)

  useEffect(() => {
    const handler = () => setBp(getBreakpoint())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return bp
}