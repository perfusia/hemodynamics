import { useState, type ReactNode } from 'react'

export interface QuestionData {
  id: string
  stem: ReactNode
  options: ReactNode[]
  answer: number
  /** Two-sided rationale: why the key is right and why each distractor is wrong. */
  rationale: ReactNode
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const key = (id: string) => `hemolab.q.${id}`

function load(id: string): number | null {
  try {
    const v = localStorage.getItem(key(id))
    return v === null ? null : Number(v)
  } catch { return null }
}
function save(id: string, v: number | null) {
  try {
    if (v === null) localStorage.removeItem(key(id))
    else localStorage.setItem(key(id), String(v))
  } catch { /* storage unavailable */ }
}

/**
 * A review question that locks on the first answer. The rationale appears
 * only after an answer, and the choice is remembered in this browser.
 */
export function Question({ q, num }: { q: QuestionData; num: string }) {
  const [picked, setPicked] = useState<number | null>(() => load(q.id))
  const locked = picked !== null
  const right = picked === q.answer

  const choose = (i: number) => {
    if (locked) return
    setPicked(i)
    save(q.id, i)
  }

  return (
    <div className="overflow-hidden rounded-md border border-rule bg-card" style={{ maxWidth: 'var(--measure)' }}>
      <div className="flex gap-3 px-5 pt-4 pb-1.5">
        <span className="font-sans text-[15px] font-bold" style={{ paddingTop: 2 }}>{num}</span>
        <div className="text-[17.5px] leading-[1.55]">{q.stem}</div>
      </div>
      <div role="radiogroup" aria-label={`Question ${num} choices`} className="flex flex-col gap-2 px-5 pt-2.5 pb-4 text-[16.5px] leading-[1.45]">
        {q.options.map((o, i) => {
          const isKey = i === q.answer
          const isPick = i === picked
          const state = !locked ? 'idle' : isKey ? 'key' : isPick ? 'wrong' : 'other'
          const border = state === 'key' ? 'var(--color-ok)' : state === 'wrong' ? 'var(--color-bad)' : 'var(--color-rule)'
          const bg = state === 'key' ? 'var(--color-ok-bg)' : state === 'wrong' ? 'var(--color-bad-bg)' : 'var(--color-card)'
          const color = state === 'other' ? 'var(--color-ink-3)' : 'var(--color-ink)'
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isPick}
              aria-disabled={locked}
              onClick={() => choose(i)}
              className="flex min-h-11 gap-3 rounded text-left"
              style={{
                padding: '10px 14px', border: `${state === 'key' || state === 'wrong' ? 1.5 : 1}px solid ${border}`,
                background: bg, color, cursor: locked ? 'default' : 'pointer', font: 'inherit',
              }}
            >
              <b className="font-sans" style={{ color: state === 'key' ? 'var(--color-ok)' : state === 'wrong' ? 'var(--color-bad)' : undefined }}>
                {LETTERS[i]}
              </b>
              <span>{o}</span>
            </button>
          )
        })}
      </div>
      {locked && (
        <div className="border-t border-rule bg-plate px-5 pt-3.5 pb-4 text-[16px] leading-[1.55]">
          <div className="mb-1 font-sans text-[14px] font-bold" style={{ color: right ? 'var(--color-ok)' : 'var(--color-bad)' }}>
            {right ? 'Correct. First answer recorded.' : `Not quite. The answer is ${LETTERS[q.answer]}.`}
          </div>
          <div>{q.rationale}</div>
        </div>
      )}
    </div>
  )
}

export function QuestionSet({ prefix, questions }: { prefix: string; questions: QuestionData[] }) {
  const [epoch, setEpoch] = useState(0)
  const reset = () => {
    questions.forEach((q) => save(q.id, null))
    setEpoch((e) => e + 1)
  }
  return (
    <div className="flex flex-col gap-5">
      {questions.map((q, i) => <Question key={`${q.id}-${epoch}`} q={q} num={`${prefix}.${i + 1}`} />)}
      <div>
        <button type="button" className="btn sm" onClick={reset}>Clear my answers</button>
      </div>
    </div>
  )
}
