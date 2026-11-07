import { useMemo, useState } from 'react'
import { BASELINE, cloneParams, type Params } from '../../model/params'
import { Circulation, type Beat } from '../../model/engine'
import { Figure, FigGrid } from '../../ui/Figure'
import { Button, PanelLabel, Segmented, Slider } from '../../ui/Controls'
import { Readouts } from '../../ui/Readouts'
import { fmt } from '../../ui/format'
import { M } from '../../ui/Math'
import { useSim } from '../../viz/useSim'
import { Strip, type Panel } from '../../viz/Strip'
import { Plot } from '../../viz/Plot'
import { Trend, type TrendSeries } from '../../viz/Trend'
import { line } from '../../viz/scale'

/* ------------------------------------------------------------------------ */
/* Figure 3.1: Poiseuille's law and the fourth-power dependence              */
/* ------------------------------------------------------------------------ */

/** Relative resistance from the Hagen-Poiseuille law, R proportional to 1/r^4. */
const relR = (radius: number) => 1 / radius ** 4

export function FigurePoiseuille() {
  const [radius, setRadius] = useState(1)
  const mult = relR(radius)
  const pctTone = Math.round((1 - radius) * 100)
  const toneWord = radius < 0.98 ? `${Math.abs(pctTone)}% constriction` : radius > 1.02 ? `${Math.abs(pctTone)}% dilation` : 'resting tone'

  const curve = useMemo(() => {
    const pts: [number, number][] = []
    for (let x = 0.5; x <= 2.0001; x += 0.02) pts.push([x, Math.min(relR(x), 16)])
    return pts
  }, [])

  return (
    <Figure
      n="3.1"
      interactive
      title="Resistance and the fourth power of the radius"
      actions={<Button small onClick={() => setRadius(1)}>Reset</Button>}
      caption={
        <>
          The Hagen-Poiseuille law for steady laminar flow of a Newtonian fluid through a rigid tube: resistance varies with the inverse
          fourth power of the radius, so halving the radius raises resistance sixteenfold. This is the physical law for a single vessel,
          distinct from the model's lumped systemic resistance, but it is why the arterioles, whose smooth muscle sets their radius, are
          the vessels that control resistance. A 16 percent narrowing is enough to double the resistance of a bed; a modest change in
          tone, applied across millions of arterioles, moves the whole circulation.
        </>
      }
    >
      <FigGrid
        asideWidth={250}
        aside={
          <>
            <Slider name="Vessel radius" sym={<>relative to resting</>} value={radius} min={0.5} max={2} step={0.02} unit="×" onChange={setRadius} format={fmt.d2} band={[0.98, 1.02]} />
            <Readouts
              large
              min={120}
              items={[
                { k: 'Resistance', v: `${fmt.d2(mult)}×`, u: 'of resting' },
                { k: 'Arteriolar tone', v: <span style={{ fontSize: 17 }}>{toneWord}</span> },
              ]}
            />
            <p className="m-0 text-[13.5px] leading-[1.5] text-ink-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Resistance scales as <M t={String.raw`(r_0/r)^4`} />. To double resistance the radius need fall only to 0.84 of resting; to
              halve flow at a fixed pressure, the same.
            </p>
          </>
        }
      >
        <Plot
          w={460} h={340} label="Relative resistance against vessel radius, showing the inverse fourth-power law"
          x={{ domain: [0.5, 2], step: 0.5, minor: 0.1, label: 'Vessel radius (relative to resting)' }}
          y={{ domain: [0, 16], step: 4, minor: 1, label: 'Resistance (relative)' }}
        >
          {(sx, sy) => (
            <g>
              <line x1={sx(0.5)} x2={sx(2)} y1={sy(1)} y2={sy(1)} stroke="var(--color-grid-major)" strokeWidth={1} strokeDasharray="4 4" />
              <text x={sx(1.55)} y={sy(1) - 6} fontSize={11} fill="var(--color-ink-3)">resting resistance</text>
              <path d={line(curve.map(([x, y]) => [sx(x), sy(y)]))} fill="none" stroke="var(--color-load)" strokeWidth={2.4} />
              <line x1={sx(radius)} x2={sx(radius)} y1={sy(0)} y2={sy(Math.min(mult, 16))} stroke="var(--color-ink-3)" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={sx(radius)} cy={sy(Math.min(mult, 16))} r={6} fill="var(--color-load)" stroke="var(--color-card)" strokeWidth={1.5} />
            </g>
          )}
        </Plot>
      </FigGrid>
    </Figure>
  )
}

/* ------------------------------------------------------------------------ */
/* Figure 3.2: the arterial Windkessel                                       */
/* ------------------------------------------------------------------------ */

const WK_PANEL = (map: number): Panel => ({
  height: 190, min: 0, max: 160, unit: 'mmHg', ticks: [0, 40, 80, 120], minor: 10,
  traces: [{ ch: 'Pao', color: 'art', label: 'Pao', width: 2 }],
  rules: [{ v: map, color: 'ink', label: `MAP ${Math.round(map)}`, dash: [] }],
})

const WK_PRESETS = [
  { value: 'stiff', label: 'Stiff (aged)' },
  { value: 'normal', label: 'Normal' },
  { value: 'compliant', label: 'Compliant (young)' },
] as const
const WK_CSA: Record<string, number> = { stiff: 0.9, normal: 1.8, compliant: 2.7 }

export function FigureWindkessel() {
  const [csa, setCsa] = useState(1.8)
  const params = useMemo(() => { const p = cloneParams(BASELINE); p.Csa = csa; return p }, [csa])
  const { runner, box, beat, paused, setPaused } = useSim(params, { topology: 'closed', warm: 12 })
  const pp = beat ? beat.SBP - beat.DBP : 41

  return (
    <Figure
      n="3.2"
      interactive
      title="The arterial Windkessel: compliance sets pulse pressure"
      actions={<Button small onClick={() => setPaused(!paused)}>{paused ? 'Play' : 'Pause'}</Button>}
      caption={
        <>
          The large arteries store part of each stroke volume in systole and return it in diastole, which buffers the pulse. Pulse
          pressure is set chiefly by the ratio of stroke volume to arterial compliance, <M t={String.raw`\mathrm{PP}\approx \mathrm{SV}/C_{sa}`} />.
          Lowering the compliance from a young adult's value to an aged, stiffened aorta widens the pulse from about 41 to 64 mmHg while
          the mean pressure barely moves, because the mean is set by output and resistance, not by compliance. Isolated systolic
          hypertension in older patients is this effect.
        </>
      }
    >
      <div ref={box}>
        <div className="mb-4 font-sans">
          <PanelLabel>Arterial wall</PanelLabel>
          <Segmented label="Arterial compliance preset" value={Object.keys(WK_CSA).find((k) => WK_CSA[k] === csa) ?? 'normal'}
            onChange={(k) => setCsa(WK_CSA[k])} options={WK_PRESETS.map((p) => ({ value: p.value, label: p.label }))} />
        </div>
        <FigGrid
          asideWidth={250}
          aside={
            <>
              <Slider name="Arterial compliance" sym={<M t="C_{sa}" />} value={csa} min={0.6} max={3} step={0.05} unit="mL·mmHg⁻¹" onChange={setCsa} format={fmt.d2} band={[1.5, 2.2]} />
              <Readouts
                min={96}
                items={[
                  { k: 'SBP / DBP', v: beat ? fmt.bp(beat.SBP, beat.DBP) : '–', u: 'mmHg', ch: 'art' },
                  { k: 'Pulse pressure', v: fmt.i(pp), u: 'mmHg', ch: 'art' },
                  { k: 'MAP', v: fmt.i(beat?.MAP ?? NaN), u: 'mmHg', ch: 'art' },
                  { k: 'CO', v: fmt.d1(beat?.CO ?? NaN), u: 'L·min⁻¹', ch: 'flow' },
                ]}
              />
            </>
          }
        >
          <Strip runner={runner} panels={[WK_PANEL(beat?.MAP ?? 82)]} window={3} label="Arterial pressure waveform at the selected arterial compliance" />
        </FigGrid>
      </div>
    </Figure>
  )
}

/* ------------------------------------------------------------------------ */
/* Figure 3.3: baroreflex compensation                                       */
/* ------------------------------------------------------------------------ */

type Pert = 'hemorrhage' | 'vasodilation'
type Reflex = 'intact' | 'absent'

interface Traj { beats: Beat[]; evT: number; final: Beat; baseMAP: number }

function trajectory(pert: Pert, reflex: Reflex): Traj {
  const p: Params = cloneParams(BASELINE)
  p.reflex.gain = reflex === 'intact' ? 1 : 0
  p.reflex.Pset = 86
  const c = new Circulation(p, 'closed')
  c.settle(25, 0.001, 0.0005)
  const raw: Beat[] = []
  const t0 = c.t
  c.onBeat = (b) => raw.push(b)
  c.advance(8, 0.0005)
  const evT = c.t - t0
  const baseMAP = c.last ? c.last.MAP : 84
  if (pert === 'hemorrhage') {
    c.infuse(-0.2 * BASELINE.Vtot, 20)
  } else {
    const p2 = cloneParams(p); p2.Rs = p.Rs * 0.5; c.setParams(p2)
  }
  c.advance(112, 0.0005)
  c.onBeat = null
  const beats = raw.map((b) => ({ ...b, t: b.t - t0 }))
  return { beats, evT, final: beats[beats.length - 1], baseMAP }
}

const TREND_SERIES: TrendSeries[] = [
  { key: 'map', label: 'MAP', unit: 'mmHg', color: 'art', min: 0, max: 120, value: (b) => b.MAP, ticks: [0, 40, 80, 120] },
  { key: 'hr', label: 'HR', unit: 'min⁻¹', color: 'ink', min: 40, max: 160, value: (b) => b.HR, ticks: [60, 100, 140] },
  { key: 'svr', label: 'SVR', unit: 'dyn·s·cm⁻⁵', color: 'load', min: 400, max: 2200, value: (b) => b.SVR, ticks: [800, 1400, 2000] },
]

export function FigureBaroreflex() {
  const [pert, setPert] = useState<Pert>('hemorrhage')
  const [reflex, setReflex] = useState<Reflex>('intact')
  const traj = useMemo(() => trajectory(pert, reflex), [pert, reflex])
  const evLabel = pert === 'hemorrhage' ? '20% hemorrhage' : 'vasodilation'
  const defended = traj.final.MAP >= 65

  return (
    <Figure
      n="3.3"
      interactive
      title="The baroreflex defends the pressure"
      caption={
        <>
          The closed-loop model subjected to a 20 percent hemorrhage over 20 s, or an abrupt halving of arteriolar resistance, with the
          baroreflex intact or absent. With the reflex intact, heart rate and systemic vascular resistance rise within seconds and the
          mean pressure is held near its set point; with it absent, the same insult drives the mean pressure to shock levels. The reflex
          is a short-term buffer: it defends pressure at the cost of a tachycardia and a vasoconstriction that are themselves signs of
          the underlying problem.
        </>
      }
    >
      <div className="mb-4 flex flex-wrap gap-x-8 gap-y-3 font-sans">
        <div>
          <PanelLabel>Insult</PanelLabel>
          <Segmented label="Perturbation" value={pert} onChange={setPert}
            options={[{ value: 'hemorrhage', label: 'Hemorrhage' }, { value: 'vasodilation', label: 'Vasodilation' }]} />
        </div>
        <div>
          <PanelLabel>Baroreflex</PanelLabel>
          <Segmented label="Reflex state" value={reflex} onChange={setReflex}
            options={[{ value: 'intact', label: 'Intact' }, { value: 'absent', label: 'Absent' }]} />
        </div>
      </div>
      <Trend beats={traj.beats} series={TREND_SERIES} window={125} events={[{ t: traj.evT, label: evLabel }]} label={`Mean arterial pressure, heart rate and systemic vascular resistance over time after ${evLabel}, reflex ${reflex}`} />
      <div className="mt-4">
        <Readouts
          items={[
            { k: 'Baseline MAP', v: fmt.i(traj.baseMAP), u: 'mmHg' },
            { k: 'Final MAP', v: fmt.i(traj.final.MAP), u: 'mmHg', ch: 'art' },
            { k: 'Final HR', v: fmt.i(traj.final.HR), u: 'min⁻¹' },
            { k: 'Final SVR', v: fmt.i(traj.final.SVR), u: 'dyn·s·cm⁻⁵', ch: 'load' },
            { k: 'Final CO', v: fmt.d1(traj.final.CO), u: 'L·min⁻¹', ch: 'flow' },
          ]}
        />
        <p className="mt-2 mb-0 font-sans text-[13.5px] font-semibold" style={{ color: defended ? 'var(--color-flow)' : 'var(--color-art)' }}>
          {defended
            ? 'Mean arterial pressure is held above the 65 mmHg threshold.'
            : 'Mean arterial pressure has fallen below the 65 mmHg threshold.'}
        </p>
      </div>
    </Figure>
  )
}
