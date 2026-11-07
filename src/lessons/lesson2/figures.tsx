import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { BASELINE, cloneParams, UNITS, type Params } from '../../model/params'
import { Circulation, type Beat } from '../../model/engine'
import { starlingCurve } from '../../model/curves'
import { Figure, FigGrid } from '../../ui/Figure'
import { Button, Chips, PanelLabel, Segmented, Slider } from '../../ui/Controls'
import { Readouts } from '../../ui/Readouts'
import { fmt } from '../../ui/format'
import { M } from '../../ui/Math'
import { useSim } from '../../viz/useSim'
import { Strip, type Panel } from '../../viz/Strip'
import { PVDiagram } from '../../viz/PVLoop'
import { Plot } from '../../viz/Plot'
import { line, linear } from '../../viz/scale'

/* ------------------------------------------------------------------------ */
/* Figure 2.1: the cardiac cycle in pressure and volume                      */
/* ------------------------------------------------------------------------ */

const CYCLE_PANELS: Panel[] = [
  {
    height: 170, min: 0, max: 140, unit: 'mmHg', ticks: [0, 50, 100], minor: 10,
    traces: [
      { ch: 'Ppv', color: 'pa', label: 'Pla', width: 1.5, dash: [6, 4] },
      { ch: 'Plv', color: 'ink', label: 'Plv', width: 1.7, map: (v) => Math.max(v, 0) },
      { ch: 'Pao', color: 'art', label: 'Pao', width: 2 },
    ],
  },
  {
    height: 84, min: 30, max: 150, unit: 'mL', ticks: [40, 90, 140], minor: 10,
    traces: [{ ch: 'Vlv', color: 'flow', label: 'Vlv', width: 2 }],
  },
]

function phaseOf(s: { Qav: number; Qmv: number; e: number }, rising: boolean): string {
  if (s.Qmv > 0.5) return 'Filling'
  if (s.Qav > 0.5) return 'Ejection'
  return rising ? 'Isovolumic contraction' : 'Isovolumic relaxation'
}

export function FigureCycle() {
  const params = useMemo(() => cloneParams(BASELINE), [])
  const [speed, setSpeed] = useState<'1' | '0.25'>('1')
  const { runner, box, beat, paused, setPaused } = useSim(params, { topology: 'lvOpen', warm: 8, speed: Number(speed) })
  const dot = useRef<SVGCircleElement>(null)
  const phase = useRef<HTMLSpanElement>(null)
  const prevE = useRef(0)
  // Same geometry as PVDiagram's plot (460 × 350, volume 0 to 160 mL, pressure 0 to 140 mmHg).
  const sx = useMemo(() => linear([0, 160], [0, 460]), [])
  const sy = useMemo(() => linear([0, 140], [350, 0]), [])

  useEffect(() => {
    const r = runner
    if (!r) return
    return r.onFrame(() => {
      const n = r.sim.now
      if (dot.current) {
        dot.current.setAttribute('cx', sx(n.Vlv).toFixed(1))
        dot.current.setAttribute('cy', sy(Math.max(n.Plv, -2)).toFixed(1))
      }
      const rising = n.e > prevE.current
      prevE.current = n.e
      if (phase.current) phase.current.textContent = phaseOf(n, rising)
    })
  }, [runner, sx, sy])

  return (
    <Figure
      n="2.1"
      interactive
      title="One cardiac cycle, as pressure against time and as pressure against volume"
      actions={
        <>
          <Segmented label="Playback speed" value={speed} onChange={setSpeed}
            options={[{ value: '1', label: 'Real time' }, { value: '0.25', label: '¼ speed' }]} />
          <Button small onClick={() => setPaused(!paused)}>{paused ? 'Play' : 'Pause'}</Button>
        </>
      }
      caption={
        <>
          The isolated left ventricle of the HemoLab model at baseline, filled from a left atrial pressure (Pla) of 9.5 mmHg and
          ejecting into the arterial Windkessel. Left: left atrial, left ventricular and aortic pressure, with left ventricular volume
          below, as a physiological recorder would draw them. Right: the same beats as a pressure-volume loop; the moving point is the
          ventricle now, and the label names the phase it is in. The loop runs counterclockwise: filling along the bottom, isovolumic
          contraction up the right side, ejection across the top, isovolumic relaxation down the left.
        </>
      }
    >
      <div ref={box} className="flex flex-wrap gap-x-7 gap-y-4">
        <div className="min-w-0" style={{ flex: '1 1 460px' }}>
          <Strip runner={runner} panels={CYCLE_PANELS} window={2.6} label="Left atrial, left ventricular and aortic pressure, and left ventricular volume, against time" />
        </div>
        <div className="min-w-0" style={{ flex: '1 1 300px', maxWidth: 380 }}>
          <div className="mb-2 flex items-baseline justify-between font-sans text-[13.5px]">
            <span className="text-ink-3">Phase</span>
            <span ref={phase} className="font-semibold" aria-live="off">Filling</span>
          </div>
          {beat && (
            <PVDiagram
              loops={[{ beat, kind: 'main' }]}
              Ees={params.lv.Ees} V0={params.lv.V0} A={params.lv.A} B={params.lv.B}
              showEa={false} xMax={160} yMax={140}
              extra={(px, py) => (
                <circle ref={dot} r={6} cx={px(beat.EDV)} cy={py(beat.EDP)} fill="var(--color-ink)" stroke="var(--color-card)" strokeWidth={2} />
              )}
            />
          )}
        </div>
      </div>
    </Figure>
  )
}

/* ------------------------------------------------------------------------ */
/* Figure 2.2: ventricular-arterial coupling                                */
/* ------------------------------------------------------------------------ */

interface CouplingState { lap: number; ees: number; svr: number; hr: number }

const BASE_SVR = Math.round(UNITS.toDyn(BASELINE.Rs + BASELINE.Zc))
const COUPLING_PRESETS: Record<string, { label: string; s: CouplingState }> = {
  base: { label: 'Baseline', s: { lap: 9.5, ees: 2.6, svr: BASE_SVR, hr: 72 } },
  hypo: { label: 'Hypovolemia', s: { lap: 4, ees: 2.6, svr: 1450, hr: 100 } },
  hfref: { label: 'HFrEF', s: { lap: 18, ees: 1.0, svr: 1450, hr: 88 } },
  unload: { label: 'HFrEF, unloaded', s: { lap: 18, ees: 1.0, svr: 725, hr: 88 } },
  ino: { label: 'Inotropy', s: { lap: 9.5, ees: 4.2, svr: BASE_SVR, hr: 80 } },
}

function couplingParams(s: CouplingState): Params {
  const p = cloneParams(BASELINE)
  p.Pla = s.lap
  p.lv.Ees = s.ees
  p.Rs = Math.max(0.05, UNITS.fromDyn(s.svr) - p.Zc)
  p.HR = s.hr
  return p
}

/** Steady-state reference loop for the baseline ghost. */
function steadyBeat(p: Params): Beat {
  return new Circulation(p, 'lvOpen').settle(20, 0.001, 0.0005)
}

export function FigureCoupling() {
  const [s, setS] = useState<CouplingState>(COUPLING_PRESETS.base.s)
  const [preset, setPreset] = useState<string | null>('base')
  const params = useMemo(() => couplingParams(s), [s])
  const { box, beat, reset } = useSim(params, { topology: 'lvOpen', warm: 8 })
  const ghost = useMemo(() => steadyBeat(couplingParams(COUPLING_PRESETS.base.s)), [])

  const set = (patch: Partial<CouplingState>) => { setS((o) => ({ ...o, ...patch })); setPreset(null) }
  const choose = (k: string) => { setS(COUPLING_PRESETS[k].s); setPreset(k) }

  // Analytic prediction from Eq. 2.8 with Ea ≈ R/T, for comparison with the model.
  const R = UNITS.fromDyn(s.svr)
  const T = 60 / s.hr
  const EaApprox = R / T
  const svPred = beat ? (s.ees * (beat.EDV - params.lv.V0)) / (s.ees + EaApprox) : NaN
  const Ea = beat ? beat.ESP / beat.SV : NaN

  return (
    <Figure
      n="2.2"
      interactive
      title="Ventricular-arterial coupling in the ejecting left ventricle"
      actions={<Button small onClick={() => { choose('base'); reset() }}>Reset</Button>}
      caption={
        <>
          The end-systolic point (red) lies where the ESPVR, slope <M t="E_{es}" />, meets the effective arterial elastance line,
          slope <M t="-E_a" />, drawn from <M t="\mathrm{EDV}" /> on the volume axis. The dashed loop is the baseline ventricle for
          reference. Raising left atrial pressure moves the loop along a fixed ESPVR; changing contractility rotates the ESPVR about{' '}
          <M t="V_0" />; changing resistance or heart rate rotates the <M t="E_a" /> line. The last readout compares the model's stroke
          volume with the prediction of Equation 2.8 using <M t="E_a \approx R/T" />.
        </>
      }
    >
      <div ref={box}>
        <FigGrid
          aside={
            <>
              <div>
                <PanelLabel>Preset</PanelLabel>
                <Chips label="Preset" value={preset} onChange={choose}
                  options={Object.entries(COUPLING_PRESETS).map(([k, v]) => ({ value: k, label: v.label }))} />
              </div>
              <Slider name="Preload" sym={<>left atrial pressure</>} value={s.lap} min={2} max={26} step={0.5} unit="mmHg"
                onChange={(v) => set({ lap: v })} format={fmt.d1} band={[6, 12]} />
              <Slider name="Contractility" sym={<M t="E_{es}" />} value={s.ees} min={0.5} max={5} step={0.05} unit="mmHg·mL⁻¹"
                onChange={(v) => set({ ees: v })} format={fmt.d2} />
              <Slider name="Systemic resistance" sym={<M t="R" />} value={s.svr} min={400} max={2600} step={10} unit="dyn·s·cm⁻⁵"
                onChange={(v) => set({ svr: v })} format={fmt.i} band={[800, 1200]} />
              <Slider name="Heart rate" value={s.hr} min={40} max={180} step={1} unit="min⁻¹"
                onChange={(v) => set({ hr: v })} format={fmt.i} band={[60, 100]} />
            </>
          }
        >
          {beat && (
            <PVDiagram
              loops={[{ beat: ghost, kind: 'ghost' }, { beat, kind: 'main' }]}
              Ees={s.ees} V0={params.lv.V0} A={params.lv.A} B={params.lv.B}
              xMax={220} yMax={160}
            />
          )}
        </FigGrid>
        <div className="mt-4">
          <Readouts
            items={[
              { k: 'EDV', v: fmt.i(beat?.EDV ?? NaN), u: 'mL' },
              { k: 'ESV', v: fmt.i(beat?.ESV ?? NaN), u: 'mL' },
              { k: 'SV', v: fmt.i(beat?.SV ?? NaN), u: 'mL', ch: 'flow' },
              { k: 'EF', v: fmt.pct(beat?.EF ?? NaN), u: 'percent' },
              { k: <>E<sub>a</sub></>, v: fmt.d2(Ea), u: 'mmHg·mL⁻¹', ch: 'load' },
              { k: <>E<sub>a</sub>/E<sub>es</sub></>, v: fmt.d2(Ea / s.ees), u: 'ratio' },
              { k: 'MAP', v: fmt.i(beat?.MAP ?? NaN), u: beat ? `mmHg · ${fmt.bp(beat.SBP, beat.DBP)}` : 'mmHg', ch: 'art' },
              { k: 'CO', v: fmt.d1(beat?.CO ?? NaN), u: 'L·min⁻¹', ch: 'flow' },
              { k: 'SW', v: fmt.i(beat?.SW ?? NaN), u: 'mmHg·mL' },
              { k: 'Eq. 2.8 SV', v: fmt.i(svPred), u: beat ? `model ${fmt.i(beat.SV)} mL` : 'mL' },
            ]}
          />
        </div>
      </div>
    </Figure>
  )
}

/* ------------------------------------------------------------------------ */
/* Figure 2.3: function curves computed by the model                        */
/* ------------------------------------------------------------------------ */

const LAPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 17, 20, 24, 28]
const HRS = [40, 50, 60, 70, 80, 90, 100, 115, 130, 145, 160, 175, 190, 205]

function hrCurve(p: Params, hrs: number[]): { HR: number; CO: number; SV: number }[] {
  return hrs.map((HR) => {
    const q = cloneParams(p); q.HR = HR
    const b = new Circulation(q, 'lvOpen').settle(20, 0.002, 0.0005)
    return { HR, CO: b.CO, SV: b.SV }
  })
}

export function FigureCurves() {
  const [mode, setMode] = useState<'preload' | 'rate'>('preload')
  const [ees, setEes] = useState(2.6)
  const [lap, setLap] = useState(9.5)
  const [hr, setHr] = useState(72)
  const [relax, setRelax] = useState<'normal' | 'slow'>('normal')
  const dEes = useDeferredValue(ees)
  const dRelax = useDeferredValue(relax)

  const base = useMemo(() => {
    const p = cloneParams(BASELINE)
    p.lv.Ees = dEes
    if (dRelax === 'slow') { p.relaxFrac = BASELINE.relaxFrac * 2.2; p.lv.B = BASELINE.lv.B * 1.25 }
    return p
  }, [dEes, dRelax])

  const curves = useMemo(() => {
    if (mode !== 'preload') return null
    const mk = (f: number) => { const p = cloneParams(base); p.lv.Ees = base.lv.Ees * f; return starlingCurve(p, LAPS) }
    return { lo: mk(0.5), mid: mk(1), hi: mk(1.6) }
  }, [base, mode])

  const rate = useMemo(() => {
    if (mode !== 'rate') return null
    const slow = cloneParams(base); slow.relaxFrac = BASELINE.relaxFrac * 2.2; slow.lv.B = BASELINE.lv.B * 1.25
    const norm = cloneParams(base); norm.relaxFrac = BASELINE.relaxFrac; norm.lv.B = BASELINE.lv.B
    return { norm: hrCurve(norm, HRS), slow: hrCurve(slow, HRS) }
  }, [base, mode])

  const at = useMemo(() => {
    const q = cloneParams(base); q.Pla = lap; q.HR = hr
    const b0 = new Circulation(q, 'lvOpen').settle(20, 0.002, 0.0005)
    const q2 = cloneParams(q); q2.Pla = lap + 2
    const b1 = new Circulation(q2, 'lvOpen').settle(20, 0.002, 0.0005)
    return { b: b0, slope: (b1.SV - b0.SV) / 2 }
  }, [base, lap, hr])

  return (
    <Figure
      n="2.3"
      interactive
      title={mode === 'preload' ? 'Ventricular function curves: stroke volume against filling pressure' : 'Cardiac output against heart rate at a fixed filling pressure'}
      actions={
        <Segmented label="Curve" value={mode} onChange={setMode}
          options={[{ value: 'preload', label: 'A · Preload' }, { value: 'rate', label: 'B · Heart rate' }]} />
      }
      caption={
        mode === 'preload' ? (
          <>
            Each point on these curves is a separate steady state of the model's isolated left ventricle at the stated left atrial
            pressure; nothing is drawn by hand. The middle curve uses the contractility set on the slider, the outer curves half and
            1.6 times that value. The marker is the operating point, and the readout gives the local slope, the stroke volume gained
            per mmHg of added filling pressure. The curves flatten because the EDPVR is exponential: each increment of pressure buys
            less volume.
          </>
        ) : (
          <>
            Cardiac output of the isolated ventricle at a fixed left atrial pressure as heart rate is varied. With normal relaxation,
            output rises nearly in proportion to rate until diastole becomes too short to fill the ventricle. When relaxation is slowed
            and the chamber is stiffer, as in left ventricular hypertrophy or ischemia, the peak arrives at a lower rate and is lower.
          </>
        )
      }
    >
      <FigGrid
        aside={
          <>
            <Slider name="Contractility" sym={<M t="E_{es}" />} value={ees} min={0.8} max={4.5} step={0.05} unit="mmHg·mL⁻¹" onChange={setEes} format={fmt.d2} />
            {mode === 'preload' ? (
              <Slider name="Operating point" sym={<>left atrial pressure</>} value={lap} min={1} max={26} step={0.5} unit="mmHg" onChange={setLap} format={fmt.d1} band={[6, 12]} />
            ) : (
              <>
                <Slider name="Operating point" sym={<>heart rate</>} value={hr} min={40} max={200} step={1} unit="min⁻¹" onChange={setHr} format={fmt.i} band={[60, 100]} />
                <div>
                  <PanelLabel>Relaxation of the marked ventricle</PanelLabel>
                  <Segmented label="Relaxation" value={relax} onChange={setRelax}
                    options={[{ value: 'normal', label: 'Normal' }, { value: 'slow', label: 'Impaired' }]} />
                </div>
              </>
            )}
            <Readouts
              items={mode === 'preload'
                ? [
                    { k: 'EDV', v: fmt.i(at.b.EDV), u: 'mL' },
                    { k: 'SV', v: fmt.i(at.b.SV), u: 'mL', ch: 'flow' },
                    { k: 'Slope', v: fmt.d1(at.slope), u: 'mL per mmHg' },
                  ]
                : [
                    { k: 'SV', v: fmt.i(at.b.SV), u: 'mL', ch: 'flow' },
                    { k: 'CO', v: fmt.d1(at.b.CO), u: 'L·min⁻¹', ch: 'flow' },
                    { k: 'Diastole', v: fmt.i(1000 * (60 / hr - BASELINE.tPeak * Math.sqrt(60 / hr / 0.857) * (1 + (relax === 'slow' ? BASELINE.relaxFrac * 2.2 : BASELINE.relaxFrac)))), u: 'ms of zero activation' },
                  ]}
            />
          </>
        }
      >
        {mode === 'preload' && curves && (
          <Plot w={460} h={330} label="Stroke volume against left atrial pressure for three contractile states"
            x={{ domain: [0, 28], step: 4, minor: 1, label: 'Left atrial pressure (mmHg)' }}
            y={{ domain: [0, 140], step: 20, minor: 10, label: 'Stroke volume (mL)' }}>
            {(sx, sy) => (
              <g>
                <rect x={sx(6)} y={0} width={sx(12) - sx(6)} height={330} fill="color-mix(in oklab, var(--color-ok) 8%, transparent)" />
                <path d={line(curves.lo.map((p) => [sx(p.LAP), sy(p.SV)]))} fill="none" stroke="var(--color-curve)" strokeWidth={1.4} strokeDasharray="5 4" />
                <path d={line(curves.hi.map((p) => [sx(p.LAP), sy(p.SV)]))} fill="none" stroke="var(--color-curve)" strokeWidth={1.4} strokeDasharray="5 4" />
                <path d={line(curves.mid.map((p) => [sx(p.LAP), sy(p.SV)]))} fill="none" stroke="var(--color-flow)" strokeWidth={2.4} />
                <text x={sx(27.6)} y={sy(curves.hi[curves.hi.length - 1].SV) - 8} fontSize={12} textAnchor="end" fill="var(--color-ink-3)">1.6 × E<tspan baselineShift="sub" fontSize={9}>es</tspan></text>
                <text x={sx(27.6)} y={sy(curves.lo[curves.lo.length - 1].SV) - 8} fontSize={12} textAnchor="end" fill="var(--color-ink-3)">0.5 × E<tspan baselineShift="sub" fontSize={9}>es</tspan></text>
                <circle cx={sx(lap)} cy={sy(at.b.SV)} r={6} fill="var(--color-art)" />
                <text x={sx(6) + 4} y={14} fontSize={11.5} fill="var(--color-ink-3)">usual range</text>
              </g>
            )}
          </Plot>
        )}
        {mode === 'rate' && rate && (
          <Plot w={460} h={330} label="Cardiac output against heart rate for normal and impaired relaxation"
            x={{ domain: [40, 205], step: 20, minor: 10, label: 'Heart rate (min⁻¹)', fmt: (v) => (v > 200 ? '' : String(v)) }}
            y={{ domain: [0, 12], step: 2, minor: 1, label: 'Cardiac output (L·min⁻¹)' }}>
            {(sx, sy) => (
              <g>
                <path d={line(rate.slow.map((p) => [sx(p.HR), sy(p.CO)]))} fill="none" stroke="var(--color-curve)" strokeWidth={2} strokeDasharray="6 4" />
                <path d={line(rate.norm.map((p) => [sx(p.HR), sy(p.CO)]))} fill="none" stroke="var(--color-flow)" strokeWidth={2.4} />
                <text x={sx(110)} y={sy(rate.norm[7].CO) - 10} fontSize={12} fill="var(--color-flow)" fontWeight={700}>normal relaxation</text>
                <text x={sx(150)} y={sy(rate.slow[9].CO) + 22} fontSize={12} fill="var(--color-ink-3)" fontWeight={700}>impaired relaxation</text>
                <circle cx={sx(hr)} cy={sy(at.b.CO)} r={6} fill="var(--color-art)" />
              </g>
            )}
          </Plot>
        )}
      </FigGrid>
    </Figure>
  )
}
