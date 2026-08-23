// Shared hemodynamic types used across all HemoLab lessons

export interface NormalRange {
  low: number
  high: number
}

export interface RangeState {
  label: 'Low' | 'Normal' | 'High'
  color: string
}

export interface MAPStatus {
  label: string
  sub: string
  accent: string
  ring: string
  bg: string
}

export interface Drug {
  name: string
  class: string
  mechanism: string
  effect: {
    co: number   // Delta applied to CO (L/min)
    svr: number  // Delta applied to SVR (dynes·sec/cm⁵)
  }
  indication: string
}

export interface Lesson1Scenario {
  label: string
  co: number
  svr: number
  tag: 'baseline' | 'critical' | 'caution'
  desc: string
}

export interface Lesson2Scenario {
  label: string
  hr: number
  preload: number       // mmHg — LVEDP surrogate
  afterload: number     // relative scale 0.5–2.0 (1.0 = normal)
  contractility: number // relative scale 0.3–1.5 (1.0 = normal)
  svr: number           // dynes·sec/cm⁵ for MAP calculation
  tag: 'baseline' | 'critical' | 'caution'
  desc: string
}

export interface FrankStarlingPoint {
  preload: number
  sv: number
}
