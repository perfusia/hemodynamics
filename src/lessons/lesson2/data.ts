import type { Lesson2Scenario } from '../../shared/types'

export const SCENARIOS: Lesson2Scenario[] = [
  {
    label: 'Normal at Rest',
    hr: 70, preload: 12, afterload: 1.0, contractility: 1.0, svr: 1000,
    tag: 'baseline',
    desc: 'Healthy adult. Normal filling pressure, contractility, and vascular resistance. Operating on the middle of the Frank-Starling curve.',
  },
  {
    label: 'Hypovolemia',
    hr: 105, preload: 4, afterload: 1.1, contractility: 1.0, svr: 1100,
    tag: 'caution',
    desc: 'Low blood volume reduces venous return and preload. SV falls. HR rises to compensate. Patient is on the steep ascending limb — fluid will help.',
  },
  {
    label: 'Heart Failure',
    hr: 95, preload: 22, afterload: 1.3, contractility: 0.5, svr: 1400,
    tag: 'critical',
    desc: 'Weakened myocardium drops contractility. Curve shifts down. High preload, poor SV — the over-distended failing ventricle. More fluid will cause pulmonary edema, not improve output.',
  },
  {
    label: 'Dobutamine Infusion',
    hr: 90, preload: 22, afterload: 1.1, contractility: 0.85, svr: 1200,
    tag: 'caution',
    desc: 'Dobutamine given to the failing heart. β1 agonist increases contractility, shifting the Frank-Starling curve upward. Same preload now produces significantly more SV and CO.',
  },
  {
    label: 'Fluid Resuscitation',
    hr: 82, preload: 16, afterload: 1.0, contractility: 1.0, svr: 1000,
    tag: 'baseline',
    desc: 'IV fluid given to a hypovolemic patient. Preload increases, moving up the steep ascending limb of the curve. SV and CO improve.',
  },
]

export const TAG_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  baseline: { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.2)'  },
  critical:  { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  caution:   { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
}
