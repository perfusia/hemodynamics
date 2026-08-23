import { useState } from 'react'
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom'
import { useBreakpoint } from './shared/useBreakpoint'

const LESSONS = [
  { path: '/lessons/1', label: 'Lesson 1', sub: 'MAP = CO × SVR'           },
  { path: '/lessons/2', label: 'Lesson 2', sub: 'HR × SV & Frank-Starling'  },
]

export default function App() {
  const location   = useLocation()
  const bp         = useBreakpoint()
  const isLanding  = location.pathname === '/'
  const isMobile   = bp === 'mobile'
  const [menuOpen, setMenuOpen] = useState(false)

  if (isLanding) {
    return (
      <div style={{ minHeight: '100vh', background: '#09090f' }}>
        <Outlet />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090f', fontFamily: 'ui-sans-serif,system-ui,sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: isMobile ? '0 20px' : '0 28px',
        display: 'flex', alignItems: 'center',
        background: 'rgba(9,9,15,0.95)',
        backdropFilter: 'blur(12px)',
        minHeight: 56,
      }}>

        {/* Brand */}
        <Link to="/" style={{ textDecoration: 'none', marginRight: isMobile ? 'auto' : 32, padding: '12px 0', flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontFamily: 'ui-monospace,monospace', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(99,179,237,0.65)' }}>Perfusia</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'white', marginTop: 1 }}>HemoLab</div>
        </Link>

        {isMobile ? (
          // Mobile — hamburger
          <>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'rgba(255,255,255,0.5)' }}
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>

            {/* Mobile dropdown */}
            {menuOpen && (
              <div style={{
                position: 'absolute', top: 56, left: 0, right: 0,
                background: '#09090f',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                padding: '12px 20px 20px',
                zIndex: 200,
              }}>
                <div style={{ fontSize: 9, fontFamily: 'ui-monospace,monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>Lessons</div>
                {LESSONS.map(lesson => (
                  <NavLink
                    key={lesson.path}
                    to={lesson.path}
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}
                  >
                    {({ isActive }) => (
                      <>
                        <span style={{ fontSize: 13, fontWeight: 500, color: isActive ? '#34d399' : 'white' }}>{lesson.label}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{lesson.sub}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </>
        ) : (
          // Desktop — inline tabs
          <>
            <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.08)', marginRight: 20, flexShrink: 0 }} />
            {LESSONS.map(lesson => (
              <NavLink
                key={lesson.path}
                to={lesson.path}
                style={({ isActive }) => ({
                  display: 'flex', flexDirection: 'column', gap: 1,
                  padding: '14px 14px',
                  borderBottom: isActive ? '2px solid #34d399' : '2px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  marginBottom: -1,
                  flexShrink: 0,
                })}
              >
                {({ isActive }) => (
                  <>
                    <span style={{ fontSize: 12, fontWeight: 500, color: isActive ? 'white' : 'rgba(255,255,255,0.4)' }}>{lesson.label}</span>
                    <span style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)' }}>{lesson.sub}</span>
                  </>
                )}
              </NavLink>
            ))}
            <div style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'ui-monospace,monospace', color: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>
              perfusia.github.io/hemodynamics
            </div>
          </>
        )}
      </nav>

      <main style={{
        maxWidth: bp === 'desktop' ? 1300 : '100%',
        margin: '0 auto',
        padding: isMobile ? '20px 16px' : '28px 28px',
      }}>
        <Outlet />
      </main>

    </div>
  )
}