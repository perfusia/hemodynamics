import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Wordmark } from './Logo'
import { useTheme, type ThemeChoice } from './themeContext'
import { AVAILABLE } from '../lessons/registry'

const GITHUB = 'https://github.com/perfusia/hemodynamics'

function ThemeToggle() {
  const { choice, setChoice, resolved } = useTheme()
  const next: Record<ThemeChoice, ThemeChoice> = { auto: resolved === 'dark' ? 'light' : 'dark', light: 'dark', dark: 'light' }
  const label = resolved === 'dark' ? 'Switch to day theme' : 'Switch to night theme'
  return (
    <button type="button" className="btn sm" onClick={() => setChoice(next[choice])} aria-label={label} title={label}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        {resolved === 'dark' ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3.2" /><path d="M8 1.5v1.6M8 12.9v1.6M1.5 8h1.6M12.9 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M3.4 12.6l1.1-1.1M11.5 4.5l1.1-1.1" /></g>
        ) : (
          <path d="M12.8 10.2A5.4 5.4 0 0 1 5.8 3.2a5.4 5.4 0 1 0 7 7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        )}
      </svg>
      <span className="hidden lg:inline">{resolved === 'dark' ? 'Day' : 'Night'}</span>
    </button>
  )
}

export function TopBar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm print:static">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-[var(--gutter)] py-2.5 font-sans">
        <Link to="/" className="no-underline hover:text-ink" aria-label="HemoLab home">
          <Wordmark />
        </Link>

        <nav aria-label="Lessons" className="hidden items-center gap-1 xl:flex">
          {AVAILABLE.map((l) => (
            <NavLink
              key={l.n}
              to={l.path}
              className={({ isActive }) =>
                `flex min-h-10 items-center gap-2 rounded px-3 text-[14px] font-semibold no-underline ${isActive ? 'bg-ink text-on-ink hover:text-on-ink' : 'text-ink-2 hover:text-ink'}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`cond ${isActive ? 'opacity-70' : 'text-ink-3'}`}>{String(l.n).padStart(2, '0')}</span>
                  {l.short}
                </>
              )}
            </NavLink>
          ))}
          <NavLink to="/model" className={({ isActive }) => `ml-2 flex min-h-10 items-center rounded px-3 text-[14px] font-semibold no-underline ${isActive ? 'bg-ink text-on-ink hover:text-on-ink' : 'text-ink-2 hover:text-ink'}`}>
            The model
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a className="btn sm hidden sm:inline-flex" href={GITHUB} aria-label="Source on GitHub">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 .2a8 8 0 0 0-2.5 15.6c.4 0 .5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.4.7 0-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.6 3.9.3.3.6.8.6 1.5v2.2c0 .2.1.5.6.4A8 8 0 0 0 8 .2z" /></svg>
            <span className="hidden lg:inline">GitHub</span>
          </a>
          <button type="button" className="btn sm xl:hidden" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen((o) => !o)}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              {open ? <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" /> : <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" />}
            </svg>
            Lessons
          </button>
        </div>
      </div>
      {open && (
        <nav id="mnav" aria-label="Lessons" className="border-t border-rule bg-paper px-[var(--gutter)] pt-2 pb-4 font-sans xl:hidden">
          <ul className="m-0 flex list-none flex-col p-0">
            {AVAILABLE.map((l) => (
              <li key={l.n}>
                <NavLink to={l.path} onClick={close} className={({ isActive }) => `flex min-h-12 items-center gap-3 border-b border-rule text-[15.5px] no-underline ${isActive ? 'font-bold' : 'font-medium'}`}>
                  <span className="cond w-7 font-semibold text-ink-3">{String(l.n).padStart(2, '0')}</span>
                  <span>{l.title}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/model" onClick={close} className="flex min-h-12 items-center gap-3 text-[15.5px] font-medium no-underline">
                <span className="w-7" />The model and its validation
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-rule print:hidden">
      <div className="mx-auto flex max-w-[1360px] flex-wrap justify-between gap-x-10 gap-y-4 px-[var(--gutter)] pt-7 pb-10 font-sans text-[13.5px] text-ink-2">
        <p className="m-0 max-w-[62ch]">
          HemoLab is an educational model. It is not a medical device, and its output must not inform the care of any patient.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link to="/model">The model</Link>
          <a href={GITHUB}>Source on GitHub</a>
          <span>MIT License</span>
          <span>Perfusia, 2026</span>
        </div>
      </div>
    </footer>
  )
}

export function Page({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1360px] px-[var(--gutter)]">{children}</div>
}
