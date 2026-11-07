import temml from 'temml'
import { useMemo } from 'react'

const cache = new Map<string, string>()

function render(tex: string, display: boolean): string {
  const key = (display ? 'D:' : 'I:') + tex
  let html = cache.get(key)
  if (html === undefined) {
    try {
      html = temml.renderToString(tex, { displayMode: display, throwOnError: false })
    } catch {
      html = tex
    }
    cache.set(key, html)
  }
  return html
}

/** Inline mathematics from TeX, rendered to MathML. */
export function M({ t }: { t: string }) {
  const html = useMemo(() => render(t, false), [t])
  return <span className="m" dangerouslySetInnerHTML={{ __html: html }} />
}

/**
 * Display equation with a right-aligned number. `n` is the label shown in
 * parentheses, `id` lets the text link to it.
 */
export function Eq({ t, n, id, ruled = false }: { t: string; n?: string; id?: string; ruled?: boolean }) {
  const html = useMemo(() => render(t, true), [t])
  return (
    <div className={`eq${ruled ? ' ruled' : ''}`} id={id ?? (n ? `eq-${n}` : undefined)}>
      <div className="eq-body" dangerouslySetInnerHTML={{ __html: html }} />
      {n && <span className="eq-num">({n})</span>}
    </div>
  )
}
