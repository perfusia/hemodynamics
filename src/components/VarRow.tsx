import { getRangeState } from '../shared/utils'
import { STATUS } from '../shared/tokens'

interface VarRowProps {
  abbr: string
  label: string
  value: number
  unit: string
  low: number
  high: number
  description: string
}

/**
 * Reference row for a single haemodynamic variable. Lives on the chart-paper
 * surface alongside the teaching prose, not on the monitor panel.
 */
export function VarRow({ abbr, label, value, unit, low, high, description }: VarRowProps) {
  const state = getRangeState(value, low, high)
  const rangeWidth = high * 1.5 - low * 0.5
  const pct = Math.min(Math.max((value - low * 0.5) / rangeWidth, 0), 1) * 100
  const normalLow  = ((low  - low * 0.5) / rangeWidth) * 100
  const normalHigh = ((high - low * 0.5) / rangeWidth) * 100

  return (
    <div className="py-3.5 border-b border-rule/60 last:border-b-0">
      <div className="flex justify-between items-baseline mb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[11px] tracking-wider text-navy w-8">{abbr}</span>
          <span className="text-[11.5px] text-ink-soft">{label}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="tnum font-mono text-xl font-semibold text-ink">
            {Number.isInteger(value) ? value : value.toFixed(1)}
          </span>
          <span className="text-[10px] text-ink-faint">{unit}</span>
          <span className="text-[10px] font-semibold min-w-[34px] text-right" style={{ color: state.color }}>
            {state.label}
          </span>
        </div>
      </div>

      <div className="relative h-[3px] rounded-full bg-rule/70">
        <div className="absolute top-0 h-full rounded-full"
             style={{ left: `${normalLow}%`, width: `${normalHigh - normalLow}%`, background: `${STATUS.normal}33` }} />
        <div className="absolute top-1/2 w-[7px] h-[7px] rounded-full"
             style={{ left: `${pct}%`, transform: 'translate(-50%,-50%)', background: state.color,
                      boxShadow: `0 0 0 2px ${state.color}2E`, transition: 'left 0.1s' }} />
      </div>

      <div className="mt-1.5 tnum font-mono text-[10px] text-ink-faint">Normal {low}–{high} {unit}</div>
      <div className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{description}</div>
    </div>
  )
}
