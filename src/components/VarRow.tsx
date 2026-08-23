import { getRangeState } from '../shared/utils'

interface VarRowProps {
  abbr: string
  label: string
  value: number
  unit: string
  low: number
  high: number
  description: string
}

export function VarRow({ abbr, label, value, unit, low, high, description }: VarRowProps) {
  const state = getRangeState(value, low, high)
  const rangeWidth = high * 1.5 - low * 0.5
  const pct = Math.min(Math.max((value - low * 0.5) / rangeWidth, 0), 1) * 100
  const normalLow  = ((low  - low * 0.5) / rangeWidth) * 100
  const normalHigh = ((high - low * 0.5) / rangeWidth) * 100

  return (
    <div style={{ padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: 'ui-monospace,monospace', color: 'rgba(255,255,255,0.45)', width: 30 }}>{abbr}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ fontSize: 20, fontFamily: 'ui-monospace,monospace', fontWeight: 300, color: 'white' }}>
            {Number.isInteger(value) ? value : value.toFixed(1)}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{unit}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: state.color, minWidth: 34, textAlign: 'right' }}>{state.label}</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ position: 'absolute', top: 0, height: '100%', left: `${normalLow}%`, width: `${normalHigh - normalLow}%`, background: 'rgba(52,211,153,0.18)', borderRadius: 99 }} />
        <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)', left: `${pct}%`, width: 7, height: 7, borderRadius: '50%', background: state.color, transition: 'left 0.1s', boxShadow: `0 0 0 2px ${state.color}33` }} />
      </div>
      <div style={{ marginTop: 5, fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>Normal {low}–{high} {unit}</div>
      <div style={{ marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.55 }}>{description}</div>
    </div>
  )
}
