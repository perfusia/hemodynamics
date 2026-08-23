import type { Drug, Lesson1Scenario } from '../../shared/types'

export { TAG_COLOR } from '../../shared/tokens'

export const DRUGS: Drug[] = [
  {
    name: 'Norepinephrine', class: 'Vasopressor',
    mechanism: 'α1 with mild β1. Constricts vessels and raises SVR while largely maintaining CO.',
    effect: { co: 0.0, svr: +350 },
    indication: 'First-line vasopressor in septic shock',
  },
  {
    name: 'Phenylephrine', class: 'Vasopressor',
    mechanism: 'Pure α1. Raises SVR with no direct cardiac effect. Baroreceptor response can slow HR.',
    effect: { co: -0.5, svr: +400 },
    indication: 'Anesthesia-induced hypotension',
  },
  {
    name: 'Vasopressin', class: 'Vasopressor',
    mechanism: 'V1 receptor, non-adrenergic. Keeps working when catecholamine receptor coupling degrades in acidosis.',
    effect: { co: -0.3, svr: +300 },
    indication: 'Adjunct vasopressor in refractory shock',
  },
  {
    name: 'Dobutamine', class: 'Inotrope',
    mechanism: 'β1 agonist. Raises contractility and HR, lifting CO. Mild β2 vasodilation lowers SVR.',
    effect: { co: +1.5, svr: -100 },
    indication: 'Cardiogenic shock',
  },
  {
    name: 'Milrinone', class: 'Inodilator',
    mechanism: 'PDE3 inhibitor. Raises intracellular cAMP downstream of the β receptor, so it still works in a beta-blocked or downregulated ventricle. Dilates the systemic and pulmonary beds.',
    effect: { co: +1.2, svr: -350 },
    indication: 'Post-cardiotomy low output; renally cleared, so effect cannot be withdrawn quickly',
  },
  {
    name: 'Epinephrine', class: 'Vasopressor/Inotrope',
    mechanism: 'α1, β1 and β2. Raises both CO and SVR. Broadest hemodynamic effect of any single agent.',
    effect: { co: +1.5, svr: +300 },
    indication: 'Anaphylaxis, cardiac arrest, post-bypass low output',
  },
  {
    name: 'Propofol', class: 'Anesthetic',
    mechanism: 'GABA-A potentiation. Vasodilation plus mild myocardial depression drops both SVR and CO.',
    effect: { co: -0.8, svr: -300 },
    indication: 'IV induction — anticipate hypotension',
  },
  {
    name: 'Nitroprusside', class: 'Vasodilator',
    mechanism: 'Nitric oxide donor. Dilates arteries and veins, dropping SVR and MAP within seconds.',
    effect: { co: +0.5, svr: -500 },
    indication: 'Hypertensive emergency, afterload reduction',
  },
]

export const SCENARIOS: Lesson1Scenario[] = [
  { label: 'Normal at Rest',      co: 5.0, svr: 1120, tag: 'baseline', desc: 'Healthy adult baseline. CO and SVR both within normal range.' },
  { label: 'Septic Shock',        co: 8.5, svr: 380,  tag: 'critical', desc: 'Massive vasodilation collapses SVR. MAP falls despite high CO.' },
  { label: 'Cardiogenic Shock',   co: 1.8, svr: 1900, tag: 'critical', desc: 'Failing heart drops CO. Vessels clamp down to compensate.' },
  { label: 'Propofol Induction',  co: 4.5, svr: 580,  tag: 'caution',  desc: 'Propofol causes vasodilation and mild myocardial depression.' },
  { label: 'Hypertensive Crisis', co: 6.0, svr: 2000, tag: 'critical', desc: 'Severe vasoconstriction drives MAP dangerously high.' },
]
