import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LESSONS, type LessonMeta } from '../lessons/registry'
import { M } from './Math'
import { RefList, type Ref } from './Cite'
import { QuestionSet, type QuestionData } from './Question'

export interface LessonSection {
  id: string
  num: string
  title: string
  body: ReactNode
}

export interface NotationRow {
  /** Symbol, TeX. */
  sym: string
  def: ReactNode
  unit: string
}

interface Props {
  meta: LessonMeta
  objectives: ReactNode[]
  notation: NotationRow[]
  sections: LessonSection[]
  keyPoints: ReactNode[]
  questions: QuestionData[]
  refs: Ref[]
  references?: number
}

function useScrollSpy(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null)
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const els = ids.map((id) => document.getElementById(id)).filter((x): x is HTMLElement => !!x)
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis.length) setActive(vis[0].target.id)
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [ids])
  return active
}

function useReadProgress(ref: React.RefObject<HTMLElement | null>): number {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const total = r.height - window.innerHeight * 0.6
        setP(Math.max(0, Math.min(1, -r.top / Math.max(total, 1))))
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [ref])
  return p
}

export function LessonPage({ meta, objectives, notation, sections, keyPoints, questions, refs }: Props) {
  const tocIds = [...sections.map((s) => s.id), 'key-points', 'review', 'references']
  const active = useScrollSpy(tocIds)
  const articleRef = useRef<HTMLElement>(null)
  const progress = useReadProgress(articleRef)
  const [menu, setMenu] = useState(false)
  const prev = LESSONS.find((l) => l.n === meta.n - 1 && l.available)
  const next = LESSONS.find((l) => l.n === meta.n + 1 && l.available)
  const activeSec = sections.find((s) => s.id === active)

  useEffect(() => { document.title = `${meta.n}. ${meta.title} · Titrate` }, [meta])

  const toc = (
    <ol className="m-0 flex list-none flex-col gap-0.5 border-l border-rule p-0">
      {sections.map((s) => {
        const on = s.id === active
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={() => setMenu(false)}
              aria-current={on ? 'location' : undefined}
              className={`flex gap-2.5 py-1.5 pr-1 no-underline ${on ? 'font-semibold text-ink' : 'text-ink-2'}`}
              style={{ paddingLeft: on ? 12 : 14, borderLeft: on ? '3px solid var(--color-ink)' : undefined, marginLeft: on ? -1 : 0 }}
            >
              <span className={`cond w-[26px] flex-none ${on ? '' : 'text-ink-3'}`}>{s.num}</span>
              <span>{s.title}</span>
            </a>
          </li>
        )
      })}
      {[['key-points', 'Key points'], ['review', 'Review questions'], ['references', 'References']].map(([id, t]) => (
        <li key={id}>
          <a href={`#${id}`} onClick={() => setMenu(false)} className={`flex gap-2.5 py-1.5 no-underline ${active === id ? 'font-semibold text-ink' : 'text-ink-2'}`} style={{ paddingLeft: 14 }}>
            <span className="w-[26px] flex-none" />
            <span>{t}</span>
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <div className="mx-auto flex max-w-[1360px] items-start gap-x-14 px-[var(--gutter)]">
      <aside aria-label="Lesson contents" className="sticky top-[76px] hidden max-h-[calc(100vh-96px)] w-[220px] flex-none overflow-y-auto pt-16 pb-8 font-sans text-[14px] leading-[1.35] min-[1360px]:block print:hidden">
        <div className="label mb-3.5" style={{ fontSize: 11.5, color: 'var(--color-ink-3)' }}>Lesson {meta.n}</div>
        {toc}
        <div className="mt-6 border-t border-rule pt-3.5 text-[13px] text-ink-3">Progress through lesson</div>
        <div className="mt-2 h-[3px] bg-grid"><div className="h-[3px] bg-ink" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
      </aside>

      <article ref={articleRef} className="prose min-w-0 flex-1 pt-10 pb-24 md:pt-16" style={{ maxWidth: 'var(--wide)' }}>
        <div className="sticky top-[57px] z-30 -mx-[var(--gutter)] mb-6 border-b border-rule bg-paper/95 px-[var(--gutter)] py-2 backdrop-blur-sm min-[1360px]:hidden print:hidden">
          <button type="button" className="btn sm w-full justify-between" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <span className="flex min-w-0 items-center gap-2 truncate">
              <span className="cond text-ink-3">{activeSec ? activeSec.num : String(meta.n).padStart(2, '0')}</span>
              <span className="truncate">{activeSec ? activeSec.title : 'Contents'}</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d={menu ? 'M3 9l4-4 4 4' : 'M3 5l4 4 4-4'} fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
          {menu && <div className="mt-2 max-h-[60vh] overflow-y-auto font-sans text-[15px]">{toc}</div>}
          <div className="absolute right-0 bottom-0 left-0 h-[2px]"><div className="h-[2px] bg-ink" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
        </div>

        <header className="mb-10" style={{ maxWidth: 980 }}>
          <div className="label cond" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.14em', fontWeight: 600 }}>
            Lesson {meta.n} of {LESSONS.filter((l) => l.available).length} · {meta.kicker}
          </div>
          <h1 className="mt-4 mb-5 font-sans font-semibold leading-[1.04] tracking-[-0.025em]" style={{ fontSize: 'clamp(34px, 4.6vw, 56px)', maxWidth: '18ch', textWrap: 'balance' }}>
            {meta.title}
          </h1>
          <p className="mb-6 text-ink-2" style={{ fontSize: 'clamp(19px, 1.8vw, 22px)', lineHeight: 1.5, maxWidth: '38em' }}>{meta.deck}</p>
          <div className="flex flex-wrap gap-x-7 gap-y-1.5 border-y border-rule py-3 font-sans text-[13.5px] text-ink-2">
            {meta.n > 1 && <span><b className="text-ink">Prerequisite</b> Lesson {meta.n - 1}</span>}
            <span><b className="text-ink">Reading</b> {meta.minutes} min</span>
            <span><b className="text-ink">Figures</b> {meta.figures} interactive</span>
            <span><b className="text-ink">References</b> {refs.length}</span>
            <span><b className="text-ink">Revised</b> November 2026</span>
          </div>
        </header>

        <div className="mb-14 flex flex-wrap gap-x-10 gap-y-7" style={{ maxWidth: 980 }}>
          <section aria-labelledby="obj" className="min-w-0 border-t-2 border-ink pt-3" style={{ flex: '1 1 420px' }}>
            <h2 id="obj" className="label mt-0 mb-3">Learning objectives</h2>
            <ol className="m-0 flex flex-col gap-2 pl-[1.4em] text-[17px] leading-[1.55]">
              {objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ol>
          </section>
          <section aria-labelledby="not" className="min-w-0 border-t-2 border-ink pt-3" style={{ flex: '1 1 360px' }}>
            <h2 id="not" className="label mt-0 mb-1.5">Notation</h2>
            <table className="w-full border-collapse text-[16px] leading-[1.35]">
              <tbody>
                {notation.map((r, i) => (
                  <tr key={i} className={i < notation.length - 1 ? 'border-b border-grid' : ''}>
                    <td className="w-[86px] py-[7px] pr-2.5 align-top whitespace-nowrap"><M t={r.sym} /></td>
                    <td className="py-[7px] pr-2.5 align-top">{r.def}</td>
                    <td className="py-[7px] text-right align-top font-sans text-[13px] whitespace-nowrap text-ink-3">{r.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {sections.map((s) => (
          <section key={s.id} aria-labelledby={`${s.id}-h`}>
            <h2 className="section" id={s.id}>
              <span className="num">{s.num}</span>
              <span id={`${s.id}-h`}>{s.title}</span>
            </h2>
            {s.body}
          </section>
        ))}

        <section aria-labelledby="key-points-h" className="mt-16" style={{ maxWidth: 'var(--measure)' }}>
          <h2 id="key-points" className="label mt-0 mb-3 border-t-2 border-ink pt-3"><span id="key-points-h">Key points</span></h2>
          <ul className="m-0 flex flex-col gap-2.5 pl-[1.2em]">
            {keyPoints.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
        </section>

        <section aria-labelledby="review-h" className="mt-16">
          <h2 className="section" id="review" style={{ marginTop: 0 }}><span id="review-h">Review questions</span></h2>
          <p className="text-ink-2" style={{ fontSize: 16.5 }}>Each question locks on your first answer, then shows the reasoning for every option.</p>
          <QuestionSet prefix={String(meta.n)} questions={questions} />
        </section>

        <section aria-labelledby="references-h" className="mt-16" style={{ maxWidth: 820 }}>
          <h2 id="references" className="label mt-0 mb-3.5 border-t-2 border-ink pt-3"><span id="references-h">References</span></h2>
          <RefList refs={refs} />
        </section>

        <nav aria-label="Lesson navigation" className="mt-16 flex flex-wrap justify-between gap-3 border-t border-rule pt-4 font-sans" style={{ maxWidth: 980 }}>
          {prev ? (
            <Link to={prev.path} className="flex min-h-11 flex-col gap-0.5 no-underline">
              <span className="label" style={{ fontSize: 12, color: 'var(--color-ink-3)' }}>Previous</span>
              <span className="text-[17px] font-semibold">{prev.n} · {prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={next.path} className="flex min-h-11 flex-col gap-0.5 text-right no-underline">
              <span className="label" style={{ fontSize: 12, color: 'var(--color-ink-3)' }}>Next</span>
              <span className="text-[17px] font-semibold">{next.n} · {next.title}</span>
            </Link>
          ) : (
            <Link to="/model" className="flex min-h-11 flex-col gap-0.5 text-right no-underline">
              <span className="label" style={{ fontSize: 12, color: 'var(--color-ink-3)' }}>Next</span>
              <span className="text-[17px] font-semibold">The model and its validation</span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  )
}
