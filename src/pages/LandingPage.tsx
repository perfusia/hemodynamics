import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useBreakpoint } from '../shared/useBreakpoint'

const TICKER_STATES = [
  { co: 5.0,  svr: 1120, label: 'Normal',    color: '#34d399' },
  { co: 8.5,  svr: 380,  label: 'Dangerous', color: '#f87171' },
  { co: 1.8,  svr: 1900, label: 'Dangerous', color: '#f87171' },
  { co: 4.5,  svr: 580,  label: 'Low',       color: '#fbbf24' },
  { co: 6.0,  svr: 2000, label: 'Crisis',    color: '#f87171' },
  { co: 5.0,  svr: 1120, label: 'Normal',    color: '#34d399' },
]

const LESSONS = [
  { num: '01', title: 'The Core Equation — MAP = CO × SVR',  sub: 'Mean arterial pressure, cardiac output, systemic vascular resistance.',        path: '/lessons/1', live: true  },
  { num: '02', title: 'Cardiac Output — HR × SV',            sub: 'Preload, afterload, contractility, and the Frank-Starling curve.',              path: '/lessons/2', live: true  },
  { num: '03', title: 'Vascular Resistance & Compensation',   sub: 'Baroreceptor reflex and how the body compensates for hemodynamic instability.', path: null,         live: false },
  { num: '04', title: 'Preload and Volume Status',            sub: 'CVP, PCWP, fluid responsiveness, and when to give fluid.',                     path: null,         live: false },
  { num: '05', title: 'Drug Effects on Hemodynamics',         sub: 'Vasopressors, inotropes, and anesthetic agents in depth.',                     path: null,         live: false },
  { num: '06', title: 'Clinical Scenarios',                   sub: 'Make decisions, watch the patient respond.',                                   path: null,         live: false },
]

export default function LandingPage() {
  const bp       = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'
  const tickerIdx = useRef(0)
  const mapRef    = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const coRef     = useRef<HTMLSpanElement>(null)
  const svrRef    = useRef<HTMLSpanElement>(null)
  const eqRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap'
    document.head.appendChild(link)

    const interval = setInterval(() => {
      tickerIdx.current = (tickerIdx.current + 1) % TICKER_STATES.length
      const t   = TICKER_STATES[tickerIdx.current]
      const map = Math.round((t.co * t.svr) / 80)
      if (mapRef.current)    { mapRef.current.textContent = String(map); mapRef.current.style.color = t.color }
      if (statusRef.current) { statusRef.current.textContent = t.label; statusRef.current.style.color = t.color }
      if (coRef.current)     coRef.current.textContent = String(t.co)
      if (svrRef.current)    svrRef.current.textContent = String(t.svr)
      if (eqRef.current)     eqRef.current.innerHTML = `<span style="color:#93c5fd">${t.co}</span><span style="color:rgba(255,255,255,0.25)"> × </span><span style="color:#c4b5fd">${t.svr}</span><span style="color:rgba(255,255,255,0.25)"> ÷ 80 = </span><span style="color:${t.color}">${map}</span>`
    }, 3000)

    const reveals = document.querySelectorAll('.lp-reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }, i * 60)
          obs.unobserve(el)
        }
      })
    }, { threshold: 0.08 })
    reveals.forEach(el => obs.observe(el))

    return () => { clearInterval(interval); obs.disconnect() }
  }, [])

  const reveal: React.CSSProperties = {
    opacity: 0, transform: 'translateY(16px)',
    transition: 'opacity 0.55s ease, transform 0.55s ease',
  }

  const serif = "'DM Serif Display', Georgia, serif"
  const mono  = 'ui-monospace,monospace'
  const px    = isMobile ? '20px' : isTablet ? '32px' : '48px'

  return (
    <div style={{ background: '#08080e', color: '#fff', fontFamily: 'ui-sans-serif,system-ui,sans-serif', fontWeight: 300, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${px}`, height: 56,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(8,8,14,0.9)', backdropFilter: 'blur(12px)',
      }}>
        <div>
          <div style={{ fontSize: 9, fontFamily: mono, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(99,179,237,0.65)' }}>Perfusia</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>HemoLab</div>
        </div>

        {isMobile ? (
          <>
            <Link to="/lessons/1" style={{
              fontFamily: mono, fontSize: 11, padding: '7px 14px', borderRadius: 6,
              border: '1px solid rgba(52,211,153,0.3)', color: '#34d399',
              background: 'rgba(52,211,153,0.06)', textDecoration: 'none',
            }}>Start →</Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#about"   style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>About</a>
            <a href="#lessons" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Lessons</a>
            <a href="https://github.com/perfusia/hemodynamics" target="_blank" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>GitHub</a>
            <Link to="/lessons/1" style={{
              fontFamily: mono, fontSize: 11, padding: '8px 18px', borderRadius: 6,
              border: '1px solid rgba(52,211,153,0.3)', color: '#34d399',
              background: 'rgba(52,211,153,0.06)', textDecoration: 'none',
            }}>Open HemoLab →</Link>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: `${isMobile ? '96px' : '120px'} ${px} ${isMobile ? '60px' : '80px'}` }}>
        <p style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(52,211,153,0.6)', marginBottom: 20 }}>
          Free · Open · Clinical Education
        </p>
        <h1 style={{
          fontFamily: serif, fontWeight: 400, lineHeight: 1.06,
          fontSize: isMobile ? 40 : isTablet ? 58 : 80,
          letterSpacing: '-0.02em', maxWidth: 760, margin: '0 0 24px',
        }}>
          Understand hemodynamics.<br />
          <em style={{ fontStyle: 'italic', color: '#34d399' }}>Not just memorize it.</em>
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.4)', maxWidth: 500, lineHeight: 1.75, margin: '0 0 36px' }}>
          A free interactive simulator for nursing students, ICU nurses, and CRNA candidates. Every lesson teaches the concept first, then lets you manipulate the physiology in real time.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, marginBottom: 52 }}>
          <Link to="/lessons/1" style={{
            fontFamily: mono, fontSize: 12, padding: '14px 28px', borderRadius: 8,
            background: '#34d399', color: '#031a10', fontWeight: 500,
            textDecoration: 'none', textAlign: 'center', display: 'block',
          }}>Start Lesson 1 →</Link>
          <a href="#lessons" style={{
            fontFamily: mono, fontSize: 12, padding: '14px 28px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)',
            textDecoration: 'none', textAlign: 'center', display: 'block',
          }}>See all lessons</a>
        </div>

        {/* Ticker */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: 0,
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, overflow: 'hidden',
          maxWidth: isMobile ? '100%' : 580,
          background: 'rgba(255,255,255,0.02)',
        }}>
          {[
            {
              label: 'MAP',
              content: (
                <>
                  <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 300 }}>
                    <span ref={mapRef} style={{ color: '#34d399', transition: 'color 0.4s' }}>70</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginLeft: 3 }}>mmHg</span>
                  </div>
                  <div ref={statusRef} style={{ fontSize: 10, marginTop: 3, color: '#34d399', transition: 'color 0.4s' }}>Normal</div>
                </>
              ),
            },
            {
              label: 'CO · Cardiac Output',
              content: (
                <>
                  <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 300 }}>
                    <span ref={coRef}>5.0</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginLeft: 3 }}>L/min</span>
                  </div>
                  <div style={{ fontSize: 10, marginTop: 3, color: 'rgba(255,255,255,0.25)' }}>HR × SV</div>
                </>
              ),
            },
            {
              label: 'Live Equation',
              content: (
                <>
                  <div ref={eqRef} style={{ fontFamily: mono, fontSize: isMobile ? 10 : 12, marginTop: 2 }}>
                    <span style={{ color: '#93c5fd' }}>5.0</span>
                    <span style={{ color: 'rgba(255,255,255,0.25)' }}> × </span>
                    <span style={{ color: '#c4b5fd' }}>1120</span>
                    <span style={{ color: 'rgba(255,255,255,0.25)' }}> ÷ 80 = </span>
                    <span style={{ color: '#34d399' }}>70</span>
                  </div>
                  <div style={{ fontSize: 10, marginTop: 5, color: 'rgba(255,255,255,0.2)' }}>MAP = CO × SVR ÷ 80</div>
                </>
              ),
            },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              borderRight: i < 2 && (!isMobile || i === 0) ? '1px solid rgba(255,255,255,0.07)' : 'none',
              borderBottom: isMobile && i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              gridColumn: isMobile && i === 2 ? '1 / -1' : 'auto',
            }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 6 }}>{item.label}</div>
              {item.content}
            </div>
          ))}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', maxWidth: 1200, margin: '0 auto' }} />

      {/* ── About ── */}
      <section id="about" style={{ maxWidth: 1200, margin: '0 auto', padding: `80px ${px}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: isMobile ? 40 : 80, alignItems: 'center' }}>
          <div>
            <p className="lp-reveal" style={{ ...reveal, fontFamily: mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 14 }}>The Story</p>
            <h2 className="lp-reveal" style={{ ...reveal, fontFamily: serif, fontSize: isMobile ? 28 : 40, fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 20 }}>
              Built by a learner,<br />for learners.
            </h2>
            <blockquote className="lp-reveal" style={{
              ...reveal,
              fontFamily: serif, fontSize: isMobile ? 16 : 20,
              fontStyle: 'italic', lineHeight: 1.5,
              color: 'rgba(255,255,255,0.7)',
              borderLeft: '2px solid #34d399',
              paddingLeft: 20, margin: '0 0 16px',
            }}>
              "I'm a senior software engineer transitioning into nursing school with the goal of becoming a CRNA. I built HemoLab to learn hemodynamics the way I learn everything else — by building something."
            </blockquote>
            <p className="lp-reveal" style={{ ...reveal, fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
              — James Waller, Software Engineer → Nursing Student → Future CRNA
            </p>
          </div>
          <div>
            {[
              'Most clinical education tools are locked behind institutional licenses, built by committees, and designed to assess rather than teach. HemoLab is different: free, open source, and built by someone actively learning the same material.',
              'Every lesson teaches the concept in plain language first — no assumed knowledge, no glossary required. Then the simulation makes it tangible.',
              'The lesson and the simulation are inseparable. That\'s the whole idea.',
            ].map((text, i) => (
              <p key={i} className="lp-reveal" style={{ ...reveal, fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, marginBottom: 16 }}>{text}</p>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', maxWidth: 1200, margin: '0 auto' }} />

      {/* ── Audience ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: `80px ${px}` }}>
        <p className="lp-reveal" style={{ ...reveal, fontFamily: mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 14 }}>Who it's for</p>
        <h2 className="lp-reveal" style={{ ...reveal, fontFamily: serif, fontSize: isMobile ? 28 : 40, fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 40 }}>
          Three audiences.<br />Free for all of them.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { icon: 'Nursing Students',  title: 'Learning the foundations',      body: 'Taking A&P for the first time? Every term is defined in context. No glossary required. The simulator makes the equations real.' },
            { icon: 'ICU Nurses',        title: 'Deepening clinical reasoning',  body: 'You see the numbers every shift. HemoLab helps you understand the relationships behind them — why MAP drops in sepsis even when CO is high.' },
            { icon: 'CRNA Candidates',   title: 'Thinking like an anesthetist',  body: 'Hemodynamic management is the core of anesthesia practice. HemoLab builds the foundation before you need it in school.' },
          ].map(a => (
            <div key={a.icon} className="lp-reveal" style={{ ...reveal, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px 20px', background: 'rgba(255,255,255,0.025)' }}>
              <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#34d399', marginBottom: 12 }}>{a.icon}</div>
              <h3 style={{ fontFamily: serif, fontSize: 18, fontWeight: 400, marginBottom: 10, lineHeight: 1.3 }}>{a.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, margin: 0 }}>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', maxWidth: 1200, margin: '0 auto' }} />

      {/* ── Lessons ── */}
      <section id="lessons" style={{ maxWidth: 1200, margin: '0 auto', padding: `80px ${px}` }}>
        <p className="lp-reveal" style={{ ...reveal, fontFamily: mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 14 }}>HemoLab Curriculum</p>
        <h2 className="lp-reveal" style={{ ...reveal, fontFamily: serif, fontSize: isMobile ? 28 : 40, fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 16 }}>
          Six lessons.<br />One complete picture.
        </h2>
        <p className="lp-reveal" style={{ ...reveal, fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, maxWidth: 500, marginBottom: 36 }}>
          Each lesson teaches the concept first, then builds it into the simulator.
        </p>
        <div className="lp-reveal" style={{ ...reveal, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          {LESSONS.map((lesson, i) => {
            const rowContent = (
              <>
                <span style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.2)', width: 22, flexShrink: 0 }}>{lesson.num}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 400, color: lesson.live ? 'white' : 'rgba(255,255,255,0.38)', marginBottom: 2, whiteSpace: isMobile ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</div>
                  {!isMobile && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{lesson.sub}</div>}
                </div>
                <span style={{
                  fontFamily: mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '3px 8px', borderRadius: 99, flexShrink: 0,
                  ...(lesson.live
                    ? { color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }
                    : { color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
                  ),
                }}>{lesson.live ? 'Live' : 'Soon'}</span>
                <span style={{ fontSize: 14, color: lesson.live ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)', flexShrink: 0 }}>→</span>
              </>
            )

            const rowStyle: React.CSSProperties = {
              display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20,
              padding: isMobile ? '14px 16px' : '18px 22px',
              borderBottom: i < LESSONS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              textDecoration: 'none', color: 'inherit',
              background: 'transparent',
            }

            return lesson.path ? (
              <Link key={lesson.num} to={lesson.path} style={rowStyle}>{rowContent}</Link>
            ) : (
              <div key={lesson.num} style={rowStyle}>{rowContent}</div>
            )
          })}
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', maxWidth: 1200, margin: '0 auto' }} />

      {/* ── Footer ── */}
      <footer style={{
        maxWidth: 1200, margin: '0 auto',
        padding: `32px ${px}`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: 16,
      }}>
        <div style={{ fontFamily: mono, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          Perfusia · HemoLab · Open Source · Free Forever
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="https://github.com/perfusia/hemodynamics" target="_blank" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}>GitHub</a>
          <a href="https://github.com/perfusia" target="_blank" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}>Perfusia</a>
          <Link to="/lessons/1" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}>Launch App</Link>
        </div>
      </footer>

    </div>
  )
}