/** Number formatting shared by figures and readouts. En dash for missing values. */
export const fmt = {
  // `+ 0` collapses IEEE negative zero (Math.round(-0.2) === -0) to +0 so it
  // never renders as "-0".
  i: (x: number) => (Number.isFinite(x) ? (Math.round(x) + 0).toLocaleString('en-US') : '–'),
  d1: (x: number) => (Number.isFinite(x) ? x.toFixed(1) : '–'),
  d2: (x: number) => (Number.isFinite(x) ? x.toFixed(2) : '–'),
  pct: (x: number) => (Number.isFinite(x) ? `${Math.round(x * 100)}%` : '–'),
  bp: (s: number, d: number) => `${Math.round(s)}/${Math.round(d)}`,
}
