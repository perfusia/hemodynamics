import { useEffect, useRef } from 'react'
import type { SimRunner, ChannelName } from './runner'
import { readPalette, type Palette } from '../ui/palette'
import { useTheme } from '../ui/themeContext'

export interface Trace {
  ch: ChannelName
  color: keyof Palette
  label: string
  width?: number
  dash?: number[]
  /** Transform the recorded value before plotting (e.g. clamp at 0). */
  map?: (v: number) => number
}

export interface PanelRule {
  v: number
  color: keyof Palette
  label: string
  dash?: number[]
  /** Place the label below the line instead of above (to avoid a nearby rule). */
  below?: boolean
}

export interface Panel {
  height: number
  min: number
  max: number
  unit: string
  /** Major graticule lines with axis labels. */
  ticks: number[]
  /** Minor graticule spacing in data units. */
  minor: number
  traces: Trace[]
  /** Labeled horizontal reference lines (a measured mean, a threshold). */
  rules?: PanelRule[]
}

const LEFT = 46
const TOP = 20
const GAP = 22
const BOTTOM = 26

/**
 * Canvas strip chart in the manner of a physiological polygraph: graticule
 * paper that moves with time, channels stacked in panels, a 1 s time bar.
 */
export function Strip({
  runner, panels, window: win = 3.2, label,
}: {
  runner: SimRunner | null
  panels: Panel[]
  window?: number
  label: string
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const cvs = useRef<HTMLCanvasElement>(null)
  const { resolved: version } = useTheme()
  const pal = useRef<Palette | null>(null)
  const size = useRef({ w: 600, h: 300, dpr: 1 })
  const totalH = TOP + panels.reduce((a, p) => a + p.height, 0) + GAP * (panels.length - 1) + BOTTOM

  useEffect(() => { pal.current = readPalette() }, [version])

  useEffect(() => {
    const el = wrap.current
    const c = cvs.current
    if (!el || !c) return
    const fit = () => {
      const w = Math.max(280, el.clientWidth)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      size.current = { w, h: totalH, dpr }
      c.width = Math.round(w * dpr)
      c.height = Math.round(totalH * dpr)
      c.style.width = `${w}px`
      c.style.height = `${totalH}px`
      draw()
    }
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null
    ro?.observe(el)
    fit()

    function draw() {
      const r = runner
      const ctx = c!.getContext('2d')
      const P = pal.current ?? readPalette()
      if (!ctx) return
      const { w, h, dpr } = size.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const right = w - 8
      const plotW = right - LEFT
      const tNow = r ? r.latestTime() : 0
      const t0 = tNow - win
      const xt = (t: number) => LEFT + ((t - t0) / win) * plotW
      ctx.font = '600 11.5px "Archivo Variable", Arial, sans-serif'

      let y0 = TOP
      panels.forEach((pn) => {
        const yv = (v: number) => y0 + pn.height - ((v - pn.min) / (pn.max - pn.min)) * pn.height
        ctx.fillStyle = P.card
        ctx.fillRect(LEFT, y0, plotW, pn.height)
        // minor graticule
        ctx.strokeStyle = P.grid
        ctx.lineWidth = 0.6
        ctx.beginPath()
        const k0 = Math.ceil(t0 / 0.04)
        for (let k = k0; k * 0.04 <= tNow; k++) {
          const x = Math.round(xt(k * 0.04)) + 0.5
          ctx.moveTo(x, y0); ctx.lineTo(x, y0 + pn.height)
        }
        for (let v = pn.min; v <= pn.max + 1e-6; v += pn.minor) {
          const y = Math.round(yv(v)) + 0.5
          ctx.moveTo(LEFT, y); ctx.lineTo(right, y)
        }
        ctx.stroke()
        // major graticule
        ctx.strokeStyle = P.gridMajor
        ctx.lineWidth = 0.8
        ctx.beginPath()
        for (let k = Math.ceil(t0 / 0.2); k * 0.2 <= tNow; k++) {
          const x = Math.round(xt(k * 0.2)) + 0.5
          ctx.moveTo(x, y0); ctx.lineTo(x, y0 + pn.height)
        }
        pn.ticks.forEach((v) => { const y = Math.round(yv(v)) + 0.5; ctx.moveTo(LEFT, y); ctx.lineTo(right, y) })
        ctx.stroke()
        // tick labels
        ctx.fillStyle = P.ink3
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        pn.ticks.forEach((v) => ctx.fillText(String(v), LEFT - 7, yv(v)))
        // channel labels
        ctx.textAlign = 'left'
        ctx.textBaseline = 'alphabetic'
        let lx = LEFT
        pn.traces.forEach((tr) => {
          ctx.font = '700 12px "Archivo Variable", Arial, sans-serif'
          ctx.fillStyle = P[tr.color]
          ctx.fillText(tr.label, lx, y0 - 6)
          lx += ctx.measureText(tr.label).width + 12
        })
        ctx.font = '500 11.5px "Archivo Variable", Arial, sans-serif'
        ctx.fillStyle = P.ink3
        ctx.fillText(pn.unit, lx, y0 - 6)
        // traces
        if (r) {
          ctx.save()
          ctx.beginPath(); ctx.rect(LEFT, y0 - 1, plotW, pn.height + 2); ctx.clip()
          pn.traces.forEach((tr) => {
            ctx.strokeStyle = P[tr.color]
            ctx.lineWidth = tr.width ?? 1.8
            ctx.lineJoin = 'round'
            ctx.setLineDash(tr.dash ?? [])
            ctx.beginPath()
            let first = true
            const arr = r.data[tr.ch]
            r.forEach(win + 0.05, (t, i) => {
              const v = tr.map ? tr.map(arr[i]) : arr[i]
              const x = xt(t), y = yv(v)
              if (first) { ctx.moveTo(x, y); first = false } else ctx.lineTo(x, y)
            })
            ctx.stroke()
          })
          ctx.setLineDash([])
          ctx.restore()
        }
        // reference rules (measured means, thresholds), drawn over the traces
        if (pn.rules) {
          ctx.textAlign = 'right'
          ctx.textBaseline = 'middle'
          ctx.font = '700 11px "Archivo Variable", Arial, sans-serif'
          pn.rules.forEach((ru) => {
            if (ru.v < pn.min || ru.v > pn.max) return
            const y = Math.round(yv(ru.v)) + 0.5
            ctx.strokeStyle = P[ru.color]
            ctx.lineWidth = 1.2
            ctx.setLineDash(ru.dash && ru.dash.length ? ru.dash : [])
            ctx.beginPath(); ctx.moveTo(LEFT, y); ctx.lineTo(right, y); ctx.stroke()
            ctx.setLineDash([])
            ctx.fillStyle = P[ru.color]
            ctx.fillText(ru.label, right - 4, y + (ru.below ? 9 : -8))
          })
          ctx.textBaseline = 'alphabetic'
        }
        y0 += pn.height + GAP
      })
      // 1 s time bar
      const yb = h - 9
      const x1 = right, x0 = right - plotW / win
      ctx.strokeStyle = P.ink
      ctx.lineWidth = 1.4
      ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.moveTo(x0, yb - 4); ctx.lineTo(x0, yb + 4); ctx.moveTo(x1, yb - 4); ctx.lineTo(x1, yb + 4); ctx.stroke()
      ctx.fillStyle = P.ink2
      ctx.textAlign = 'right'
      ctx.font = '500 11.5px "Archivo Variable", Arial, sans-serif'
      ctx.fillText('1 s', x0 - 8, yb + 4)
    }

    const off = runner?.onFrame(draw)
    const iv = window.setInterval(() => { if (!runner?.paused) return; draw() }, 500)
    return () => { ro?.disconnect(); off?.(); window.clearInterval(iv) }
  }, [runner, panels, win, totalH, version])

  return (
    <div ref={wrap} className="w-full">
      <canvas ref={cvs} role="img" aria-label={label} style={{ display: 'block', width: '100%', height: totalH }} />
    </div>
  )
}
