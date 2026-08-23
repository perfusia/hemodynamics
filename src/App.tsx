import { useState } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'

const LESSONS = [
  { path: '/lessons/1', label: 'Lesson 1', sub: 'MAP = CO × SVR' },
  { path: '/lessons/2', label: 'Lesson 2', sub: 'HR × SV and Frank-Starling' },
]

export default function App() {
  const location  = useLocation()
  const isLanding = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  if (isLanding) {
    return (
      <div className="min-h-screen bg-paper">
        <Outlet />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <nav className="sticky top-0 z-50 flex min-h-14 items-stretch border-b border-rule bg-paper/95 px-5 backdrop-blur md:px-7">

        <Link to="/" className="mr-auto flex flex-col justify-center py-2.5 no-underline md:mr-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-navy">Perfusia</span>
          <span className="font-display text-[15px] font-semibold text-ink">HemoLab</span>
        </Link>

        {/* Desktop tabs */}
        <div className="hidden md:flex md:items-stretch">
          <div className="my-auto mr-5 h-7 w-px bg-rule" />
          {LESSONS.map(lesson => (
            <NavLink key={lesson.path} to={lesson.path}
              className={({ isActive }) =>
                `flex flex-col justify-center gap-0.5 border-b-2 px-3.5 no-underline transition-colors
                 ${isActive ? 'border-navy' : 'border-transparent hover:border-rule'}`}>
              {({ isActive }) => (
                <>
                  <span className={`text-xs font-semibold ${isActive ? 'text-ink' : 'text-ink-soft'}`}>{lesson.label}</span>
                  <span className="text-[10px] text-ink-faint">{lesson.sub}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="p-2 text-ink-soft md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {menuOpen
              ? <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              : <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute inset-x-0 top-14 z-50 border-b border-rule bg-paper px-5 pb-5 pt-3 md:hidden">
            <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">Lessons</div>
            {LESSONS.map(lesson => (
              <NavLink key={lesson.path} to={lesson.path} onClick={() => setMenuOpen(false)}
                className="flex flex-col gap-0.5 border-b border-rule/60 py-2.5 no-underline last:border-b-0">
                {({ isActive }) => (
                  <>
                    <span className={`text-[13px] font-semibold ${isActive ? 'text-navy' : 'text-ink'}`}>{lesson.label}</span>
                    <span className="text-[11px] text-ink-soft">{lesson.sub}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-[1300px] px-4 py-5 md:px-7 md:py-7">
        <Outlet />
      </main>
    </div>
  )
}
