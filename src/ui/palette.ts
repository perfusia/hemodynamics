/**
 * Runtime access to the color tokens defined in index.css. Figure code uses
 * CH (CSS variables, so SVG follows the theme automatically) and canvas code
 * uses readPalette(), re-read whenever the resolved theme changes.
 */

export interface Palette {
  paper: string; plate: string; card: string; rule: string; rule2: string; grid: string; gridMajor: string
  ink: string; ink2: string; ink3: string
  art: string; ven: string; pa: string; flow: string; load: string; curve: string
}

export function readPalette(): Palette {
  const s = getComputedStyle(document.documentElement)
  const g = (n: string) => s.getPropertyValue(n).trim()
  return {
    paper: g('--color-paper'), plate: g('--color-plate'), card: g('--color-card'),
    rule: g('--color-rule'), rule2: g('--color-rule-2'), grid: g('--color-grid'), gridMajor: g('--color-grid-major'),
    ink: g('--color-ink'), ink2: g('--color-ink-2'), ink3: g('--color-ink-3'),
    art: g('--color-art'), ven: g('--color-ven'), pa: g('--color-pa'), flow: g('--color-flow'),
    load: g('--color-load'), curve: g('--color-curve'),
  }
}

/** Named channels for figure code: always a CSS variable, never a literal. */
export const CH = {
  art: 'var(--color-art)',
  ven: 'var(--color-ven)',
  pa: 'var(--color-pa)',
  flow: 'var(--color-flow)',
  load: 'var(--color-load)',
  ink: 'var(--color-ink)',
  ink2: 'var(--color-ink-2)',
  ink3: 'var(--color-ink-3)',
  curve: 'var(--color-curve)',
  grid: 'var(--color-grid)',
  gridMajor: 'var(--color-grid-major)',
  card: 'var(--color-card)',
  rule: 'var(--color-rule)',
} as const
export type ChannelKey = keyof typeof CH
