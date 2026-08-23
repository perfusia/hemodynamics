import type { MAPStatus } from '../shared/types'
import { MONITOR } from '../shared/tokens'

/**
 * MAP gauge. Rendered inside the dark monitor panel, so it uses the monitor
 * surface colours rather than the chart-paper palette.
 */
export function MAPArc({ map, status }: { map: number; status: MAPStatus }) {
  const r = 52, cx = 70, cy = 70
  const circ = 2 * Math.PI * r
  const arc = circ * 0.72
  const pct = Math.min(Math.max(map, 0), 200) / 200
  const filled = pct * arc

  return (
    <svg width="130" height="130" viewBox="0 0 140 140" className="shrink-0"
         role="img" aria-label={`Mean arterial pressure ${map} millimetres of mercury, ${status.label}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={MONITOR.grid} strokeWidth="8"
        strokeDasharray={`${arc} ${circ - arc}`} strokeDashoffset={circ * 0.14}
        strokeLinecap="round" transform={`rotate(126 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={status.ring} strokeWidth="8"
        strokeDasharray={`${filled} ${circ - filled}`} strokeDashoffset={circ * 0.14}
        strokeLinecap="round" transform={`rotate(126 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.35s ease, stroke 0.35s ease' }} />
      <text x={cx} y={cy - 5} textAnchor="middle" fill={MONITOR.art} fontSize="32" fontWeight="600"
            fontFamily="var(--font-mono)" style={{ fontVariantNumeric: 'tabular-nums' }}>{map}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={MONITOR.label} fontSize="9"
            fontFamily="var(--font-mono)" letterSpacing="1.6">mmHg</text>
    </svg>
  )
}
