import { useMemo } from 'react'
import { BASELINE, cloneParams } from '../model/params'
import { useSim } from '../viz/useSim'
import { Strip, type Panel } from '../viz/Strip'
import { PVDiagram } from '../viz/PVLoop'
import { Button } from '../ui/Controls'

const HERO_PANELS: Panel[] = [
  {
    height: 150, min: 0, max: 140, unit: 'mmHg', ticks: [0, 50, 100], minor: 10,
    traces: [
      { ch: 'Plv', color: 'ink', label: 'Plv', width: 1.6, map: (v) => Math.max(v, 0) },
      { ch: 'Pao', color: 'art', label: 'Pao', width: 2 },
    ],
  },
  {
    height: 70, min: 30, max: 150, unit: 'mL', ticks: [40, 90, 140], minor: 20,
    traces: [{ ch: 'Vlv', color: 'flow', label: 'Vlv', width: 1.9 }],
  },
]

/**
 * The home page's live hero: the closed-loop model recorded as a polygraph
 * and, beside it, the same beats as a pressure-volume loop. No interaction
 * beyond pause; it is the figure the lessons teach the reader to read.
 */
export function HeroFigure() {
  const params = useMemo(() => cloneParams(BASELINE), [])
  const { runner, box, beat, paused, setPaused } = useSim(params, { topology: 'closed', warm: 14, seconds: 5 })

  return (
    <figure className="m-0 overflow-hidden rounded-md border border-rule bg-plate">
      <div className="fig-head">
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
          <span className="label" style={{ fontSize: 13, letterSpacing: '0.06em' }}>Figure 1</span>
          <span className="text-[15px] font-medium">The model at rest</span>
        </div>
        <div className="flex items-center gap-4 font-sans text-[13px] text-ink-2">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: paused ? 'var(--color-ink-3)' : 'var(--color-art)' }} />
            {paused ? 'Paused' : 'Simulating'}
          </span>
          <span className="hidden sm:inline tnum">HR {beat ? Math.round(beat.HR) : 72} min⁻¹</span>
          <Button small onClick={() => setPaused(!paused)}>{paused ? 'Play' : 'Pause'}</Button>
        </div>
      </div>
      <div ref={box} className="flex flex-wrap gap-x-7 gap-y-4 p-4 md:p-5">
        <div className="min-w-0" style={{ flex: '1 1 440px' }}>
          <Strip runner={runner} panels={HERO_PANELS} window={3.2} label="Aortic and left ventricular pressure and left ventricular volume at rest" />
        </div>
        <div className="min-w-0" style={{ flex: '1 1 260px', maxWidth: 360 }}>
          {beat && (
            <PVDiagram
              loops={[{ beat, kind: 'main' }]}
              Ees={params.lv.Ees} V0={params.lv.V0} A={params.lv.A} B={params.lv.B}
              showEa={false} xMax={160} yMax={120}
            />
          )}
        </div>
      </div>
      <figcaption className="px-4 pb-4 text-[15.5px] leading-[1.5] text-ink-2 md:px-5">
        Output of the HemoLab circulation model under baseline conditions, computed beat by beat in your browser. Every lesson
        perturbs this system and reads the result here.
      </figcaption>
    </figure>
  )
}
