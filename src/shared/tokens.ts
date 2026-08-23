/**
 * Typed mirror of the CSS custom properties defined in index.css.
 *
 * Most styling should use Tailwind utility classes generated from the @theme
 * block (bg-paper, text-ink, border-rule). This module exists for the places
 * that genuinely need a raw value in JavaScript: SVG stroke and fill
 * attributes, canvas drawing, and inline gradient stops.
 *
 * If you change a colour, change it in index.css first, then here. These two
 * files are the only places in the codebase where a hex literal may appear.
 */

export const CHART = {
  paper:     '#F4F6F2',
  panel:     '#E9EEE7',
  panelAlt:  '#FFFFFF',
  rule:      '#C7D2C4',
  ink:       '#16211C',
  inkSoft:   '#5A665C',
  inkFaint:  '#8C968D',
  navy:      '#1B3A4B',
} as const

/**
 * Bedside monitor channel colours. Reserved for measured haemodynamic
 * parameters so that the encoding carries meaning. Do not reuse these for
 * generic UI states.
 */
export const MONITOR = {
  bg:    '#0B0E10',
  grid:  '#1B2124',
  label: '#7D888C',
  art:   '#FF453A',  // arterial pressure
  ecg:   '#3DDC5C',  // ECG
  pa:    '#FFD60A',  // pulmonary artery
  cvp:   '#4DA3FF',  // central venous
  spo2:  '#5AC8E8',  // pulse oximetry
} as const

/**
 * ISO 26825 / ASTM D4774 anaesthetic syringe label colours.
 * Used to colour drug identity consistently with the labels a clinician
 * already reads on a syringe.
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

/** Severity ramp for the light chart surface. */
export const STATUS = {
  critical: '#A32319',
  warn:     '#96590A',
  normal:   '#2E6B4F',
} as const

/** Severity ramp for the dark monitor panel, lifted for contrast. */
export const STATUS_MON = {
  critical: '#FF6B60',
  warn:     '#FFC44D',
  normal:   '#4ADE80',
} as const

/** Drug class to ISO colour. Single source of truth for drug swatches. */
export const DRUG_CLASS_COLOR: Record<string, string> = {
  'Vasopressor':           ISO_26825.vasopressor,
  'Inotrope':              ISO_26825.vasopressor,
  'Vasopressor/Inotrope':  ISO_26825.vasopressor,
  'Inodilator':            ISO_26825.vasopressor,
  'Vasodilator':           ISO_26825.hypotensive,
  'Anesthetic':            ISO_26825.induction,
}

/** Scenario severity tag styling. Previously duplicated in both lesson data files. */
export const TAG_COLOR: Record<'baseline' | 'caution' | 'critical', { text: string; bg: string; border: string }> = {
  baseline: { text: STATUS.normal,   bg: 'rgba(46,107,79,0.09)',  border: 'rgba(46,107,79,0.22)'  },
  caution:  { text: STATUS.warn,     bg: 'rgba(150,89,10,0.09)',  border: 'rgba(150,89,10,0.22)'  },
  critical: { text: STATUS.critical, bg: 'rgba(163,35,25,0.08)',  border: 'rgba(163,35,25,0.22)'  },
}
