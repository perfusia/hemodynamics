import type { ReactNode } from 'react'

/**
 * A reference in APA 7 form. Titles are stored in sentence case, as APA
 * requires; journal names and book titles keep title case.
 */
export interface Ref {
  key: string
  kind: 'article' | 'book' | 'chapter' | 'guideline' | 'web' | 'software'
  /** Reference-list author string, e.g. "Suga, H., & Sagawa, K." */
  authors: string
  /** In-text author string, e.g. "Suga & Sagawa" or "Kelly et al." */
  short: string
  year: string
  title: string
  /** Journal name (article), book title (chapter), or site (web). */
  container?: string
  volume?: string
  issue?: string
  pages?: string
  /** Chapter: editors, e.g. "M. A. Gropper (Ed.)". */
  editors?: string
  edition?: string
  publisher?: string
  doi?: string
  url?: string
}

const id = (r: Ref) => `ref-${r.key}`

/** Parenthetical or narrative in-text citation, linked to the reference list. */
export function Cite({ r, narrative = false, p }: { r: Ref | Ref[]; narrative?: boolean; p?: string }) {
  const list = Array.isArray(r) ? r : [r]
  if (narrative && list.length === 1) {
    const one = list[0]
    return (
      <span className="cite">
        {one.short.replace(' & ', ' and ')} (<a href={`#${id(one)}`}>{one.year}{p ? `, ${p}` : ''}</a>)
      </span>
    )
  }
  return (
    <span className="cite">
      (
      {list.map((x, i) => (
        <span key={x.key}>
          {i > 0 && '; '}
          <a href={`#${id(x)}`}>{x.short}, {x.year}</a>
        </span>
      ))}
      {p ? `, ${p}` : ''})
    </span>
  )
}

function Doi({ r }: { r: Ref }) {
  if (r.doi) return <> <a href={`https://doi.org/${r.doi}`}>https://doi.org/{r.doi}</a></>
  if (r.url) return <> <a href={r.url}>{r.url}</a></>
  return null
}

/** One reference-list entry. */
export function RefEntry({ r }: { r: Ref }): ReactNode {
  const end = (s: string) => (/[.?!]$/.test(s) ? s : `${s}.`)
  switch (r.kind) {
    case 'article':
      return (
        <>
          {r.authors} ({r.year}). {end(r.title)}{' '}
          <i>{r.container}{r.volume ? `, ${r.volume}` : ''}</i>
          {r.issue ? `(${r.issue})` : ''}{r.pages ? `, ${r.pages}` : ''}.
          <Doi r={r} />
        </>
      )
    case 'book':
      return (
        <>
          {r.authors} ({r.year}). <i>{r.title}</i>{r.edition ? ` (${r.edition} ed.)` : ''}. {r.publisher}.
          <Doi r={r} />
        </>
      )
    case 'chapter':
      return (
        <>
          {r.authors} ({r.year}). {end(r.title)} In {r.editors}, <i>{r.container}</i>
          {r.edition || r.pages ? ` (${[r.edition ? `${r.edition} ed.` : '', r.pages ? `pp. ${r.pages}` : ''].filter(Boolean).join(', ')})` : ''}.{' '}
          {r.publisher}.
          <Doi r={r} />
        </>
      )
    case 'software':
      return (
        <>
          {r.authors} ({r.year}). <i>{r.title}</i> [Computer software]. {r.publisher}.
          <Doi r={r} />
        </>
      )
    default:
      return (
        <>
          {r.authors} ({r.year}). <i>{r.title}</i>. {r.container ? `${r.container}. ` : ''}
          <Doi r={r} />
        </>
      )
  }
}

/** Alphabetized reference list, APA 7. */
export function RefList({ refs }: { refs: Ref[] }) {
  const sorted = [...refs].sort((a, b) => a.authors.localeCompare(b.authors) || a.year.localeCompare(b.year))
  return (
    <ol className="refs">
      {sorted.map((r) => (
        <li key={r.key} id={id(r)}>
          <RefEntry r={r} />
        </li>
      ))}
    </ol>
  )
}
