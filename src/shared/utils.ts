import type { MAPStatus, RangeState, FrankStarlingPoint } from './types'
import { STATUS } from './tokens'

/**
 * Calculate Mean Arterial Pressure from Cardiac Output and SVR.
 * Formula: MAP (mmHg) = [CO (L/min) × SVR (dynes·sec/cm⁵)] / 80
 */
export function calcMAP(co: number, svr: number): number {
  return Math.round((co * svr) / 80)
}

/**
 * Calculate Stroke Volume from Cardiac Output and Heart Rate.
 * Formula: SV (mL/beat) = [CO (L/min) × 1000] / HR (bpm)
 */
export function calcSV(co: number, hr: number): number {
  return Math.round((co * 1000) / hr)
}

/**
 * Frank-Starling model: derive stroke volume from preload, contractility, afterload.
 *
 * Models the characteristic curve where SV rises with preload, plateaus,
 * then falls at extreme preload (ventricular over-distension).
 *
 * Contractility shifts the entire curve up or down.
 * Afterload inversely reduces SV — greater resistance means less ejection.
 *
 * @param preload       - LVEDP surrogate in mmHg. Normal 8–18 mmHg.
 * @param contractility - Relative contractile strength. 1.0 = normal. Range 0.3–1.5.
 * @param afterload     - Relative vascular resistance. 1.0 = normal. Range 0.5–2.0.
 * @returns             - Stroke volume in mL/beat
 */
export function calcStrokeVolume(
  preload: number,
  contractility: number,
  afterload: number
): number {
  const p = preload / 20
  const frankStarling = (2.5 * p) / (1 + 2 * p * p)
  const afterloadFactor = 1 / (0.5 + 0.5 * afterload)
  const sv = 80 * frankStarling * contractility * afterloadFactor * 1.15
  return Math.min(Math.max(Math.round(sv), 10), 200)
}

/**
 * Generate a full Frank-Starling curve for SVG rendering.
 * Returns array of {preload, sv} points across the 0–30 mmHg preload range.
 */
export function frankStarlingCurve(
  contractility: number,
  afterload: number,
  points = 60
): FrankStarlingPoint[] {
  return Array.from({ length: points }, (_, i) => {
    const preload = (i / (points - 1)) * 30
    return { preload, sv: calcStrokeVolume(preload, contractility, afterload) }
  })
}

/**
 * Clinical severity status for a MAP value.
 * Critical threshold: MAP < 65 mmHg — organ perfusion at risk.
 *
 * Colours come from the severity ramp in tokens.ts. No hex literals here.
 */
export function getMAPStatus(map: number): MAPStatus {
  const mk = (label: string, sub: string, accent: string, tint: string): MAPStatus =>
    ({ label, sub, accent, ring: accent, bg: tint })

  if (map < 50)   return mk('Critical',  'Severe hypoperfusion',      STATUS.critical, 'rgba(158,59,38,0.07)')
  if (map < 65)   return mk('Dangerous', 'Below perfusion threshold', STATUS.critical, 'rgba(158,59,38,0.05)')
  if (map < 70)   return mk('Low',       'Monitor closely',           STATUS.warn,     'rgba(138,99,24,0.06)')
  if (map <= 100) return mk('Normal',    'Organs adequately perfused',STATUS.normal,   'rgba(74,107,87,0.06)')
  if (map <= 120) return mk('Elevated',  'Sustained hypertension',    STATUS.warn,     'rgba(138,99,24,0.06)')
  return                 mk('Crisis',    'Hypertensive emergency',    STATUS.critical, 'rgba(158,59,38,0.07)')
}

/**
 * Range state and colour for any hemodynamic variable.
 */
export function getRangeState(value: number, low: number, high: number): RangeState {
  if (value < low)  return { label: 'Low',    color: STATUS.warn   }
  if (value > high) return { label: 'High',   color: STATUS.warn   }
  return                   { label: 'Normal', color: STATUS.normal }
}

export function clampCO(co: number):   number { return Math.min(Math.max(parseFloat(co.toFixed(1)), 1), 12) }
export function clampSVR(svr: number): number { return Math.min(Math.max(Math.round(svr), 200), 2400) }
