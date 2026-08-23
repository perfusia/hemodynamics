import type { MAPStatus } from '../shared/types'
import { SURFACE, INK } from '../shared/tokens'

/**
 * MAP gauge, drawn as a plate figure: a hairline track with the measured
 * value swept in the severity pigment. Sits on paper, not on a monitor.
 */
export function MAPArc({ map, status }: { map: number; status: MAPStatus }) {
  const r = 50, cx = 70, cy = 70
  const circ = 2 * Math.PI * r
  const arc = circ * 0.72
  const filled = (Math.min(Math.max(map, 0), 200) / 200) * arc

  return (
    <svg width="128" height="128" viewBox="0 0 140 140" className="shrink-0"
         role="img" aria-label={`Mean arterial pressure ${map} millimetres of mercury, ${status.label}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={SURFACE.rule} strokeWidth="7"
        strokeDasharray={`${arc} ${circ - arc}`} strokeDashoffset={circ * 0.14}
        strokeLinecap="butt" transform={`rotate(126 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={status.ring} strokeWidth="7"
        strokeDasharray={`${filled} ${circ - filled}`} strokeDashoffset={circ * 0.14}
        strokeLinecap="butt" transform={`rotate(126 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray .35s ease, stroke .35s ease' }} />
      <text x={cx} y={cy - 3} textAnchor="middle" fill={INK.base} fontSize="34" fontWeight="600"
            fontFamily="var(--font-display)"
            style={{ fontVariantNumeric: 'tabular-nums lining-nums' }}>{map}</text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill={INK.faint} fontSize="8.5"
            fontFamily="var(--font-sans)" letterSpacing="2">MMHG</text>
    </svg>
  )
}
