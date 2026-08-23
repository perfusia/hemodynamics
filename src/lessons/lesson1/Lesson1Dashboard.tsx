import { useState } from 'react'
import { ZonedSlider } from '../../components/ZonedSlider'
import { MAPArc } from '../../components/MAPArc'
import { VarRow } from '../../components/VarRow'
import { DrugButton } from '../../components/DrugButton'
import { calcMAP, getMAPStatus, getRangeState } from '../../shared/utils'
import { NORMAL_RANGES } from '../../shared/constants'
import { SURFACE, INK, PIGMENT } from '../../shared/tokens'
import { DRUGS, SCENARIOS, TAG_COLOR } from './data'
import { useBreakpoint } from '../../shared/useBreakpoint'

const N = NORMAL_RANGES

// ─── Shared card styles ───────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: 'rgba(43,33,24,0.030)',
  border: '1px solid #D6C9AE',
  borderRadius: 14, padding: '18px 20px',
}

const sLabel: React.CSSProperties = {
  fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'rgba(43,33,24,0.68)', marginBottom: 14, display: 'block',
}

// ─── Prose helpers ────────────────────────────────────────────────────────────

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#2B2118', marginBottom: 18, marginTop: 0 }}>{children}</h2>
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(43,33,24,0.88)', marginBottom: 16, marginTop: 0 }}>{children}</p>
}

function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: '22px 0', padding: '14px 18px', borderRadius: 10, border: '1px solid rgba(74,107,87,0.2)', background: 'rgba(74,107,87,0.05)' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(74,107,87,0.6)', marginBottom: 7 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'rgba(43,33,24,0.88)', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

function Eq({ children }: { children: React.ReactNode }) {
  return <div style={{ margin: '18px 0', padding: '13px 18px', borderRadius: 10, background: 'rgba(43,33,24,0.030)', border: '1px solid #D6C9AE', fontFamily: 'var(--font-mono)', fontSize: 17, color: '#2B2118', letterSpacing: '0.04em', textAlign: 'center' }}>{children}</div>
}

function RangeTable({ rows }: { rows: { range: string; label: string; color: string; note: string }[] }) {
  return (
    <div style={{ margin: '18px 0', borderRadius: 10, border: '1px solid #D6C9AE', overflow: 'hidden' }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '9px 14px', borderBottom: i < rows.length - 1 ? '1px solid #D6C9AE' : 'none', background: 'rgba(43,33,24,0.020)', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: row.color, minWidth: 90, flexShrink: 0 }}>{row.range}</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: row.color, minWidth: 70, flexShrink: 0 }}>{row.label}</span>
          <span style={{ fontSize: 11, color: 'rgba(43,33,24,0.78)' }}>{row.note}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Simulator ───────────────────────────────────────────────────────────────

function Simulator() {
  const [baseCo,  setBaseCo]  = useState(5.0)
  const [baseSvr, setBaseSvr] = useState(1120)
  const [activeDrug,  setActiveDrug]  = useState<string | null>(null)
  const [activeScene, setActiveScene] = useState<string | null>('Normal at Rest')

  const activeDrugData = DRUGS.find(d => d.name === activeDrug) ?? null
  const co  = activeDrugData ? Math.min(Math.max(parseFloat((baseCo  + activeDrugData.effect.co).toFixed(1)), 1),  12)   : baseCo
  const svr = activeDrugData ? Math.min(Math.max(Math.round(baseSvr + activeDrugData.effect.svr),               200), 2400) : baseSvr

  const hr     = 70
  const sv     = Math.round((co * 1000) / hr)
  const map    = calcMAP(co, svr)
  const status = getMAPStatus(map)

  function applyScenario(s: typeof SCENARIOS[0]) {
    setBaseCo(s.co); setBaseSvr(s.svr)
    setActiveScene(s.label); setActiveDrug(null)
  }

  function applyDrug(drug: typeof DRUGS[0]) {
    if (activeDrug === drug.name) { setActiveDrug(null); return }
    setActiveDrug(drug.name); setActiveScene(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* MAP card */}
      <div style={{ ...card, background: SURFACE.raised, borderColor: SURFACE.ruleStrong, padding: '18px 20px', boxShadow: '0 1px 0 rgba(43,33,24,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <MAPArc map={map} status={status} />
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ fontSize: 9.5, fontFamily: 'var(--font-sans)', letterSpacing: '0.18em', textTransform: 'uppercase', color: INK.faint, marginBottom: 6, paddingBottom: 5, borderBottom: `1px solid ${SURFACE.rule}` }}>Mean Arterial Pressure</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 46, fontWeight: 600, fontFamily: 'var(--font-display)', color: PIGMENT.sanguine, lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums lining-nums' }}>{map}</span>
              <span style={{ fontSize: 12, fontFamily: 'var(--font-sans)', color: INK.faint }}>mmHg</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: status.accent, marginTop: 2 }}>{status.label}</div>
            <div style={{ fontSize: 11.5, color: INK.soft, marginTop: 2 }}>{status.sub}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, marginTop: 9, color: INK.faint }}>
              <span style={{ color: PIGMENT.indigo, fontWeight: 600 }}>{co.toFixed(1)}</span>
              <span style={{ color: INK.faint }}> × </span>
              <span style={{ color: PIGMENT.plum, fontWeight: 600 }}>{svr}</span>
              <span style={{ color: INK.faint }}> ÷ 80 = </span>
              <span style={{ color: status.accent }}>{map}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 14px' }}>
            {[
              { abbr: 'CO',  v: co.toFixed(1), unit: 'L/min',     low: N.co.low,  high: N.co.high  },
              { abbr: 'SVR', v: String(svr),   unit: 'dyn·s/cm⁵', low: N.svr.low, high: N.svr.high },
              { abbr: 'HR',  v: String(hr),    unit: 'bpm',        low: N.hr.low,  high: N.hr.high  },
              { abbr: 'SV',  v: String(sv),    unit: 'mL/beat',    low: N.sv.low,  high: N.sv.high  },
            ].map(s => {
              const st = getRangeState(Number(s.v), s.low, s.high)
              return (
                <div key={s.abbr} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-sans)', letterSpacing: '0.08em', color: INK.faint, width: 24 }}>{s.abbr}</span>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: st.color }}>{s.v}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={card}>
        <span style={sLabel}>Adjust Variables</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <ZonedSlider abbr="CO" label="Cardiac Output" value={co} min={1} max={12} step={0.1} unit="L/min" onChange={v => { setBaseCo(v); setActiveDrug(null); setActiveScene(null) }} low={N.co.low} high={N.co.high} />
          <ZonedSlider abbr="SVR" label="Systemic Vascular Resistance" value={svr} min={200} max={2400} step={10} unit="dyn·s/cm⁵" onChange={v => { setBaseSvr(v); setActiveDrug(null); setActiveScene(null) }} low={N.svr.low} high={N.svr.high} />
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
                border: activeScene === s.label ? `1px solid ${SURFACE.ruleStrong}` : `1px solid ${SURFACE.rule}`,
                borderLeft: activeScene === s.label ? `3px solid ${PIGMENT.indigo}` : `1px solid ${SURFACE.rule}`,
                paddingLeft: activeScene === s.label ? 10 : 12,
                background: activeScene === s.label ? SURFACE.raised : 'rgba(43,33,24,0.025)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#2B2118' }}>{s.label}</span>
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, color: tc.text, background: tc.bg, border: `1px solid ${tc.border}` }}>{s.tag}</span>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(43,33,24,0.78)', lineHeight: 1.5 }}>{s.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={sLabel}>Drug Effects</span>
          {activeDrug && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: PIGMENT.indigo }}>{activeDrug} — tap to remove</span>}
        </div>
        <p style={{ fontSize: 11, color: 'rgba(43,33,24,0.78)', lineHeight: 1.6, marginTop: -8, marginBottom: 12 }}>
          Apply a drug to the current state. Tap again to toggle off.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {DRUGS.map(drug => (
            <DrugButton key={drug.name} drug={drug} active={activeDrug === drug.name} onClick={() => applyDrug(drug)} />
          ))}
        </div>
      </div>

      <div style={card}>
        <span style={sLabel}>Variable Detail</span>
        <VarRow abbr="CO"  label="Cardiac Output"               value={co}  unit="L/min"     low={N.co.low}  high={N.co.high}  description="Total blood pumped per minute. CO = HR × SV." />
        <VarRow abbr="SVR" label="Systemic Vascular Resistance"  value={svr} unit="dyn·s/cm⁵" low={N.svr.low} high={N.svr.high} description="Combined resistance of all blood vessels. Higher = tighter vessels." />
        <VarRow abbr="HR"  label="Heart Rate"                    value={hr}  unit="bpm"        low={N.hr.low}  high={N.hr.high}  description="Fixed at 70 bpm for Lesson 1. Covered in Lesson 2." />
        <VarRow abbr="SV"  label="Stroke Volume"                 value={sv}  unit="mL/beat"    low={N.sv.low}  high={N.sv.high}  description="Volume ejected per heartbeat. Derived from CO ÷ HR." />
      </div>

    </div>
  )
}

// ─── Lesson prose ─────────────────────────────────────────────────────────────

function LessonContent() {
  return (
    <div>
      <section style={{ marginBottom: 52 }}>
        <H2>The Big Idea</H2>
        <P>Before we talk about drugs, monitors, or interventions, you need to understand one thing: blood pressure is not a mystery. It is the predictable result of two forces working together — how hard your heart pumps, and how much your blood vessels resist that flow.</P>
        <P>Everything in hemodynamics traces back to this idea. Once you own it, the rest is just filling in detail.</P>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>Mean Arterial Pressure</H2>
        <P>When a nurse reads "120 over 80," those numbers are systolic (peak when the heart contracts) and diastolic (trough when it relaxes). But in critical care and anesthesia, neither of those is the most important number.</P>
        <P>What matters is <strong style={{ color: '#2B2118', fontWeight: 500 }}>Mean Arterial Pressure (MAP)</strong> — the average pressure delivered to your organs continuously throughout the entire cardiac cycle. Your kidneys, brain, and gut experience a continuous pressure, and that pressure is what keeps them alive.</P>
        <Eq>MAP = DBP + ¹⁄₃(SBP − DBP)</Eq>
        <P>For 120/80: MAP = 80 + (40/3) ≈ <strong style={{ color: '#2B2118' }}>93 mmHg</strong>. Normal. Good perfusion.</P>
        <P>The single most important threshold in critical care is <strong style={{ color: '#9E3B26' }}>65 mmHg</strong>. Below this, kidneys, gut, and brain begin to lose adequate blood flow.</P>
        <RangeTable rows={[
          { range: '< 65 mmHg',    label: 'Dangerous', color: '#9E3B26', note: 'Organ perfusion at risk — intervene immediately' },
          { range: '65–70 mmHg',   label: 'Low',       color: '#8A6318', note: 'Close to threshold — monitor closely' },
          { range: '70–100 mmHg',  label: 'Normal',    color: '#4A6B57', note: 'Organs adequately perfused' },
          { range: '101–120 mmHg', label: 'Elevated',  color: '#8A6318', note: 'Sustained hypertension' },
          { range: '> 120 mmHg',   label: 'Crisis',    color: '#9E3B26', note: 'Hypertensive emergency' },
        ]} />
        <Callout label="Try it in the simulator">
          Move the CO slider down to 2 L/min. Watch MAP fall below 65. That's cardiogenic shock from a hemodynamic standpoint.
        </Callout>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>The Master Equation</H2>
        <Eq>MAP = CO × SVR</Eq>
        <P><strong style={{ color: '#2B2118', fontWeight: 500 }}>CO (Cardiac Output)</strong> is the total volume of blood your heart pumps per minute, in L/min. Normal resting: 4–8 L/min.</P>
        <P><strong style={{ color: '#2B2118', fontWeight: 500 }}>SVR (Systemic Vascular Resistance)</strong> is the collective resistance of all blood vessels. Think of a garden hose — pinch the end, pressure builds. Normal: 800–1200 dynes·sec/cm⁵. Higher means tighter vessels.</P>
        <P>If you studied electronics, this is Ohm's Law: MAP is voltage, CO is current, SVR is resistance.</P>
        <Callout label="Try it in the simulator">
          Load "Septic Shock." SVR collapses to 380 — massive vasodilation. MAP crashes even though CO is high. This is why septic shock is treated with vasopressors (raising SVR), not just fluids.
        </Callout>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>Why This Changes Clinical Thinking</H2>
        <P>Because MAP = CO × SVR, there are only ever two root causes of low blood pressure: CO fell, or SVR fell. Every scenario in an ICU or OR traces back to one of those two.</P>
        <P><strong style={{ color: '#2B2118', fontWeight: 500 }}>Septic shock</strong> — SVR crashes from vasodilation. Treat with vasopressors.</P>
        <P><strong style={{ color: '#2B2118', fontWeight: 500 }}>Cardiogenic shock</strong> — CO falls from a damaged heart. Treat with inotropes, not vasopressors.</P>
        <P><strong style={{ color: '#2B2118', fontWeight: 500 }}>Anesthesia induction</strong> — agents vasodilate, SVR drops, MAP falls. Predictable and manageable.</P>
        <P>Same symptom — low blood pressure — three different causes, three different treatments. The equation is what lets you think through which variable is broken.</P>
        <Callout label="Try it in the simulator">
          Apply "Propofol Induction," then apply Phenylephrine. Pure α1 agonist raises SVR with no cardiac effect. Watch MAP recover. This is how anesthesiologists treat induction hypotension.
        </Callout>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>Cardiac Output Has Its Own Equation</H2>
        <Eq>CO = HR × SV</Eq>
        <P><strong style={{ color: '#2B2118', fontWeight: 500 }}>HR</strong> (Heart Rate): 60–100 bpm normal. <strong style={{ color: '#2B2118', fontWeight: 500 }}>SV</strong> (Stroke Volume): 60–100 mL/beat normal.</P>
        <P>70 bpm × 70 mL/beat = 4,900 mL/min ≈ <strong style={{ color: '#2B2118' }}>5 L/min</strong>. Textbook normal cardiac output.</P>
        <P>Low CO can come from a slow HR or a low SV. Treatment is completely different depending on which one is the problem. Lesson 2 covers everything that determines stroke volume.</P>
      </section>

      <section style={{ marginBottom: 52 }}>
        <H2>The Full Picture</H2>
        <Eq>MAP = (HR × SV) × SVR ÷ 80</Eq>
        <P>Every hemodynamic variable in this course connects back to one of these three terms: heart rate, stroke volume, or systemic vascular resistance. HR and SV are fixed in this lesson — Lesson 2 unlocks them. For now, spend time with the drug panel and understand what each drug targets.</P>
      </section>
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Lesson1Dashboard() {
  const bp       = useBreakpoint()
  const isMobile = bp === 'mobile'
  const [tab, setTab] = useState<'lesson' | 'simulator'>('lesson')

  const serif = 'var(--font-display)'

  return (
    <div>
      {/* Lesson header — always visible */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(74,107,87,0.6)', marginBottom: 8 }}>Lesson 1</div>
        <h1 style={{ fontFamily: serif, fontSize: isMobile ? 30 : 38, fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#2B2118', margin: '0 0 8px' }}>
          The Core Equation
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(43,33,24,0.78)', margin: 0, fontStyle: 'italic' }}>
          What drives blood pressure?
        </p>
      </div>

      {isMobile ? (
        // ── Mobile: tab switcher ──
        <div>
          {/* Sticky tab bar */}
          <div style={{
            position: 'sticky', top: 56, zIndex: 50,
            display: 'flex', gap: 0,
            background: '#F2EADB',
            borderBottom: '1px solid #D6C9AE',
            marginBottom: 24, marginLeft: -16, marginRight: -16,
            paddingLeft: 16,
          }}>
            {(['lesson', 'simulator'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '12px 20px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500,
                color: tab === t ? '#2F4858' : 'rgba(43,33,24,0.63)',
                borderBottom: tab === t ? '2px solid #2F4858' : '2px solid transparent',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}>{t}</button>
            ))}
          </div>

          {tab === 'lesson' ? (
            <div>
              <LessonContent />
              {/* CTA to switch to simulator */}
              <button onClick={() => { setTab('simulator'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={{
                width: '100%', padding: '14px', borderRadius: 10, marginBottom: 32,
                border: '1px solid rgba(74,107,87,0.3)', background: 'rgba(74,107,87,0.06)',
                color: '#4A6B57', fontFamily: 'var(--font-mono)', fontSize: 12,
                cursor: 'pointer', letterSpacing: '0.04em',
              }}>
                Open Simulator →
              </button>
            </div>
          ) : (
            <Simulator />
          )}
        </div>
      ) : (
        // ── Desktop / Tablet: two columns ──
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