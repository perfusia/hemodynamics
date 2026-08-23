import type { MAPStatus } from '../shared/types'

export function MAPArc({ map, status }: { map: number; status: MAPStatus }) {
  const r = 52, cx = 70, cy = 70
  const circ = 2 * Math.PI * r
  const arc = circ * 0.72
  const pct = Math.min(Math.max(map, 0), 200) / 200
  const filled = pct * arc
  return (
    <svg width="130" height="130" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8"
        strokeDasharray={`${arc} ${circ - arc}`} strokeDashoffset={circ * 0.14}
        strokeLinecap="round" transform={`rotate(126 ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={status.ring} strokeWidth="8"
        strokeDasharray={`${filled} ${circ - filled}`} strokeDashoffset={circ * 0.14}
        strokeLinecap="round" transform={`rotate(126 ${cx} ${cy})`}
        style={{ transition: 'stroke-dasharray 0.35s ease, stroke 0.35s ease' }} />
      <text x={cx} y={cy - 5} textAnchor="middle" fill="white" fontSize="30" fontWeight="300" fontFamily="ui-monospace,monospace">{map}</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="10" fontFamily="ui-sans-serif,sans-serif" letterSpacing="1">mmHg</text>
    </svg>
  )
}
