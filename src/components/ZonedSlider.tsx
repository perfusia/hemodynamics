import { getRangeState } from '../shared/utils'
import { STATUS } from '../shared/tokens'

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

/**
 * Slider with the normal clinical range shaded into the track, so the value is
 * always read against its reference range rather than in isolation.
 */
export function ZonedSlider({ label, abbr, value, min, max, step, unit, onChange, low, high }: ZonedSliderProps) {
  const total   = max - min
  const lowPct  = ((low  - min) / total) * 100
  const highPct = ((high - min) / total) * 100
  const valPct  = ((value - min) / total) * 100
  const state   = getRangeState(value, low, high)

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-[11px] tracking-wider text-navy">{abbr}</span>
          <span className="text-ink-faint">·</span>
          <span className="text-[11.5px] text-ink-soft">{label}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="tnum font-mono text-[15px] font-semibold text-ink">
            {step < 1 ? value.toFixed(1) : value}
          </span>
          <span className="text-[10px] text-ink-faint">{unit}</span>
          <span className="text-[10px] font-semibold" style={{ color: state.color }}>{state.label}</span>
        </div>
      </div>

      <div className="relative h-1.5 rounded-full">
        <div className="absolute inset-0 flex overflow-hidden rounded-full">
          <div style={{ width: `${lowPct}%`,           background: `${STATUS.warn}2E`   }} />
          <div style={{ width: `${highPct - lowPct}%`, background: `${STATUS.normal}3D` }} />
          <div style={{ flex: 1,                       background: `${STATUS.warn}2E`   }} />
        </div>
        <div className="absolute -top-1 -bottom-1 w-px bg-rule" style={{ left: `${lowPct}%`  }} />
        <div className="absolute -top-1 -bottom-1 w-px bg-rule" style={{ left: `${highPct}%` }} />
        <div className="pointer-events-none absolute top-1/2 z-20 h-3.5 w-3.5 rounded-full border-2 bg-paper"
             style={{ left: `${valPct}%`, transform: 'translate(-50%,-50%)',
                      borderColor: state.color, transition: 'left 0.06s' }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          aria-label={`${label} in ${unit}`}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 z-30 w-full cursor-pointer opacity-0"
        />
      </div>

      <div className="tnum relative flex justify-between font-mono text-[9.5px] text-ink-faint">
        <span>{min}</span>
        <span className="absolute" style={{ left: `${lowPct}%`,  transform: 'translateX(-50%)', color: STATUS.normal }}>{low}</span>
        <span className="absolute" style={{ left: `${highPct}%`, transform: 'translateX(-50%)', color: STATUS.normal }}>{high}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
