/**
 * Typed mirror of the CSS custom properties in index.css.
 *
 * Prefer Tailwind utilities generated from the @theme block (bg-paper,
 * text-ink, border-rule). Use this module only where a raw value is genuinely
 * needed in JavaScript: SVG stroke and fill attributes, and computed tints.
 *
 * These two files are the only places a hex literal belongs.
 */

/** Toned paper, three depths. */
export const SURFACE = {
  paper:  '#F2EADB',
  raised: '#FAF6EC',
  deep:   '#E8DFCB',
  rule:   '#D6C9AE',
  ruleStrong: '#B39F7C',
} as const

/** Iron-gall ink, three weights. */
export const INK = {
  base:  '#2B2118',
  soft:  '#5C4E3E',
  faint: '#6F5F45',
} as const

/**
 * Plate pigments. These carry meaning, not decoration.
 * Sanguine is arterial. Indigo is flow. Plum is resistance.
 */
export const PIGMENT = {
  sanguine:  '#9E3B26',
  indigo:    '#2F4858',
  plum:      '#6B4A63',
  verdigris: '#4A6B57',
  ochre:     '#8A6318',
} as const

/** Clinical severity ramp. */
export const STATUS = {
  critical: PIGMENT.sanguine,
  warn:     PIGMENT.ochre,
  normal:   PIGMENT.verdigris,
} as const

/**
 * ISO 26825 / ASTM D4774 anaesthetic syringe label colours.
 * Left at standard values deliberately — the point is fidelity to the label a
 * clinician actually reads on the syringe.
 */
export const ISO_26825 = {
  vasopressor:     '#A05EB5',
  hypotensive:     '#A05EB5',
  induction:       '#F2C500',
  opioid:          '#64B5F6',
  relaxant:        '#FF5252',
  anticholinergic: '#4CAF50',
  localAnesthetic: '#9E9E9E',
} as const

export const DRUG_CLASS_COLOR: Record<string, string> = {
  'Vasopressor':          ISO_26825.vasopressor,
  'Inotrope':             ISO_26825.vasopressor,
  'Vasopressor/Inotrope': ISO_26825.vasopressor,
  'Inodilator':           ISO_26825.vasopressor,
  'Vasodilator':          ISO_26825.hypotensive,
  'Anesthetic':           ISO_26825.induction,
}

export const TAG_COLOR: Record<'baseline' | 'caution' | 'critical', { text: string; bg: string; border: string }> = {
  baseline: { text: PIGMENT.verdigris, bg: 'rgba(74,107,87,0.10)',  border: 'rgba(74,107,87,0.30)'  },
  caution:  { text: PIGMENT.ochre,     bg: 'rgba(138,99,24,0.10)',  border: 'rgba(138,99,24,0.30)'  },
  critical: { text: PIGMENT.sanguine,  bg: 'rgba(158,59,38,0.09)',  border: 'rgba(158,59,38,0.28)'  },
}

/** Back-compat aliases so existing imports keep resolving during migration. */
export const CHART = { paper: SURFACE.paper, panel: SURFACE.deep, panelAlt: SURFACE.raised,
                       rule: SURFACE.rule, ink: INK.base, inkSoft: INK.soft,
                       inkFaint: INK.faint, navy: PIGMENT.indigo } as const
export const MONITOR = { bg: SURFACE.raised, grid: SURFACE.rule, label: INK.faint,
                         art: PIGMENT.sanguine, ecg: PIGMENT.verdigris, pa: PIGMENT.plum,
                         cvp: PIGMENT.indigo, spo2: PIGMENT.indigo } as const
export const STATUS_MON = STATUS
