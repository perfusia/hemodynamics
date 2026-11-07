/**
 * Patient states: parameter changes that represent a disease process before
 * the baroreflex has compensated for it. With the reflex enabled, the model
 * computes the compensated state; with it disabled, the raw insult.
 */

import type { Params } from './params'
import { BASELINE, cloneParams } from './params'
import type { Sensitivity } from './drugs'
import { NORMAL_SENSITIVITY } from './drugs'

export interface PatientState {
  id: string
  name: string
  summary: string
  apply: (p: Params) => Params
  sensitivity: Sensitivity
}

export const STATES: PatientState[] = [
  {
    id: 'healthy',
    name: 'Healthy adult',
    summary: 'Supine, at rest, 70 kg, blood volume 5,000 mL.',
    apply: (p) => cloneParams(p),
    sensitivity: NORMAL_SENSITIVITY,
  },
  {
    id: 'septic',
    name: 'Vasodilatory shock',
    summary: 'Sepsis after initial fluid resuscitation: arteriolar resistance reduced by 70 percent, venous capacitance increased, a net 600 mL volume gain, mild septic cardiomyopathy, and vascular hyporesponsiveness to catecholamines and to the reflex.',
    apply: (p) => {
      const q = cloneParams(p)
      q.Rs *= 0.3
      q.Vusv += 400
      q.Vtot += 600
      q.lv.Ees *= 0.9
      q.Rp *= 1.2
      q.reflex.rsArm *= 0.35
      q.reflex.vuArm *= 0.5
      return q
    },
    sensitivity: { catecholamine: 0.6, vasopressin: 1.2, reserve: 0.4 },
  },
  {
    id: 'cardiogenic',
    name: 'Cardiogenic shock',
    summary: 'Acute left ventricular failure with right ventricular involvement: LV end-systolic elastance reduced to about a quarter of normal, RV elastance to 70 percent, and limited contractile reserve.',
    apply: (p) => {
      const q = cloneParams(p)
      q.lv.Ees *= 0.26
      q.lv.V0 = 20
      q.rv.Ees *= 0.7
      q.reflex.eesArm *= 0.4
      return q
    },
    sensitivity: { catecholamine: 0.8, vasopressin: 1, reserve: 0.3 },
  },
  {
    id: 'hypovolemic',
    name: 'Hemorrhagic hypovolemia',
    summary: 'Acute loss of 1,000 mL, 20 percent of blood volume.',
    apply: (p) => {
      const q = cloneParams(p)
      q.Vtot -= 1000
      return q
    },
    sensitivity: { catecholamine: 1, vasopressin: 1, reserve: 0.6 },
  },
]

export const STATE_BY_ID: Record<string, PatientState> = Object.fromEntries(STATES.map((s) => [s.id, s]))

/** Baseline with the reflex enabled at its resting set point. */
export function withReflex(p: Params = BASELINE, gain = 1): Params {
  const q = cloneParams(p)
  q.reflex.gain = gain
  return q
}
