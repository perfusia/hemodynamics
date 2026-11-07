import type { ReactNode } from 'react'
import type { Beat } from '../model/engine'
import { Plot } from './Plot'
import { line, type Scale } from './scale'

export interface LoopSpec {
  beat: Beat
  kind: 'main' | 'ghost'
  label?: string
}

function loopPath(b: Beat, sx: Scale, sy: Scale): string {
  const pts: [number, number][] = []
  for (let i = 0; i < b.loop.length; i += 2) pts.push([sx(b.loop[i]), sy(Math.max(-2, b.loop[i + 1]))])
  return line(pts) + 'Z'
}

/**
 * Left ventricular pressure-volume diagram: loops, the ESPVR (a line through
 * V0 with slope Ees), the EDPVR, and optionally the effective arterial
 * elastance line from EDV on the volume axis to the end-systolic point.
 */
export function PVDiagram({
  loops, Ees, V0, A, B, showEa = true, xMax = 200, yMax = 160, extra, label = 'Left ventricular pressure-volume loop',
}: {
  loops: LoopSpec[]
  Ees: number
  V0: number
  A: number
  B: number
  showEa?: boolean
  xMax?: number
  yMax?: number
  extra?: (sx: Scale, sy: Scale) => ReactNode
  label?: string
}) {
  const main = loops.find((l) => l.kind === 'main')?.beat
  return (
    <Plot
      w={460} h={350}
      x={{ domain: [0, xMax], step: xMax > 200 ? 50 : 40, minor: 10, label: 'Left ventricular volume (mL)' }}
      y={{ domain: [0, yMax], step: yMax > 160 ? 40 : 40, minor: 10, label: 'LV pressure (mmHg)' }}
      label={label}
    >
      {(sx, sy) => {
        const vTop = Math.min(V0 + yMax / Ees, xMax)
        const edp: [number, number][] = []
        for (let v = V0; v <= xMax; v += 2) {
          const P = A * (Math.exp(B * (v - V0)) - 1)
          if (P > yMax) break
          edp.push([sx(v), sy(P)])
        }
        const esX = main ? sx(main.ESV) : 0
        const esY = main ? sy(main.ESP) : 0
        return (
          <g>
            <path d={line(edp)} fill="none" stroke="var(--color-curve)" strokeWidth={1.4} />
            <path d={line([[sx(V0), sy(0)], [sx(vTop), sy(Ees * (vTop - V0))]])} fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
            {loops.filter((l) => l.kind === 'ghost').map((l, i) => (
              <path key={i} d={loopPath(l.beat, sx, sy)} fill="none" stroke="var(--color-curve)" strokeWidth={1.2} strokeDasharray="4 3" />
            ))}
            {main && (
              <>
                <path d={loopPath(main, sx, sy)} fill="color-mix(in oklab, var(--color-ink) 6%, transparent)" stroke="var(--color-ink)" strokeWidth={2.2} strokeLinejoin="round" />
                {showEa && (
                  <path d={line([[sx(main.EDV), sy(0)], [esX + (esX - sx(main.EDV)) * 0.12, esY - (sy(0) - esY) * 0.12]])}
                    fill="none" stroke="var(--color-load)" strokeWidth={1.6} strokeDasharray="7 4" />
                )}
                <circle cx={esX} cy={esY} r={5} fill="var(--color-art)" />
                <circle cx={sx(main.EDV)} cy={sy(Math.max(main.EDP, 0))} r={4.5} fill="var(--color-card)" stroke="var(--color-ink)" strokeWidth={1.6} />
              </>
            )}
            <text x={Math.min(sx(vTop) + 6, 400)} y={Math.max(sy(Ees * (vTop - V0)) + 14, 14)} fontSize={12} fontWeight={700} fill="var(--color-ink)">ESPVR</text>
            {edp.length > 2 && (
              <text x={Math.min(edp[edp.length - 1][0] - 52, 404)} y={edp[edp.length - 1][1] - 8} fontSize={12} fontWeight={700} fill="var(--color-ink-3)">EDPVR</text>
            )}
            {extra?.(sx, sy)}
          </g>
        )
      }}
    </Plot>
  )
}
