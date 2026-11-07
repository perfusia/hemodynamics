import type { ReactNode } from 'react'
import { linear, ticks as mkTicks, type Scale } from './scale'

export interface Axis {
  domain: [number, number]
  step: number
  minor?: number
  label: ReactNode
  /** Format tick labels. */
  fmt?: (v: number) => string
}

/**
 * SVG plot frame with graticule, ticks and axis labels. Children receive the
 * x and y scales in plot coordinates. The SVG scales to its container width.
 */
export function Plot({
  w = 460, h = 340, x, y, children, label, pad = { l: 54, r: 18, t: 26, b: 50 }, background = true,
}: {
  w?: number
  h?: number
  x: Axis
  y: Axis
  children: (sx: Scale, sy: Scale) => ReactNode
  label: string
  pad?: { l: number; r: number; t: number; b: number }
  background?: boolean
}) {
  const sx = linear(x.domain, [0, w])
  const sy = linear(y.domain, [h, 0])
  const xt = mkTicks(x.domain[0], x.domain[1], x.step)
  const yt = mkTicks(y.domain[0], y.domain[1], y.step)
  const xm = x.minor ? mkTicks(x.domain[0], x.domain[1], x.minor) : []
  const ym = y.minor ? mkTicks(y.domain[0], y.domain[1], y.minor) : []
  const fx = x.fmt ?? ((v: number) => String(v))
  const fy = y.fmt ?? ((v: number) => String(v))
  return (
    <svg
      viewBox={`${-pad.l} ${-pad.t} ${w + pad.l + pad.r} ${h + pad.t + pad.b}`}
      role="img"
      aria-label={label}
      className="block h-auto w-full font-sans"
      style={{ overflow: 'visible' }}
    >
      {background && <rect x={0} y={0} width={w} height={h} fill="var(--color-card)" />}
      <path
        d={[...xm.map((v) => `M${sx(v).toFixed(1)} 0V${h}`), ...ym.map((v) => `M0 ${sy(v).toFixed(1)}H${w}`)].join('')}
        stroke="var(--color-grid)" strokeWidth={0.6} fill="none"
      />
      <path
        d={[...xt.map((v) => `M${sx(v).toFixed(1)} 0V${h}`), ...yt.map((v) => `M0 ${sy(v).toFixed(1)}H${w}`)].join('')}
        stroke="var(--color-grid-major)" strokeWidth={0.8} fill="none"
      />
      <g fontSize={12} fill="var(--color-ink-3)">
        {yt.map((v) => <text key={`y${v}`} x={-9} y={sy(v) + 4} textAnchor="end">{fy(v)}</text>)}
        {xt.map((v) => <text key={`x${v}`} x={sx(v)} y={h + 18} textAnchor="middle">{fx(v)}</text>)}
      </g>
      <text x={w / 2} y={h + 40} textAnchor="middle" fontSize={13} fill="var(--color-ink-2)">{x.label}</text>
      <text x={-pad.l + 2} y={-10} fontSize={13} fill="var(--color-ink-2)">{y.label}</text>
      {children(sx, sy)}
    </svg>
  )
}
