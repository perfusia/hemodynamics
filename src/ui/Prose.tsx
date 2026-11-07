import { useState, type ReactNode } from 'react'

/**
 * Margin note. On wide screens it floats into the right margin beside the
 * line that cites it; on narrow screens its number becomes a button that
 * opens the note inline. Numbering is automatic (CSS counters).
 */
export function Note({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className="sn-ref"
        aria-expanded={open}
        aria-label="Margin note"
        onClick={() => setOpen((o) => !o)}
      />
      <span className="sidenote" data-open={open} role="note">
        {children}
      </span>
    </>
  )
}

/** First use of a defined term. */
export function Term({ children }: { children: ReactNode }) {
  return <dfn className="term">{children}</dfn>
}

/** Numbered aside: clinical correlates, model notes, worked examples. */
export function Box({ n, kind, title, children }: { n: string; kind: string; title?: string; children: ReactNode }) {
  return (
    <aside className="box" aria-label={`Box ${n}`}>
      <div className="box-head label">
        <span>Box {n}</span>
        <span className="kind">{kind}</span>
      </div>
      {title && <p className="font-sans" style={{ fontWeight: 600, fontSize: 17, marginBottom: 6 }}>{title}</p>}
      {children}
    </aside>
  )
}

/** Worked example with a numbered heading. */
export function Worked({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <Box n={n} kind="Worked example" title={title}>
      {children}
    </Box>
  )
}

/** A small section label with a heavy rule, used outside lessons. */
export function Rubric({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="label m-0 border-t-2 border-ink pt-3">
      {children}
    </h2>
  )
}
