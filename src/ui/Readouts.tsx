import type { ReactNode } from 'react'
import { CH, type ChannelKey } from './palette'

export interface ReadoutItem {
  k: ReactNode
  v: ReactNode
  u?: ReactNode
  /** Channel whose color the label takes. */
  ch?: ChannelKey
  /** Optional change from a reference state, shown after the unit. */
  delta?: number
  deltaDigits?: number
}

/** Grid of monitor-style numeric readouts: label in channel color, value in ink. */
export function Readouts({ items, large = false, min = 104 }: { items: ReadoutItem[]; large?: boolean; min?: number }) {
  return (
    <div className={`readouts${large ? ' lg' : ''}`} style={{ ['--ro-min' as string]: `${min}px` }} aria-live="polite">
      {items.map((it, i) => (
        <div className="ro" key={i}>
          <div className="ro-k" style={{ color: it.ch ? CH[it.ch] : undefined }}>{it.k}</div>
          <div className="ro-v">{it.v}</div>
          {(it.u || it.delta !== undefined) && (
            <div className="ro-u">
              {it.u}
              {it.delta !== undefined && Math.abs(it.delta) >= Math.pow(10, -(it.deltaDigits ?? 0)) / 2 && (
                <span style={{ marginLeft: 6, fontWeight: 700, color: 'var(--color-ink)' }}>
                  {it.delta > 0 ? '↑' : '↓'} {Math.abs(it.delta).toFixed(it.deltaDigits ?? 0)}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
