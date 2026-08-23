import type { Drug, Lesson1Scenario } from '../../shared/types'

export const DRUGS: Drug[] = [
  { name: 'Norepinephrine', class: 'Vasopressor',          mechanism: 'α1 + mild β1 — constricts vessels, raises SVR. Maintains CO.',                      effect: { co:  0.0, svr: +350 }, indication: 'First-line vasopressor in septic shock'    },
  { name: 'Phenylephrine',  class: 'Vasopressor',          mechanism: 'Pure α1 — raises SVR, no direct cardiac effect. Can reflexively slow HR.',          effect: { co: -0.5, svr: +400 }, indication: 'Anesthesia-induced hypotension'             },
  { name: 'Vasopressin',    class: 'Vasopressor',          mechanism: 'V1 receptor — constricts vessels via non-adrenergic pathway.',                      effect: { co: -0.3, svr: +300 }, indication: 'Adjunct vasopressor in refractory shock'    },
  { name: 'Dobutamine',     class: 'Inotrope',             mechanism: 'β1 agonist — increases myocardial contractility and HR, raising CO. Mild vasodilation.', effect: { co: +1.5, svr: -100 }, indication: 'Cardiogenic shock'                    },
  { name: 'Epinephrine',    class: 'Vasopressor/Inotrope', mechanism: 'α1 + β1 + β2 — raises both CO and SVR. Broadest hemodynamic effect of any agent.',  effect: { co: +1.5, svr: +300 }, indication: 'Anaphylaxis, cardiac arrest'               },
  { name: 'Propofol',       class: 'Anesthetic',           mechanism: 'GABA-A potentiator — vasodilation and mild myocardial depression. Drops SVR and CO.', effect: { co: -0.8, svr: -300 }, indication: 'IV induction — anticipate hypotension'    },
  { name: 'Nitroprusside',  class: 'Vasodilator',          mechanism: 'Nitric oxide donor — dilates arteries and veins. Rapidly drops SVR and MAP.',        effect: { co: +0.5, svr: -500 }, indication: 'Hypertensive emergency, afterload reduction' },
]

export const SCENARIOS: Lesson1Scenario[] = [
  { label: 'Normal at Rest',      co: 5.0, svr: 1120, tag: 'baseline', desc: 'Healthy adult baseline. CO and SVR both within normal range.' },
  { label: 'Septic Shock',        co: 8.5, svr: 380,  tag: 'critical', desc: 'Massive vasodilation collapses SVR. MAP falls despite high CO.' },
  { label: 'Cardiogenic Shock',   co: 1.8, svr: 1900, tag: 'critical', desc: 'Failing heart drops CO. Vessels clamp down to compensate.' },
  { label: 'Propofol Induction',  co: 4.5, svr: 580,  tag: 'caution',  desc: 'Propofol causes vasodilation and mild myocardial depression.' },
  { label: 'Hypertensive Crisis', co: 6.0, svr: 2000, tag: 'critical', desc: 'Severe vasoconstriction drives MAP dangerously high.' },
]

export const TAG_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  baseline: { text: '#34d399', bg: 'rgba(52,211,153,0.1)',   border: 'rgba(52,211,153,0.2)'  },
  critical:  { text: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  caution:   { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)'  },
}
