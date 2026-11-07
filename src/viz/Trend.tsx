import type { Beat } from '../model/engine'
import { linear, line } from './scale'
import { CH, type ChannelKey } from '../ui/palette'

export interface TrendSeries {
  key: string
  label: string
  unit: string
  color: ChannelKey
  min: number
  max: number
  value: (b: Beat) => number
  ticks: number[]
}

export interface TrendEvent { t: number; label: string }

/**
 * Beat-by-beat trends, one panel per variable, sharing a time axis: the
 * form of an anesthesia record or an ICU trend screen.
 */
export function Trend({
  beats, series, window: win = 120, events = [], label,
}: {
  beats: Beat[]
  series: TrendSeries[]
  window?: number
  events?: TrendEvent[]
  label: string
}) {
  const W = 620
  const ph = 74
  const gap = 18
  const H = series.length * ph + (series.length - 1) * gap
  const tEnd = beats.length ? beats[beats.length - 1].t + beats[beats.length - 1].T : win
  const t0 = Math.max(0, tEnd - win)
  const sx = linear([t0, t0 + win], [0, W])
  const visible = beats.filter((b) => b.t >= t0 - 1)
  return (
    <svg viewBox={`-78 -8 ${W + 136} ${H + 42}`} role="img" aria-label={label} className="block h-auto w-full font-sans">
      {series.map((s, i) => {
        const y0 = i * (ph + gap)
        const sy = linear([s.min, s.max], [y0 + ph, y0])
        const pts: [number, number][] = visible.map((b) => [sx(b.t + b.T / 2), sy(Math.max(s.min, Math.min(s.max, s.value(b))))])
        const last = visible.length ? s.value(visible[visible.length - 1]) : NaN
        return (
          <g key={s.key}>
            <rect x={0} y={y0} width={W} height={ph} fill="var(--color-card)" />
            <path d={s.ticks.map((v) => `M0 ${sy(v).toFixed(1)}H${W}`).join('')} stroke="var(--color-grid-major)" strokeWidth={0.8} />
            {s.ticks.map((v) => <text key={v} x={-8} y={sy(v) + 4} fontSize={11} textAnchor="end" fill="var(--color-ink-3)">{v}</text>)}
            <text x={-74} y={y0 + 14} fontSize={12.5} fontWeight={700} fill={CH[s.color]}>{s.label}</text>
            <text x={-74} y={y0 + 29} fontSize={11} fill="var(--color-ink-3)">{s.unit}</text>
            <path d={line(pts)} fill="none" stroke={CH[s.color]} strokeWidth={1.9} strokeLinejoin="round" />
            {Number.isFinite(last) && (
              <text x={W + 8} y={sy(Math.max(s.min, Math.min(s.max, last))) + 4} fontSize={12} fontWeight={700} fill={CH[s.color]}>
                {last >= 100 ? Math.round(last).toLocaleString('en-US') : last.toFixed(1)}
              </text>
            )}
          </g>
        )
      })}
      {events.filter((e) => e.t >= t0 && e.t <= t0 + win).map((e, i) => (
        <g key={i}>
          <path d={`M${sx(e.t).toFixed(1)} -4V${H}`} stroke="var(--color-ink)" strokeWidth={1} strokeDasharray="3 3" />
          <text x={sx(e.t) + 4} y={H + 16} fontSize={11.5} fill="var(--color-ink-2)">{e.label}</text>
        </g>
      ))}
      <g fontSize={11} fill="var(--color-ink-3)">
        {[0, 30, 60, 90, 120].filter((v) => v <= win).map((v) => (
          <text key={v} x={sx(t0 + v)} y={H + 32} textAnchor="middle">{`${Math.round(t0 + v)} s`}</text>
        ))}
      </g>
    </svg>
  )
}
