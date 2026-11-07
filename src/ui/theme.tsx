import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeCtx, type ThemeChoice } from './themeContext'

const KEY = 'hemolab.theme'

function readStored(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark' || v === 'auto') return v
  } catch { /* storage unavailable */ }
  return 'auto'
}

function systemDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Applies the theme to <html> in a layout effect, so that every child's
 * passive effect (canvas figures re-reading the palette) sees the new colors.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(readStored)
  const [sysDark, setSysDark] = useState<boolean>(systemDark)

  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const h = () => setSysDark(mq.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const resolved: 'light' | 'dark' = choice === 'auto' ? (sysDark ? 'dark' : 'light') : choice

  useLayoutEffect(() => {
    const el = document.documentElement
    if (choice === 'auto') el.removeAttribute('data-theme')
    else el.setAttribute('data-theme', choice)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#0c1014' : '#fafbfb')
  }, [choice, resolved])

  const setChoice = useCallback((c: ThemeChoice) => {
    setChoiceState(c)
    try { localStorage.setItem(KEY, c) } catch { /* storage unavailable */ }
  }, [])

  const value = useMemo(() => ({ choice, resolved, setChoice }), [choice, resolved, setChoice])
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}
