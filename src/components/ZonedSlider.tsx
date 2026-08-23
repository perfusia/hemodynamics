import { getRangeState } from '../shared/utils'

interface ZonedSliderProps {
  label: string
  abbr: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
  low: number
  high: number
}

export function ZonedSlider({ label, abbr, value, min, max, step, unit, onChange, low, high }: ZonedSliderProps) {
  const total   = max - min
  const lowPct  = ((low  - min) / total) * 100
  const highPct = ((high - min) / total) * 100
  const valPct  = ((value - min) / total) * 100
  const state   = getRangeState(value, low, high)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span style={{ fontSize: 11, fontFamily: 'ui-monospace,monospace', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)' }}>{abbr}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', margin: '0 5px' }}>·</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ fontSize: 15, fontFamily: 'ui-monospace,monospace', color: 'white', fontWeight: 300 }}>
            {step < 1 ? value.toFixed(1) : value}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>{unit}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: state.color }}>{state.label}</span>
        </div>
      </div>

      <div style={{ position: 'relative', height: 6, borderRadius: 99 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${lowPct}%`,            background: 'rgba(239,68,68,0.22)' }} />
          <div style={{ width: `${highPct - lowPct}%`, background: 'rgba(52,211,153,0.18)' }} />
          <div style={{ flex: 1,                        background: 'rgba(239,68,68,0.22)' }} />
        </div>
        <div style={{ position: 'absolute', top: -3, bottom: -3, width: 1, left: `${lowPct}%`,  background: 'rgba(255,255,255,0.12)' }} />
        <div style={{ position: 'absolute', top: -3, bottom: -3, width: 1, left: `${highPct}%`, background: 'rgba(255,255,255,0.12)' }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${valPct}%`,
          transform: 'translate(-50%, -50%)',
          width: 14, height: 14, borderRadius: '50%',
          background: 'white',
          boxShadow: `0 0 0 3px ${state.color}55, 0 1px 4px rgba(0,0,0,0.4)`,
          transition: 'left 0.06s',
          zIndex: 2,
        }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', opacity: 0, cursor: 'pointer', zIndex: 3 }} />
      </div>

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)' }}>{min}</span>
        <span style={{ position: 'absolute', left: `${lowPct}%`,  transform: 'translateX(-50%)', fontSize: 9, color: 'rgba(52,211,153,0.45)' }}>{low}</span>
        <span style={{ position: 'absolute', left: `${highPct}%`, transform: 'translateX(-50%)', fontSize: 9, color: 'rgba(52,211,153,0.45)' }}>{high}</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)' }}>{max}</span>
      </div>
    </div>
  )
}
