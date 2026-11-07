import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { BASELINE, cloneParams, type Params } from '../../model/params'
import { venousReturnCurve, cardiacFunctionCurve, rvrEffective, steadyState, starlingCurve } from '../../model/curves'
import { Figure, FigGrid } from '../../ui/Figure'
import { Button, Chips, PanelLabel, Slider } from '../../ui/Controls'
import { Readouts } from '../../ui/Readouts'
import { fmt } from '../../ui/format'
import { M } from '../../ui/Math'
import { useSim } from '../../viz/useSim'
import { Strip, type Panel } from '../../viz/Strip'
import { Plot } from '../../viz/Plot'
import { line } from '../../viz/scale'

/* ------------------------------------------------------------------------ */
/* Figure 4.1: the Guyton diagram                                            */
/* ------------------------------------------------------------------------ */

interface GState { dV: number; dVusv: number; ees: number }

const GUYTON_PRESETS: Record<string, { label: string; s: GState }> = {
  normal: { label: 'Euvolemia', s: { dV: 0, dVusv: 0, ees: 2.6 } },
  fluid: { label: 'Fluid bolus', s: { dV: 1000, dVusv: 0, ees: 2.6 } },
  hem: { label: 'Hemorrhage', s: { dV: -1000, dVusv: 0, ees: 2.6 } },
  veno: { label: 'Venoconstriction', s: { dV: 0, dVusv: -700, ees: 2.6 } },
  hf: { label: 'Heart failure', s: { dV: 300, dVusv: 0, ees: 0.8 } },
}

function guytonParams(s: GState): Params {
  const p = cloneParams(BASELINE)
  p.Vtot = BASELINE.Vtot + s.dV
  p.Vusv = BASELINE.Vusv + s.dVusv
  p.lv.Ees = s.ees
  p.reflex.gain = 0
  return p
}

const CF_OFFSETS = [-2000, -1500, -1100, -750, -450, -150, 150, 500, 950, 1500, 2200]
const PRAS: number[] = Array.from({ length: 41 }, (_, i) => -3 + i * 0.4)

export function FigureGuyton() {
  const [s, setS] = useState<GState>(GUYTON_PRESETS.normal.s)
  const [preset, setPreset] = useState<string | null>('normal')
  const ds = useDeferredValue(s)

  const set = (patch: Partial<GState>) => { setS((o) => ({ ...o, ...patch })); setPreset(null) }
  const choose = (k: string) => { setS(GUYTON_PRESETS[k].s); setPreset(k) }

  // The cardiac function curve depends only on the heart (and its afterload),
  // so it is traced at baseline volume and recomputed only when contractility
  // changes.
  const cardiac = useMemo(() => {
    const ph = cloneParams(BASELINE)
    ph.lv.Ees = ds.ees
    return cardiacFunctionCurve(ph, CF_OFFSETS)
  }, [ds.ees])

  // The venous return curve and the operating point depend on volume and tone.
  const { vr, op, pmsf } = useMemo(() => {
    const p = guytonParams(ds)
    const o = steadyState(p)
    const rvr = rvrEffective(p)
    return { vr: venousReturnCurve(o.Pmsf, rvr, PRAS), op: o, pmsf: o.Pmsf }
  }, [ds])

  return (
    <Figure
      n="4.1"
      interactive
      title="The Guyton diagram: venous return and cardiac function share one operating point"
      actions={<Button small onClick={() => choose('normal')}>Reset</Button>}
      caption={
        <>
          Two curves computed from the same model. The <span style={{ color: 'var(--color-ven)', fontWeight: 600 }}>venous return</span> curve
          falls as right atrial pressure rises, because the gradient driving blood back to the heart is <M t={String.raw`P_{msf}-P_{RA}`} />;
          it is flat at the left, where the great veins collapse once right atrial pressure falls below atmospheric. The{' '}
          <span style={{ color: 'var(--color-ink)', fontWeight: 600 }}>cardiac function</span> curve rises as filling rises. In the steady
          state cardiac output must equal venous return, so the circulation can sit only at their intersection. Giving volume or
          constricting the veins shifts the venous return curve to the right; a failing heart lowers the cardiac function curve, moving
          the operating point to a higher filling pressure and a lower output.
        </>
      }
    >
      <FigGrid
        asideWidth={280}
        aside={
          <>
            <div>
              <PanelLabel>Clinical state</PanelLabel>
              <Chips label="State" value={preset} onChange={choose}
                options={Object.entries(GUYTON_PRESETS).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
            <Slider name="Blood volume" sym={<>relative to 5,000 mL</>} value={s.dV} min={-1500} max={1500} step={50} unit="mL"
              onChange={(v) => set({ dV: v })} format={(v) => (v > 0 ? `+${fmt.i(v)}` : fmt.i(v))} band={[-100, 100]} />
            <Slider name="Venous tone" sym={<>unstressed volume</>} value={-s.dVusv} min={-400} max={900} step={50} unit="mL"
              onChange={(v) => set({ dVusv: -v })} format={(v) => (v > 0 ? `+${fmt.i(v)}` : fmt.i(v))} />
            <Slider name="Contractility" sym={<M t="E_{es}" />} value={s.ees} min={0.5} max={3.5} step={0.05} unit="mmHg·mL⁻¹"
              onChange={(v) => set({ ees: v })} format={fmt.d2} band={[2.0, 3.2]} />
            <Readouts
              items={[
                { k: <M t="P_{msf}" />, v: fmt.d1(pmsf), u: 'mmHg', ch: 'ven' },
                { k: 'Right atrial P', v: fmt.d1(op.Pra), u: 'mmHg', ch: 'ven' },
                { k: 'Cardiac output', v: fmt.d1(op.CO), u: 'L·min⁻¹', ch: 'flow' },
              ]}
            />
          </>
        }
      >
        <Plot
          w={460} h={360} label="Cardiac output and venous return against right atrial pressure, intersecting at the operating point"
          x={{ domain: [-3, 12], step: 3, minor: 1, label: 'Right atrial pressure (mmHg)' }}
          y={{ domain: [0, 12], step: 3, minor: 1, label: 'Flow (L·min⁻¹)' }}
        >
          {(sx, sy) => {
            const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
            const vrPts = vr.filter((p) => p.Pra >= -3 && p.Pra <= 12).map((p) => [sx(p.Pra), sy(Math.min(p.VR, 12))] as [number, number])
            const cfPts = cardiac.filter((p) => p.Pra >= -3 && p.Pra <= 12).map((p) => [sx(p.Pra), sy(Math.min(p.CO, 12))] as [number, number])
            const opx = sx(clamp(op.Pra, -3, 12))
            const opy = sy(clamp(op.CO, 0, 12))
            return (
              <g>
                <path d={line(cfPts)} fill="none" stroke="var(--color-ink)" strokeWidth={2.2} />
                <path d={line(vrPts)} fill="none" stroke="var(--color-ven)" strokeWidth={2.2} />
                <line x1={opx} y1={sy(0)} x2={opx} y2={opy} stroke="var(--color-ink-3)" strokeWidth={1} strokeDasharray="3 3" />
                <line x1={sx(-3)} y1={opy} x2={opx} y2={opy} stroke="var(--color-ink-3)" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={opx} cy={opy} r={6} fill="var(--color-art)" stroke="var(--color-card)" strokeWidth={1.5} />
                <text x={sx(-2.4)} y={sy(9.3)} fontSize={12} fontWeight={700} fill="var(--color-ink)">Cardiac function</text>
                <text x={sx(pmsf) - 4} y={sy(0.55)} fontSize={11.5} fontWeight={700} fill="var(--color-ven)" textAnchor="end">Venous return</text>
                <text x={sx(Math.min(pmsf, 12))} y={sy(0) + 15} fontSize={11} fill="var(--color-ven)" textAnchor="middle">P<tspan baselineShift="sub" fontSize={8}>msf</tspan></text>
              </g>
            )
          }}
        </Plot>
      </FigGrid>
    </Figure>
  )
}

/* ------------------------------------------------------------------------ */
/* Figure 4.2: dynamic predictors of fluid responsiveness                    */
/* ------------------------------------------------------------------------ */

const FR_PANELS: Panel[] = [
  { height: 150, min: 0, max: 160, unit: 'mmHg', ticks: [0, 40, 80, 120], minor: 20, traces: [{ ch: 'Pao', color: 'art', label: 'Pao', width: 2 }] },
  { height: 54, min: 0, max: 8, unit: 'mmHg', ticks: [0, 4], minor: 2, traces: [{ ch: 'Ppl', color: 'ink3', label: 'Pleural', width: 1.6 }] },
]

const FR_PRESETS: Record<string, { label: string; dV: number }> = {
  hypo: { label: 'Hypovolemia', dV: -500 },
  eu: { label: 'Euvolemia', dV: 0 },
  over: { label: 'Overfilled', dV: 900 },
}

const STARLING_LAPS = [2, 4, 6, 8, 11, 14, 18, 22, 26]

export function FigureFluidResponse() {
  const [dV, setDV] = useState(-400)
  const [preset, setPreset] = useState<string | null>(null)
  const defDV = useDeferredValue(dV)

  const params = useMemo(() => {
    const p = cloneParams(BASELINE)
    p.Vtot = BASELINE.Vtot + defDV
    p.vent = { on: true, RR: 12, Ti: 1 / 3, VT: 8, pplPerVT: 0.5, Ppl0: 1.0 }
    p.reflex.gain = 1
    p.reflex.Pset = 86
    return p
  }, [defDV])

  const { runner, box, beat, reset } = useSim(params, { topology: 'closed', warm: 30, seconds: 7 })

  // Blood volume is a conserved state variable, so a new target volume takes
  // effect only on a re-settle. Reset when the (deferred) volume changes.
  useEffect(() => { reset() }, [defDV]) // eslint-disable-line react-hooks/exhaustive-deps

  // The ventricular function curve, drawn once; the operating point rides it.
  const starling = useMemo(() => starlingCurve(cloneParams(BASELINE), STARLING_LAPS), [])

  // Respiratory pulse-pressure and stroke-volume variation over the last cycle.
  // Recomputed each render, which useSyncExternalStore drives once per beat,
  // so `beat` is the (implicit) clock rather than a memo dependency.
  void beat
  const variation = (() => {
    const bs = runner.beats
    if (bs.length < 6) return null
    const tEnd = bs[bs.length - 1].t
    const win = bs.filter((b) => b.t >= tEnd - 5.2)
    if (win.length < 4) return null
    const pps = win.map((b) => b.SBP - b.DBP)
    const svs = win.map((b) => b.SV)
    const ppv = (100 * (Math.max(...pps) - Math.min(...pps))) / ((Math.max(...pps) + Math.min(...pps)) / 2)
    const svv = (100 * (Math.max(...svs) - Math.min(...svs))) / ((Math.max(...svs) + Math.min(...svs)) / 2)
    return { ppv, svv }
  })()

  const ppv = variation?.ppv ?? NaN
  const responsive = Number.isFinite(ppv) && ppv > 13

  return (
    <Figure
      n="4.2"
      interactive
      title="Dynamic prediction of fluid responsiveness under mechanical ventilation"
      caption={
        <>
          A patient on controlled positive-pressure ventilation. Each breath raises pleural pressure (lower trace), which cyclically
          loads and unloads the right heart and, a few beats later, the left, so the arterial pulse pressure swings with the ventilator.
          The size of that swing, the pulse pressure variation, reports where the ventricle sits on its function curve: large on the
          steep limb, where a fluid bolus will raise stroke volume, and small on the plateau, where it will not. A pulse pressure
          variation above about 13 percent predicts fluid responsiveness in this setting, though the prediction fails outside its
          assumptions (Section 4.6).
        </>
      }
    >
      <div ref={box}>
        <div className="mb-4 font-sans">
          <PanelLabel>Volume state</PanelLabel>
          <Chips label="Volume state" value={preset}
            onChange={(k) => { setDV(FR_PRESETS[k].dV); setPreset(k) }}
            options={Object.entries(FR_PRESETS).map(([k, v]) => ({ value: k, label: v.label }))} />
          <div className="mt-3" style={{ maxWidth: 360 }}>
            <Slider name="Blood volume" sym={<>relative to 5,000 mL</>} value={dV} min={-900} max={1100} step={50} unit="mL"
              onChange={(v) => { setDV(v); setPreset(null) }} format={(v) => (v > 0 ? `+${fmt.i(v)}` : fmt.i(v))} band={[-100, 100]} />
          </div>
        </div>
        <FigGrid
          asideWidth={240}
          aside={
            <>
              <div className="rounded-md border p-3.5" style={{ borderColor: responsive ? 'var(--color-flow)' : 'var(--color-rule)', background: 'var(--color-card)' }}>
                <div className="label" style={{ fontSize: 11, color: 'var(--color-ink-3)' }}>Pulse pressure variation</div>
                <div className="tnum" style={{ fontFamily: 'var(--font-sans)', fontSize: 40, fontWeight: 600, fontStretch: '80%', lineHeight: 1.1, color: responsive ? 'var(--color-flow)' : 'var(--color-ink)' }}>
                  {Number.isFinite(ppv) ? `${fmt.i(ppv)}%` : '–'}
                </div>
                <div className="text-[13.5px] font-semibold" style={{ color: responsive ? 'var(--color-flow)' : 'var(--color-ink-3)' }}>
                  {Number.isFinite(ppv) ? (responsive ? 'Likely fluid responsive' : 'Unlikely to respond') : 'measuring…'}
                </div>
                <div className="mt-1 text-[12px] text-ink-3">threshold about 13%</div>
              </div>
              <Readouts
                min={96}
                items={[
                  { k: 'SVV', v: Number.isFinite(variation?.svv ?? NaN) ? `${fmt.i(variation!.svv)}%` : '–', u: 'variation' },
                  { k: 'SV', v: fmt.i(beat?.SV ?? NaN), u: 'mL', ch: 'flow' },
                  { k: 'CO', v: fmt.d1(beat?.CO ?? NaN), u: 'L·min⁻¹', ch: 'flow' },
                  { k: 'MAP', v: fmt.i(beat?.MAP ?? NaN), u: 'mmHg', ch: 'art' },
                ]}
              />
              <div>
                <PanelLabel>Operating point on the function curve</PanelLabel>
                <Plot
                  w={300} h={180} background label="Stroke volume against filling pressure with the current operating point"
                  pad={{ l: 40, r: 12, t: 12, b: 36 }}
                  x={{ domain: [0, 26], step: 13, minor: 0, label: 'LAP (mmHg)' }}
                  y={{ domain: [0, 110], step: 55, minor: 0, label: 'SV (mL)' }}
                >
                  {(sx, sy) => {
                    const pts = starling.map((p) => [sx(Math.min(p.LAP, 26)), sy(Math.min(p.SV, 110))] as [number, number])
                    const lap = beat?.LAP ?? NaN
                    const sv = beat?.SV ?? NaN
                    return (
                      <g>
                        <path d={line(pts)} fill="none" stroke="var(--color-curve)" strokeWidth={2} />
                        {Number.isFinite(lap) && (
                          <circle cx={sx(Math.min(Math.max(lap, 0), 26))} cy={sy(Math.min(Math.max(sv, 0), 110))} r={5} fill="var(--color-art)" stroke="var(--color-card)" strokeWidth={1.5} />
                        )}
                      </g>
                    )
                  }}
                </Plot>
              </div>
            </>
          }
        >
          <Strip runner={runner} panels={FR_PANELS} window={6.5} label="Arterial pressure and pleural pressure over a respiratory cycle" />
        </FigGrid>
      </div>
    </Figure>
  )
}
