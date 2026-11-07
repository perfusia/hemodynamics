import { useMemo, useState } from 'react'
import { BASELINE, cloneParams } from '../../model/params'
import { STATES } from '../../model/states'
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
/* Figure 1.1: mean arterial pressure as a time average                      */
/* ------------------------------------------------------------------------ */

function artPanel(map: number, est: number): Panel {
  return {
    height: 190, min: 0, max: 160, unit: 'mmHg', ticks: [0, 40, 80, 120], minor: 10,
    traces: [{ ch: 'Pao', color: 'art', label: 'Pao', width: 2 }],
    rules: [
      { v: map, color: 'ink', label: `MAP ${Math.round(map)}`, dash: [] },
      { v: est, color: 'ink3', label: `DBP + ⅓PP ${Math.round(est)}`, dash: [5, 4], below: est < map },
    ],
  }
}

export function FigureTimeAverage() {
  const [hr, setHr] = useState(72)
  const params = useMemo(() => { const p = cloneParams(BASELINE); p.HR = hr; return p }, [hr])
  const { runner, box, beat, paused, setPaused } = useSim(params, { topology: 'closed', warm: 12 })
  const map = beat?.MAP ?? 82
  const pp = beat ? beat.SBP - beat.DBP : 41
  const est = beat ? beat.DBP + pp / 3 : 77

  return (
    <Figure
      n="1.1"
      interactive
      title="Mean arterial pressure as the time average of the arterial waveform"
      actions={<Button small onClick={() => setPaused(!paused)}>{paused ? 'Play' : 'Pause'}</Button>}
      caption={
        <>
          The arterial pressure waveform from the closed-loop model, with two horizontal lines: the true mean arterial pressure, the
          time integral of pressure over the cycle (solid), and the bedside estimate <M t={String.raw`\mathrm{DBP}+\tfrac{1}{3}(\mathrm{SBP}-\mathrm{DBP})`} /> (dashed).
          The estimate weights diastole by two thirds because diastole normally occupies about two thirds of the cycle. The dashed
          estimate tracks a few mmHg below the true mean at every heart rate, since the real form factor is nearer 0.4; an invasive
          monitor integrates the waveform directly rather than relying on the rule.
        </>
      }
    >
      <div ref={box}>
        <FigGrid
          asideWidth={240}
          aside={
            <>
              <Slider name="Heart rate" value={hr} min={40} max={160} step={1} unit="min⁻¹" onChange={setHr} format={fmt.i} band={[60, 100]} />
              <Readouts
                min={92}
                items={[
                  { k: 'SBP / DBP', v: beat ? fmt.bp(beat.SBP, beat.DBP) : '–', u: 'mmHg', ch: 'art' },
                  { k: 'Pulse pressure', v: fmt.i(pp), u: 'mmHg' },
                  { k: 'MAP (true)', v: fmt.i(map), u: 'mmHg', ch: 'art' },
                  { k: 'DBP + ⅓PP', v: fmt.i(est), u: 'mmHg' },
                  { k: 'Difference', v: fmt.d1(map - est), u: 'mmHg' },
                ]}
              />
            </>
          }
        >
          <Strip runner={runner} panels={[artPanel(map, est)]} window={3} label="Arterial pressure waveform with the true mean and the diastolic-plus-one-third estimate" />
        </FigGrid>
      </div>
    </Figure>
  )
}

/* ------------------------------------------------------------------------ */
/* Figure 1.2: the CO-SVR plane with iso-MAP curves                          */
/* ------------------------------------------------------------------------ */

const CVP_FIXED = 4

function mapOf(co: number, svr: number): number {
  return (co * svr) / 80 + CVP_FIXED
}

const PLANE_PRESETS: Record<string, { label: string; co: number; svr: number }> = {
  normal: { label: 'Normal', co: 5.3, svr: 1180 },
  septic: { label: 'Vasodilatory', co: 8.5, svr: 520 },
  cardiogenic: { label: 'Cardiogenic', co: 3.6, svr: 1620 },
  hemorrhage: { label: 'Hemorrhage', co: 3.6, svr: 1650 },
  crisis: { label: 'Hypertensive', co: 6.0, svr: 2100 },
}

export function FigureMAPPlane() {
  const [co, setCo] = useState(5.3)
  const [svr, setSvr] = useState(1180)
  const [preset, setPreset] = useState<string | null>('normal')
  const map = mapOf(co, svr)
  const set = (patch: { co?: number; svr?: number }) => {
    if (patch.co !== undefined) setCo(patch.co)
    if (patch.svr !== undefined) setSvr(patch.svr)
    setPreset(null)
  }
  const choose = (k: string) => { setCo(PLANE_PRESETS[k].co); setSvr(PLANE_PRESETS[k].svr); setPreset(k) }

  const status = map < 65 ? { t: 'Below threshold', c: 'var(--color-art)' } : map > 110 ? { t: 'Hypertensive', c: 'var(--color-pa)' } : { t: 'Adequate', c: 'var(--color-flow)' }

  // Iso-MAP curves: SVR = 80 (MAP − CVP) / CO.
  const isoMap = (target: number) => {
    const pts: [number, number][] = []
    for (let c = 1.5; c <= 12; c += 0.1) pts.push([c, (80 * (target - CVP_FIXED)) / c])
    return pts
  }

  return (
    <Figure
      n="1.2"
      interactive
      title="The arterial pressure equation as a plane: cardiac output against vascular resistance"
      actions={<Button small onClick={() => choose('normal')}>Reset</Button>}
      caption={
        <>
          Because <M t={String.raw`\mathrm{MAP}\approx \mathrm{CO}\cdot\mathrm{SVR}/80 + \mathrm{CVP}`} />, every combination of cardiac output and
          systemic vascular resistance that gives the same mean pressure lies on one curve (a rectangular hyperbola). The green band is
          the normal operating region; the red line is the 65 mmHg perfusion threshold. Septic shock and a hypertensive crisis can share
          a mean pressure far from normal by moving in opposite directions along these axes, which is why the number alone does not name
          the problem.
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
                options={Object.entries(PLANE_PRESETS).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
            <Slider name="Cardiac output" sym={<M t="\mathrm{CO}" />} value={co} min={1.5} max={12} step={0.1} unit="L·min⁻¹" onChange={(v) => set({ co: v })} format={fmt.d1} band={[4, 8]} />
            <Slider name="Vascular resistance" sym={<M t="\mathrm{SVR}" />} value={svr} min={200} max={2600} step={10} unit="dyn·s·cm⁻⁵" onChange={(v) => set({ svr: v })} format={fmt.i} band={[800, 1200]} />
            <Readouts
              large
              items={[
                { k: 'MAP', v: fmt.i(map), u: 'mmHg', ch: 'art' },
                { k: 'State', v: <span style={{ fontSize: 18, color: status.c }}>{status.t}</span> },
              ]}
            />
          </>
        }
      >
        <Plot
          w={460} h={360} label="Cardiac output against systemic vascular resistance, with curves of constant mean arterial pressure"
          x={{ domain: [1.5, 12], step: 2, minor: 0.5, label: 'Cardiac output (L·min⁻¹)' }}
          y={{ domain: [200, 2600], step: 400, minor: 200, label: 'SVR (dyn·s·cm⁻⁵)' }}
        >
          {(sx, sy) => (
            <g>
              <rect x={sx(4)} y={sy(1200)} width={sx(8) - sx(4)} height={sy(800) - sy(1200)} fill="color-mix(in oklab, var(--color-flow) 9%, transparent)" />
              {[40, 65, 90, 110, 140].map((mp) => {
                const pts = isoMap(mp).filter(([, s]) => s >= 200 && s <= 2600)
                const crit = mp === 65
                const mid = pts[Math.floor(pts.length * 0.62)]
                return (
                  <g key={mp}>
                    <path d={line(pts.map(([c, s]) => [sx(c), sy(s)]))} fill="none" stroke={crit ? 'var(--color-art)' : 'var(--color-curve)'} strokeWidth={crit ? 1.8 : 1.2} strokeDasharray={crit ? '' : '4 4'} />
                    {mid && <text x={sx(mid[0])} y={sy(mid[1]) - 4} fontSize={11} fill={crit ? 'var(--color-art)' : 'var(--color-ink-3)'} fontWeight={crit ? 700 : 400}>{mp}{crit ? ' mmHg' : ''}</text>}
                  </g>
                )
              })}
              <circle cx={sx(Math.min(Math.max(co, 1.5), 12))} cy={sy(Math.min(Math.max(svr, 200), 2600))} r={6} fill={status.c} stroke="var(--color-card)" strokeWidth={1.5} />
            </g>
          )}
        </Plot>
      </FigGrid>
    </Figure>
  )
}

/* ------------------------------------------------------------------------ */
/* Figure 1.3: one low pressure, several causes                              */
/* ------------------------------------------------------------------------ */

const MONITOR_PANELS: Panel[] = [
  { height: 150, min: 0, max: 160, unit: 'mmHg', ticks: [0, 40, 80, 120], minor: 20, traces: [{ ch: 'Pao', color: 'art', label: 'Pao', width: 2 }] },
  { height: 70, min: 0, max: 16, unit: 'mmHg', ticks: [0, 5, 10], minor: 5, traces: [{ ch: 'Pra', color: 'ven', label: 'CVP', width: 1.8 }] },
]

const STATE_OPTS = STATES.map((s) => ({ value: s.id, label: s.name.replace('Hemorrhagic hypovolemia', 'Hemorrhage').replace('Vasodilatory shock', 'Vasodilatory').replace('Cardiogenic shock', 'Cardiogenic').replace('Healthy adult', 'Healthy') }))

export function FigureShockMonitor() {
  const [stateId, setStateId] = useState('healthy')
  const state = useMemo(() => STATES.find((s) => s.id === stateId)!, [stateId])
  const params = useMemo(() => {
    const p = state.apply(cloneParams(BASELINE))
    p.reflex.gain = 1
    p.reflex.Pset = 86
    return p
  }, [state])
  const { runner, box, beat } = useSim(params, { topology: 'closed', warm: 20, seconds: 5 })

  const low = (beat?.MAP ?? 86) < 65
  return (
    <Figure
      n="1.3"
      interactive
      title="One low pressure, several causes"
      caption={
        <>
          The same model, moved into four states with the baroreflex intact. Vasodilatory shock, cardiogenic shock, and hemorrhage can
          all lower mean arterial pressure, but they reach it by different routes: resistance collapses while output is high in the
          first, output falls while resistance climbs in the other two. The treatment follows the mechanism, not the number, which is
          the argument the rest of this course develops. The reflex is why none of these states is as severe as its untreated insult.
        </>
      }
    >
      <div ref={box}>
        <div className="mb-4 font-sans">
          <PanelLabel>Clinical state</PanelLabel>
          <Chips label="State" value={stateId} onChange={setStateId} options={STATE_OPTS} />
          <p className="mt-2.5 mb-0 text-[14px] leading-[1.5] text-ink-2" style={{ fontFamily: 'var(--font-serif)' }}>{state.summary}</p>
        </div>
        <Strip runner={runner} panels={MONITOR_PANELS} window={3.4} label="Arterial pressure and central venous pressure in the selected state" />
        <div className="mt-4">
          <Readouts
            items={[
              { k: 'MAP', v: fmt.i(beat?.MAP ?? NaN), u: beat ? `mmHg · ${fmt.bp(beat.SBP, beat.DBP)}` : 'mmHg', ch: 'art' },
              { k: 'HR', v: fmt.i(beat?.HR ?? NaN), u: 'min⁻¹' },
              { k: 'CO', v: fmt.d1(beat?.CO ?? NaN), u: 'L·min⁻¹', ch: 'flow' },
              { k: 'SV', v: fmt.i(beat?.SV ?? NaN), u: 'mL', ch: 'flow' },
              { k: 'SVR', v: fmt.i(beat?.SVR ?? NaN), u: 'dyn·s·cm⁻⁵', ch: 'load' },
              { k: 'CVP', v: fmt.d1(beat?.CVP ?? NaN), u: 'mmHg', ch: 'ven' },
            ]}
          />
          {low && <p className="mt-2 mb-0 font-sans text-[13.5px] font-semibold" style={{ color: 'var(--color-art)' }}>Mean arterial pressure is below the 65 mmHg perfusion threshold.</p>}
        </div>
      </div>
    </Figure>
  )
}
