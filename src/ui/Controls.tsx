import { useId, type CSSProperties, type ReactNode } from 'react'

export function Button({
  children, onClick, primary = false, small = false, pressed, disabled, title,
}: {
  children: ReactNode
  onClick?: () => void
  primary?: boolean
  small?: boolean
  pressed?: boolean
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      className={`btn${primary ? ' primary' : ''}${small ? ' sm' : ''}`}
      onClick={onClick}
      aria-pressed={pressed}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  )
}

export interface Option<T extends string> { value: T; label: ReactNode; title?: string }

/** Mutually exclusive choice, drawn as a joined segmented control. */
export function Segmented<T extends string>({
  options, value, onChange, label,
}: { options: Option<T>[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} title={o.title} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Presets: separate chips, any one of which may be active (or none). */
export function Chips<T extends string>({
  options, value, onChange, label,
}: { options: Option<T>[]; value: T | null; onChange: (v: T) => void; label: string }) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <Button key={o.value} small pressed={o.value === value} onClick={() => onChange(o.value)} title={o.title}>
          {o.label}
        </Button>
      ))}
    </div>
  )
}

/**
 * Parameter slider. The value is shown with its unit; an optional reference
 * band (lo, hi) is marked under the track so the setting is read against
 * normal physiology.
 */
export function Slider({
  name, sym, value, min, max, step, unit, onChange, format, scale, band, disabled,
}: {
  name: ReactNode
  sym?: ReactNode
  value: number
  min: number
  max: number
  step: number
  unit?: ReactNode
  onChange: (v: number) => void
  format?: (v: number) => string
  /** Labels under the track: [left, middle?, right]. */
  scale?: ReactNode[]
  /** Reference range, drawn as a band on the track. */
  band?: [number, number]
  disabled?: boolean
}) {
  const uid = useId()
  const fill = ((value - min) / (max - min)) * 100
  const f = format ?? ((v: number) => String(v))
  const style = { '--fill': `${fill}%` } as CSSProperties
  return (
    <div className="slider">
      <div className="s-top">
        <label htmlFor={uid} className="s-name">
          {name}
          {sym && <span className="s-sym">{sym}</span>}
        </label>
        <span className="s-val" aria-hidden="true">
          {f(value)}
          {unit && <span className="s-unit">{unit}</span>}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        {band && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: 19, height: 3, borderRadius: 2,
              left: `${((band[0] - min) / (max - min)) * 100}%`,
              width: `${((band[1] - band[0]) / (max - min)) * 100}%`,
              background: 'color-mix(in oklab, var(--color-ok) 55%, transparent)',
            }}
          />
        )}
        <input
          id={uid}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          style={style}
          aria-valuetext={`${f(value)}${typeof unit === 'string' ? ` ${unit}` : ''}`}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </div>
      {scale && (
        <div className="s-scale" aria-hidden="true">
          {scale.map((s, i) => <span key={i}>{s}</span>)}
        </div>
      )}
    </div>
  )
}

/** Small uppercase heading inside a figure's control panel. */
export function PanelLabel({ children }: { children: ReactNode }) {
  return <div className="label" style={{ fontSize: 11.5, color: 'var(--color-ink-3)', marginBottom: 8 }}>{children}</div>
}
