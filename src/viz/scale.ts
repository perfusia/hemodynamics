export interface Scale {
  (v: number): number
  domain: [number, number]
  range: [number, number]
  invert: (px: number) => number
}

export function linear(domain: [number, number], range: [number, number]): Scale {
  const [d0, d1] = domain
  const [r0, r1] = range
  const k = (r1 - r0) / (d1 - d0 || 1)
  const f = ((v: number) => r0 + (v - d0) * k) as Scale
  f.domain = domain
  f.range = range
  f.invert = (px: number) => d0 + (px - r0) / k
  return f
}

/** Evenly spaced ticks from lo to hi inclusive. */
export function ticks(lo: number, hi: number, step: number): number[] {
  const out: number[] = []
  const n = Math.round((hi - lo) / step)
  for (let i = 0; i <= n; i++) out.push(+(lo + i * step).toFixed(6))
  return out
}

/** SVG path through points. */
export function line(pts: [number, number][]): string {
  let d = ''
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i]
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue
    d += `${d ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}
