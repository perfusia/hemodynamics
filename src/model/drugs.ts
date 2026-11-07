/**
 * Pharmacology layer.
 *
 * Each agent is described by its receptor mechanism and by a set of
 * dose-effect relations on the model's parameters:
 *
 *   hr     intrinsic heart rate (multiplier)
 *   ees    end-systolic elastance of both ventricles (multiplier)
 *   relax  relaxation duration, lusitropy (multiplier; < 1 is faster)
 *   rs     systemic arteriolar resistance (multiplier)
 *   vusv   systemic venous unstressed volume (additive, mL): negative is
 *          venoconstriction, which moves blood into the stressed pool
 *   rp     pulmonary vascular resistance (multiplier)
 *   reflexGain, hrArm, eesArm   modulation of the baroreflex
 *   pset   shift of the baroreflex set point (mmHg)
 *
 * Each relation is an Emax function, E = Emax · D / (ED50 + D). The
 * constants are pedagogical calibrations: they reproduce the direction and
 * the approximate magnitude of each agent's effect at its usual clinical
 * doses in a 70 kg adult. They are not pharmacokinetic predictions, and
 * the reflex response is computed by the model, not written into the drug.
 */

import type { Params } from './params'
import { cloneParams } from './params'

export type DrugClass =
  | 'Vasopressor'
  | 'Inotrope'
  | 'Inodilator'
  | 'Vasodilator'
  | 'Beta blocker'
  | 'Anesthetic'

/**
 * Syringe label class (ASTM D4774, harmonized with ISO 26825). Inotropes,
 * inodilators and beta blockers have no assigned class; such labels are
 * black print on white. Sevoflurane takes its ISO 5360 agent color.
 */
export type LabelClass = 'vasopressor' | 'hypotensive' | 'induction' | 'unclassified' | 'sevoflurane'

export interface Effect {
  hr: number
  ees: number
  relax: number
  rs: number
  vusv: number
  rp: number
  reflexGain: number
  hrArm: number
  eesArm: number
  /** Shift of the baroreflex set point (mmHg); anesthetics reset it downward. */
  pset: number
}

export const NO_EFFECT: Effect = {
  hr: 1, ees: 1, relax: 1, rs: 1, vusv: 0, rp: 1, reflexGain: 1, hrArm: 1, eesArm: 1, pset: 0,
}

/** How a patient state modifies responsiveness to drugs. */
export interface Sensitivity {
  /** Response to catecholamines (α and β), reduced by receptor desensitization. */
  catecholamine: number
  /** Response to vasopressin, increased in relative vasopressin deficiency. */
  vasopressin: number
  /** Endogenous catecholamine reserve, which ketamine's sympathomimetic effect depends on. */
  reserve: number
}

export const NORMAL_SENSITIVITY: Sensitivity = { catecholamine: 1, vasopressin: 1, reserve: 1 }

export interface Drug {
  id: string
  name: string
  klass: DrugClass
  label: LabelClass
  /** Receptor or molecular target, short form. */
  target: string
  /** One-sentence mechanism. */
  mechanism: string
  unit: string
  min: number
  max: number
  step: number
  /** Usual clinical range, for the scale annotation. */
  usual: [number, number]
  /** Fractional changes (rs: +0.6 means ×1.6), and mL for vusv. */
  effect: (dose: number, s: Sensitivity) => Partial<Record<keyof Effect, number>>
}

const E = (d: number, emax: number, ed50: number): number => (d <= 0 ? 0 : (emax * d) / (ed50 + d))

export const DRUGS: Drug[] = [
  {
    id: 'phenylephrine', name: 'Phenylephrine', klass: 'Vasopressor', label: 'vasopressor',
    target: 'α1',
    mechanism: 'Selective α1 agonist. Constricts arterioles and veins; no direct cardiac action, so heart rate falls by reflex.',
    unit: 'mcg·min⁻¹', min: 0, max: 200, step: 5, usual: [10, 100],
    effect: (d, s) => ({ rs: E(d, 1.1, 90) * s.catecholamine, vusv: -E(d, 450, 90) * s.catecholamine }),
  },
  {
    id: 'norepinephrine', name: 'Norepinephrine', klass: 'Vasopressor', label: 'vasopressor',
    target: 'α1 > β1',
    mechanism: 'α1 vasoconstriction with β1 inotropy. Raises arteriolar resistance and venous tone while supporting contractility.',
    unit: 'mcg·kg⁻¹·min⁻¹', min: 0, max: 0.5, step: 0.01, usual: [0.02, 0.3],
    effect: (d, s) => ({
      rs: E(d, 1.5, 0.15) * s.catecholamine,
      vusv: -E(d, 500, 0.15) * s.catecholamine,
      ees: E(d, 0.4, 0.1) * s.catecholamine,
      hr: E(d, 0.25, 0.2) * s.catecholamine,
    }),
  },
  {
    id: 'epinephrine', name: 'Epinephrine', klass: 'Vasopressor', label: 'vasopressor',
    target: 'β1, β2, α1',
    mechanism: 'β effects dominate at low doses (inotropy, chronotropy, β2 vasodilation); α1 vasoconstriction emerges as the dose rises.',
    unit: 'mcg·kg⁻¹·min⁻¹', min: 0, max: 0.3, step: 0.005, usual: [0.01, 0.1],
    effect: (d, s) => ({
      ees: E(d, 1.0, 0.05) * s.catecholamine,
      hr: E(d, 0.6, 0.06) * s.catecholamine,
      relax: -E(d, 0.15, 0.05),
      rs: (E(d, 1.5, 0.3) - E(d, 0.3, 0.03)) * s.catecholamine,
      vusv: -E(d, 400, 0.15) * s.catecholamine,
    }),
  },
  {
    id: 'vasopressin', name: 'Vasopressin', klass: 'Vasopressor', label: 'vasopressor',
    target: 'V1',
    mechanism: 'V1 receptor (Gq) vasoconstriction, independent of adrenergic receptors and preserved in acidosis.',
    unit: 'units·min⁻¹', min: 0, max: 0.06, step: 0.005, usual: [0.01, 0.04],
    effect: (d, s) => ({ rs: E(d, 1.3, 0.03) * s.vasopressin, vusv: -E(d, 250, 0.03) * s.vasopressin }),
  },
  {
    id: 'angiotensin', name: 'Angiotensin II', klass: 'Vasopressor', label: 'vasopressor',
    target: 'AT1',
    mechanism: 'AT1 receptor (Gq) vasoconstriction; a nonadrenergic option in catecholamine-resistant vasodilatory shock.',
    unit: 'ng·kg⁻¹·min⁻¹', min: 0, max: 80, step: 5, usual: [5, 40],
    effect: (d) => ({ rs: E(d, 1.4, 25), vusv: -E(d, 200, 25) }),
  },
  {
    id: 'dobutamine', name: 'Dobutamine', klass: 'Inotrope', label: 'unclassified',
    target: 'β1 > β2',
    mechanism: 'β1 agonist with modest β2 activity. Increases contractility and rate; mild arteriolar dilation.',
    unit: 'mcg·kg⁻¹·min⁻¹', min: 0, max: 20, step: 0.5, usual: [2.5, 10],
    effect: (d, s) => ({
      ees: E(d, 1.2, 7) * s.catecholamine,
      hr: E(d, 0.5, 12) * s.catecholamine,
      rs: -E(d, 0.25, 6),
      relax: -E(d, 0.15, 7),
    }),
  },
  {
    id: 'milrinone', name: 'Milrinone', klass: 'Inodilator', label: 'unclassified',
    target: 'PDE3',
    mechanism: 'Inhibits phosphodiesterase 3, raising cAMP downstream of the β receptor; inotropic, lusitropic, and a systemic and pulmonary vasodilator.',
    unit: 'mcg·kg⁻¹·min⁻¹', min: 0, max: 0.75, step: 0.025, usual: [0.125, 0.5],
    effect: (d) => ({
      ees: E(d, 0.7, 0.375),
      hr: E(d, 0.1, 0.5),
      rs: -E(d, 0.45, 0.375),
      vusv: E(d, 350, 0.4),
      rp: -E(d, 0.35, 0.375),
      relax: -E(d, 0.2, 0.375),
    }),
  },
  {
    id: 'nitroprusside', name: 'Nitroprusside', klass: 'Vasodilator', label: 'hypotensive',
    target: 'NO donor',
    mechanism: 'Releases nitric oxide, activating soluble guanylate cyclase; balanced arteriolar and venous dilation.',
    unit: 'mcg·kg⁻¹·min⁻¹', min: 0, max: 3, step: 0.05, usual: [0.3, 2],
    effect: (d) => ({ rs: -E(d, 0.65, 1.0), vusv: E(d, 700, 1.0), rp: -E(d, 0.4, 1.0) }),
  },
  {
    id: 'nitroglycerin', name: 'Nitroglycerin', klass: 'Vasodilator', label: 'hypotensive',
    target: 'NO donor',
    mechanism: 'Nitric oxide donor with predominantly venous action at low doses; arteriolar dilation appears at higher doses.',
    unit: 'mcg·min⁻¹', min: 0, max: 200, step: 5, usual: [10, 100],
    effect: (d) => ({ vusv: E(d, 800, 50), rs: -E(d, 0.4, 150), rp: -E(d, 0.25, 100) }),
  },
  {
    id: 'clevidipine', name: 'Clevidipine', klass: 'Vasodilator', label: 'hypotensive',
    target: 'L-type Ca²⁺ (vascular)',
    mechanism: 'Dihydropyridine calcium channel blocker, arteriolar-selective with little venous effect; ultrashort-acting.',
    unit: 'mg·h⁻¹', min: 0, max: 16, step: 0.5, usual: [1, 6],
    effect: (d) => ({ rs: -E(d, 0.5, 4), vusv: E(d, 40, 4) }),
  },
  {
    id: 'esmolol', name: 'Esmolol', klass: 'Beta blocker', label: 'unclassified',
    target: 'β1 antagonist',
    mechanism: 'Selective β1 antagonist. Slows rate and reduces contractility, and blunts the sympathetic limb of the reflex.',
    unit: 'mcg·kg⁻¹·min⁻¹', min: 0, max: 300, step: 10, usual: [50, 200],
    effect: (d) => ({
      hr: -E(d, 0.35, 100),
      ees: -E(d, 0.25, 150),
      hrArm: -E(d, 0.6, 100),
      eesArm: -E(d, 0.9, 100),
    }),
  },
  {
    id: 'propofol', name: 'Propofol', klass: 'Anesthetic', label: 'induction',
    target: 'GABA-A',
    mechanism: 'Reduces sympathetic outflow and vascular tone (arteriolar and venous), depresses contractility mildly, and blunts the baroreflex.',
    unit: 'mcg·mL⁻¹ (effect site)', min: 0, max: 6, step: 0.1, usual: [2, 5],
    effect: (d) => ({
      rs: -E(d, 0.45, 3),
      vusv: E(d, 550, 3),
      ees: -E(d, 0.2, 4),
      reflexGain: -E(d, 0.85, 2),
      pset: -E(d, 18, 3),
    }),
  },
  {
    id: 'sevoflurane', name: 'Sevoflurane', klass: 'Anesthetic', label: 'sevoflurane',
    target: 'multiple',
    mechanism: 'Dose-dependent arteriolar dilation and myocardial depression, with attenuation of baroreflex control of rate.',
    unit: 'MAC', min: 0, max: 1.5, step: 0.05, usual: [0.7, 1.2],
    effect: (d) => ({
      rs: -E(d, 0.4, 1.0),
      ees: -E(d, 0.3, 1.2),
      vusv: E(d, 250, 1.0),
      reflexGain: -E(d, 0.75, 0.7),
      pset: -E(d, 14, 1.0),
    }),
  },
  {
    id: 'ketamine', name: 'Ketamine', klass: 'Anesthetic', label: 'induction',
    target: 'NMDA antagonist',
    mechanism: 'Central sympathetic stimulation raises rate, resistance and contractility; its direct negative inotropy is unmasked when catecholamine reserve is depleted.',
    unit: 'mg·kg⁻¹', min: 0, max: 2, step: 0.1, usual: [0.5, 2],
    effect: (d, s) => ({
      hr: E(d, 0.3, 0.8) * s.reserve,
      rs: E(d, 0.25, 0.8) * s.reserve,
      ees: E(d, 0.3, 0.8) * s.reserve - E(d, 0.25, 1.0),
      pset: E(d, 24, 0.8) * s.reserve,
    }),
  },
  {
    id: 'etomidate', name: 'Etomidate', klass: 'Anesthetic', label: 'induction',
    target: 'GABA-A',
    mechanism: 'Induction agent with minimal effect on vascular tone, contractility or reflex control; adrenal suppression is its cost.',
    unit: 'mg·kg⁻¹', min: 0, max: 0.3, step: 0.01, usual: [0.2, 0.3],
    effect: (d) => ({ rs: -E(d, 0.06, 0.2), ees: -E(d, 0.04, 0.2) }),
  },
]

export const DRUG_BY_ID: Record<string, Drug> = Object.fromEntries(DRUGS.map((d) => [d.id, d]))

/** Combine the effects of several agents at their doses. */
export function combine(doses: Record<string, number>, s: Sensitivity = NORMAL_SENSITIVITY): Effect {
  const out: Effect = { ...NO_EFFECT }
  for (const [id, dose] of Object.entries(doses)) {
    const drug = DRUG_BY_ID[id]
    if (!drug || !(dose > 0)) continue
    const f = drug.effect(dose, s)
    if (f.hr) out.hr *= 1 + f.hr
    if (f.ees) out.ees *= 1 + f.ees
    if (f.relax) out.relax *= 1 + f.relax
    if (f.rs) out.rs *= 1 + f.rs
    if (f.vusv) out.vusv += f.vusv
    if (f.rp) out.rp *= 1 + f.rp
    if (f.reflexGain) out.reflexGain *= 1 + f.reflexGain
    if (f.hrArm) out.hrArm *= 1 + f.hrArm
    if (f.eesArm) out.eesArm *= 1 + f.eesArm
    if (f.pset) out.pset += f.pset
  }
  return out
}

/** Apply a combined effect to a parameter set (returns a new set). */
export function applyEffect(p: Params, e: Effect): Params {
  const q = cloneParams(p)
  q.HR = p.HR * e.hr
  q.lv.Ees = p.lv.Ees * e.ees
  q.rv.Ees = p.rv.Ees * e.ees
  q.relaxFrac = p.relaxFrac * e.relax
  q.Rs = p.Rs * e.rs
  q.Vusv = p.Vusv + e.vusv
  q.Rp = p.Rp * e.rp
  q.reflex.gain = p.reflex.gain * e.reflexGain
  q.reflex.hrArm = p.reflex.hrArm * e.hrArm
  q.reflex.eesArm = p.reflex.eesArm * e.eesArm
  q.reflex.Pset = p.reflex.Pset + e.pset
  return q
}
