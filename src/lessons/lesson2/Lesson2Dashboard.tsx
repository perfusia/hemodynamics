import { useState } from 'react'
import { ZonedSlider } from '../../components/ZonedSlider'
import { MAPArc } from '../../components/MAPArc'
import { VarRow } from '../../components/VarRow'
import { calcMAP, calcStrokeVolume, frankStarlingCurve, getMAPStatus, getRangeState } from '../../shared/utils'
import { NORMAL_RANGES } from '../../shared/constants'
import { SCENARIOS, TAG_COLOR } from './data'
import { useBreakpoint } from '../../shared/useBreakpoint'

const N = NORMAL_RANGES

const card: React.CSSProperties = {
  background: 'rgba(22,33,28,0.030)',
  border: '1px solid #C7D2C4',
  borderRadius: 14, padding: '18px 20px',
}

const sLabel: React.CSSProperties = {
  fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'rgba(22,33,28,0.46)', marginBottom: 14, display: 'block',
}

// ─── Prose helpers ────────────────────────────────────────────────────────────

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#16211C', marginBottom: 18, marginTop: 0 }}>{children}</h2>
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(22,33,28,0.8)', marginBottom: 16, marginTop: 0 }}>{children}</p>
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: '22px 0', padding: '14px 18px', borderRadius: 10, border: '1px solid rgba(46,107,79,0.2)', background: 'rgba(46,107,79,0.05)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(46,107,79,0.6)', marginBottom: 7 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'rgba(22,33,28,0.76)', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

function Eq({ children }: { children: React.ReactNode }) {
  return <div style={{ margin: '18px 0', padding: '13px 18px', borderRadius: 10, background: 'rgba(22,33,28,0.030)', border: '1px solid #C7D2C4', fontFamily: 'var(--font-mono)', fontSize: 17, color: '#16211C', letterSpacing: '0.04em', textAlign: 'center' }}>{children}</div>
}

// ─── Frank-Starling chart ────────────────────────────────────────────────────

function FrankStarlingChart({ preload, contractility, afterload }: {
  preload: number; contractility: number; afterload: number
}) {
  const W = 340, H = 200
  const padL = 40, padB = 30, padT = 16, padR = 16
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const maxPreload = 30, maxSV = 160

  const curve       = frankStarlingCurve(contractility, afterload, 60)
  const normalCurve = frankStarlingCurve(1.0, 1.0, 60)

  function px(p: number) { return padL + (p / maxPreload) * innerW }
  function py(sv: number) { return padT + innerH - (sv / maxSV) * innerH }
  function toPath(pts: { preload: number; sv: number }[]) {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.preload).toFixed(1)} ${py(p.sv).toFixed(1)}`).join(' ')
  }

  const currentSV = calcStrokeVolume(preload, contractility, afterload)
  const dotX = px(preload), dotY = py(currentSV)
  const xTicks = [0, 10, 20, 30]
  const yTicks = [0, 40, 80, 120, 160]

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {yTicks.map(t => <line key={t} x1={padL} x2={W - padR} y1={py(t)} y2={py(t)} stroke="rgba(22,33,28,0.16)" strokeWidth="1" />)}
      {xTicks.map(t => <line key={t} x1={px(t)} x2={px(t)} y1={padT} y2={H - padB} stroke="rgba(22,33,28,0.16)" strokeWidth="1" />)}
      <rect x={px(N.preload.low)} width={px(N.preload.high) - px(N.preload.low)} y={padT} height={innerH} fill="rgba(46,107,79,0.04)" />
      <line x1={padL} x2={padL} y1={padT} y2={H - padB} stroke="rgba(22,33,28,0.34)" strokeWidth="1" />
      <line x1={padL} x2={W - padR} y1={H - padB} y2={H - padB} stroke="rgba(22,33,28,0.34)" strokeWidth="1" />
      {xTicks.map(t => <text key={t} x={px(t)} y={H - 8} textAnchor="middle" fill="rgba(22,33,28,0.44)" fontSize="9" fontFamily="var(--font-mono)">{t}</text>)}
      {yTicks.filter(t => t > 0).map(t => <text key={t} x={padL - 5} y={py(t) + 3} textAnchor="end" fill="rgba(22,33,28,0.44)" fontSize="9" fontFamily="var(--font-mono)">{t}</text>)}
      <text x={padL + innerW / 2} y={H - 1} textAnchor="middle" fill="rgba(22,33,28,0.5)" fontSize="9" fontFamily="var(--font-sans)">Preload (mmHg)</text>
      <text x={10} y={padT + innerH / 2} textAnchor="middle" fill="rgba(22,33,28,0.5)" fontSize="9" fontFamily="var(--font-sans)" transform={`rotate(-90, 10, ${padT + innerH / 2})`}>SV (mL)</text>
      <path d={toPath(normalCurve)} fill="none" stroke="rgba(22,33,28,0.26)" strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={toPath(curve)} fill="none" stroke="#2E6B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1={padL} x2={W - padR} y1={py(N.sv.low)} y2={py(N.sv.low)} stroke="rgba(46,107,79,0.2)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={padL} x2={W - padR} y1={py(N.sv.high)} y2={py(N.sv.high)} stroke="rgba(46,107,79,0.2)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={dotX} x2={dotX} y1={padT} y2={H - padB} stroke="rgba(22,33,28,0.3)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={padL} x2={W - padR} y1={dotY} y2={dotY} stroke="rgba(22,33,28,0.3)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={dotX} cy={dotY} r={5} fill="#ffffff" />
      <circle cx={dotX} cy={dotY} r={8} fill="none" stroke="rgba(22,33,28,0.58)" strokeWidth="1.5" />
      <text x={Math.min(dotX + 10, W - padR - 30)} y={dotY - 5} fill="#16211C" fontSize="9" fontFamily="var(--font-mono)">{currentSV} mL</text>
    </svg>
  )
}

// ─── Simulator ───────────────────────────────────────────────────────────────

function Simulator() {
  const [hr,            setHr]            = useState(70)
  const [preload,       setPreload]       = useState(12)
  const [afterload,     setAfterload]     = useState(1.0)
  const [contractility, setContractility] = useState(1.0)
  const [svr,           setSvr]           = useState(1000)
  const [activeScene,   setActiveScene]   = useState<string | null>('Normal at Rest')

  const sv     = calcStrokeVolume(preload, contractility, afterload)
  const co     = parseFloat(((hr * sv) / 1000).toFixed(1))
  const map    = calcMAP(co, svr)
  const status = getMAPStatus(map)

  function applyScenario(s: typeof SCENARIOS[0]) {
    setHr(s.hr); setPreload(s.preload)
    setAfterload(s.afterload); setContractility(s.contractility)
    setSvr(s.svr); setActiveScene(s.label)
  }

  function handle(setter: (v: number) => void) {
    return (v: number) => { setter(v); setActiveScene(null) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      <div style={{ ...card, background: status.bg, borderColor: `${status.ring}22`, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <MAPArc map={map} status={status} />
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(22,33,28,0.55)', marginBottom: 4 }}>Mean Arterial Pressure</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 40, fontWeight: 200, fontFamily: 'var(--font-mono)', color: '#16211C', lineHeight: 1 }}>{map}</span>
              <span style={{ fontSize: 13, color: 'rgba(22,33,28,0.55)' }}>mmHg</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: status.accent, marginTop: 2 }}>{status.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginTop: 7, color: 'rgba(22,33,28,0.5)' }}>
              <span style={{ color: '#2E6B4F' }}>{hr}</span>
              <span style={{ color: 'rgba(22,33,28,0.44)' }}> × </span>
              <span style={{ color: '#1B3A4B' }}>{sv}</span>
              <span style={{ color: 'rgba(22,33,28,0.44)' }}> = </span>
              <span style={{ color: '#16211C' }}>{co} L/min → </span>
              <span style={{ color: status.accent }}>{map} mmHg</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 14px' }}>
            {[
              { abbr: 'CO',  v: co.toFixed(1), unit: 'L/min',   low: N.co.low,  high: N.co.high  },
              { abbr: 'SV',  v: String(sv),    unit: 'mL/beat', low: N.sv.low,  high: N.sv.high  },
              { abbr: 'HR',  v: String(hr),    unit: 'bpm',     low: N.hr.low,  high: N.hr.high  },
              { abbr: 'MAP', v: String(map),   unit: 'mmHg',    low: N.map.low, high: N.map.high },
            ].map(s => {
              const st = getRangeState(Number(s.v), s.low, s.high)
              return (
                <div key={s.abbr} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'rgba(22,33,28,0.5)', width: 22 }}>{s.abbr}</span>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 300, color: st.color }}>{s.v}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={card}>
        <span style={sLabel}>Frank-Starling Curve</span>
        <FrankStarlingChart preload={preload} contractility={contractility} afterload={afterload} />
        <p style={{ fontSize: 11, color: 'rgba(22,33,28,0.5)', lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>
          White dot = current operating point. Dashed = normal reference. Adjust contractility to shift the curve.
        </p>
      </div>

      <div style={card}>
        <span style={sLabel}>Adjust Variables</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ZonedSlider abbr="HR" label="Heart Rate" value={hr} min={30} max={180} step={1} unit="bpm" onChange={handle(setHr)} low={N.hr.low} high={N.hr.high} />
          <ZonedSlider abbr="Preload" label="Ventricular Filling Pressure" value={preload} min={0} max={30} step={1} unit="mmHg" onChange={handle(setPreload)} low={N.preload.low} high={N.preload.high} />
          <ZonedSlider abbr="Afterload" label="Vascular Resistance (relative)" value={afterload} min={0.3} max={2.5} step={0.05} unit="×" onChange={handle(setAfterload)} low={N.afterload.low} high={N.afterload.high} />
          <ZonedSlider abbr="Contractility" label="Myocardial Contractility" value={contractility} min={0.2} max={1.6} step={0.05} unit="×" onChange={handle(setContractility)} low={N.contractility.low} high={N.contractility.high} />
          <ZonedSlider abbr="SVR" label="Systemic Vascular Resistance" value={svr} min={200} max={2400} step={10} unit="dyn·s/cm⁵" onChange={handle(setSvr)} low={N.svr.low} high={N.svr.high} />
        </div>
      </div>

      <div style={card}>
        <span style={sLabel}>Clinical Scenarios</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {SCENARIOS.map(s => {
            const tc = TAG_COLOR[s.tag]
            return (
              <button key={s.label} onClick={() => applyScenario(s)} style={{
                display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left',
                padding: '9px 12px', borderRadius: 9,
                border: activeScene === s.label ? '1px solid #C7D2C4' : '1px solid #C7D2C4',
                background: activeScene === s.label ? 'rgba(22,33,28,0.2)' : 'rgba(22,33,28,0.08)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#16211C' }}>{s.label}</span>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, color: tc.text, background: tc.bg, border: `1px solid ${tc.border}` }}>{s.tag}</span>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(22,33,28,0.55)', lineHeight: 1.5 }}>{s.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={card}>
        <span style={sLabel}>Variable Detail</span>
        <VarRow abbr="SV"  label="Stroke Volume"         value={sv}  unit="mL/beat"   low={N.sv.low}  high={N.sv.high}  description="Derived from preload, contractility, and afterload via the Frank-Starling model." />
        <VarRow abbr="CO"  label="Cardiac Output"        value={co}  unit="L/min"     low={N.co.low}  high={N.co.high}  description="HR × SV ÷ 1000. Primary determinant of MAP alongside SVR." />
        <VarRow abbr="HR"  label="Heart Rate"            value={hr}  unit="bpm"       low={N.hr.low}  high={N.hr.high}  description="Above ~150 bpm, diastolic filling time shortens and SV falls." />
        <VarRow abbr="SVR" label="Vascular Resistance"   value={svr} unit="dyn·s/cm⁵" low={N.svr.low} high={N.svr.high} description="High SVR = harder to eject blood. Afterload from the vascular side." />
      </div>

    </div>
  )
}

// ─── Lesson prose ─────────────────────────────────────────────────────────────

function LessonContent({ onOpenSimulator }: { onOpenSimulator?: () => void }) {
  return (
    <div>
      <section style={{ marginBottom: 52 }}>
        <H2>The Big Idea</H2>
        <P>In Lesson 1 you learned that MAP = CO × SVR, and that cardiac output is one of the two forces driving blood pressure. But we treated CO as a single number you could slide up and down. In reality, cardiac output is the product of two variables — and understanding what controls each one is the difference between knowing a formula and actually understanding how the heart works.</P>
        <Eq>CO = HR × SV</Eq>
        <P>Heart rate you already know intuitively. Stroke volume is where it gets interesting — and where the real clinical leverage is.</P>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>Heart Rate</H2>
        <P>Normal resting HR is 60–100 bpm. You might assume faster always means more cardiac output — more beats per minute, more blood pumped. That's true up to a point.</P>
        <P>Past roughly 150–170 bpm, the heart is beating so fast it never fully fills between contractions. Diastole — the filling time — gets so short that each beat ejects less and less blood. Stroke volume falls, and cardiac output can actually drop despite a racing heart rate.</P>
        <P>This is why tachycardia is dangerous in a sick patient. The heart is working harder but potentially delivering less.</P>
        <Callout label="Try it in the simulator">
          Push HR above 150 bpm and watch what happens to SV and CO. The body is working harder but output falls — the classic tachycardia trap.
        </Callout>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>Stroke Volume</H2>
        <P>Stroke volume is the volume ejected by the left ventricle in a single contraction. Normal: 60–100 mL/beat. It is determined by three forces.</P>
        <P><strong style={{ color: '#16211C', fontWeight: 500 }}>Preload</strong> is how much the ventricle is stretched before it contracts — like a rubber band. More stretch, more force. Determined primarily by venous return. A dehydrated patient has low preload and low stroke volume. IV fluid increases preload and stroke volume — up to a point.</P>
        <P><strong style={{ color: '#16211C', fontWeight: 500 }}>Afterload</strong> is the resistance the ventricle must overcome to eject blood — essentially SVR from the heart's perspective. High afterload means harder squeezing, less ejection. This is why vasodilators can actually improve stroke volume in a failing heart even though they lower blood pressure.</P>
        <P><strong style={{ color: '#16211C', fontWeight: 500 }}>Contractility</strong> is the intrinsic strength of the heart muscle independent of preload and afterload. Reduced in heart failure, after MI, acidosis, or hypoxia. Increased by catecholamines and inotropes.</P>
        <Callout label="Try it in the simulator">
          Drop contractility to 0.4 and watch the Frank-Starling curve shift down — the same preload now produces far less stroke volume. That's heart failure. Now try increasing preload. Notice how little it helps. This is why giving fluid to a heart failure patient causes pulmonary edema without improving output.
        </Callout>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>The Frank-Starling Curve</H2>
        <P>The relationship between preload and stroke volume is called the Frank-Starling mechanism, described in 1914. The heart will eject more blood when it is filled with more blood — up to a point.</P>
        <P>On the curve: preload on the x-axis, stroke volume on the y-axis. As preload rises, SV rises steeply, then plateaus, then falls at extreme preload — over-distension where the ventricle is too stretched to contract efficiently.</P>
        <P>Contractility shifts the entire curve up or down. A healthy heart operates on a higher curve — same preload, more stroke volume. A failing heart operates lower.</P>
        <P>This curve answers the most common ICU question: <em style={{ color: 'rgba(22,33,28,0.88)' }}>should I give this patient more fluid?</em> Steep ascending limb — yes, fluid helps. Flat or descending limb — no, fluid causes pulmonary edema.</P>
        <Callout label="Try it in the simulator">
          Load "Hypovolemia" — steep ascending limb, low preload. Load "Fluid Resuscitation" — preload rises, SV improves. Now load "Heart Failure" — flat curve, high preload, low SV. Load "Dobutamine Infusion" — contractility increases, curve shifts up. Same preload now produces significantly more SV.
        </Callout>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>Connecting Back to Lesson 1</H2>
        <P>When SV falls — from low preload, high afterload, or poor contractility — CO falls, and MAP falls with it. The body responds by raising SVR to compensate. This is why cardiogenic shock patients have cold, clammy skin — vessels are clamped down so hard to preserve MAP that peripheral perfusion suffers.</P>
        <Eq>MAP = (HR × SV) × SVR ÷ 80</Eq>
        <P>Every hemodynamic intervention — fluid, vasopressors, inotropes, rate control — targets one of those four variables. Understanding which one is broken in any given patient is the core skill of critical care and anesthesia practice.</P>
      </section>

      {onOpenSimulator && (
        <button onClick={onOpenSimulator} style={{
          width: '100%', padding: '14px', borderRadius: 10, marginBottom: 32,
          border: '1px solid rgba(46,107,79,0.3)', background: 'rgba(46,107,79,0.06)',
          color: '#2E6B4F', fontFamily: 'var(--font-mono)', fontSize: 12,
          cursor: 'pointer', letterSpacing: '0.04em',
        }}>
          Open Simulator →
        </button>
      )}
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Lesson2Dashboard() {
  const bp       = useBreakpoint()
  const isMobile = bp === 'mobile'
  const [tab, setTab] = useState<'lesson' | 'simulator'>('lesson')

  const serif = 'var(--font-display)'

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(46,107,79,0.6)', marginBottom: 8 }}>Lesson 2</div>
        <h1 style={{ fontFamily: serif, fontSize: isMobile ? 30 : 38, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#16211C', margin: '0 0 8px' }}>
          Cardiac Output
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(22,33,28,0.63)', margin: 0, fontStyle: 'italic' }}>
          HR × SV and the Frank-Starling curve
        </p>
      </div>

      {isMobile ? (
        <div>
          <div style={{
            position: 'sticky', top: 56, zIndex: 50,
            display: 'flex', gap: 0,
            background: '#F4F6F2',
            borderBottom: '1px solid #C7D2C4',
            marginBottom: 24, marginLeft: -16, marginRight: -16,
            paddingLeft: 16,
          }}>
            {(['lesson', 'simulator'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '12px 20px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                color: tab === t ? '#1B3A4B' : 'rgba(22,33,28,0.63)',
                borderBottom: tab === t ? '2px solid #1B3A4B' : '2px solid transparent',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}>{t}</button>
            ))}
          </div>

          {tab === 'lesson' ? (
            <LessonContent onOpenSimulator={() => { setTab('simulator'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
          ) : (
            <Simulator />
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: bp === 'tablet' ? '1fr 1fr' : '1fr 1.1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <LessonContent />
          </div>
          <div style={{ position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', paddingBottom: 20 }}>
            <Simulator />
          </div>
        </div>
      )}
    </div>
  )
}