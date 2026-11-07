import type { ReactNode } from 'react'

/**
 * A numbered figure plate. Interactive figures carry a badge; `actions`
 * holds figure-level buttons (Reset, Pause). The caption is part of the
 * figure, as in print.
 */
export function Figure({
  n, title, interactive = false, actions, caption, children, id,
}: {
  n: string
  title: ReactNode
  interactive?: boolean
  actions?: ReactNode
  caption?: ReactNode
  children: ReactNode
  id?: string
}) {
  return (
    <figure className="figure" id={id ?? `fig-${n}`} aria-label={`Figure ${n}`}>
      <div className="fig-head">
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
          <span className="label" style={{ fontSize: 13, letterSpacing: '0.06em' }}>Figure {n}</span>
          {interactive && <span className="badge">Interactive</span>}
          <span className="text-[15.5px] font-medium">{title}</span>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="fig-body">{children}</div>
      {caption && (
        <figcaption>
          <span className="fig-label">Figure {n}.</span> {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** Two-column figure layout: plot left, controls right; stacks when narrow. */
export function FigGrid({ children, aside, asideWidth = 300 }: { children: ReactNode; aside: ReactNode; asideWidth?: number }) {
  return (
    <div className="flex flex-wrap gap-x-7 gap-y-5">
      <div className="min-w-0" style={{ flex: '1 1 420px' }}>{children}</div>
      <div className="flex min-w-0 flex-col gap-4 font-sans" style={{ flex: `1 1 ${asideWidth}px`, maxWidth: 420 }}>{aside}</div>
    </div>
  )
}
