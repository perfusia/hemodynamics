/** Curriculum metadata shared by the navigation, the home page and each lesson. */
export interface LessonMeta {
  n: number
  path: string
  title: string
  /** Short label for navigation. */
  short: string
  deck: string
  kicker: string
  /** Governing relation, TeX. */
  relation: string
  figures: number
  minutes: number
  available: boolean
}

export const LESSONS: LessonMeta[] = [
  {
    n: 1, path: '/lessons/1', short: 'Pressure and flow',
    title: 'Arterial pressure as the product of flow and resistance',
    deck: 'Mean arterial pressure as a time average, the hydraulic resistance equation, perfusion pressure, and a first classification of hypotension.',
    kicker: 'The arterial pressure equation',
    relation: String.raw`\mathrm{MAP}-\mathrm{CVP}=\mathrm{CO}\cdot\mathrm{SVR}`,
    figures: 3, minutes: 30, available: true,
  },
  {
    n: 2, path: '/lessons/2', short: 'Stroke volume',
    title: 'Stroke volume and the pressure-volume framework',
    deck: 'Time-varying elastance, preload, afterload, contractility, ventricular-arterial coupling, and the cost of tachycardia.',
    kicker: 'Ventricular mechanics',
    relation: String.raw`\mathrm{SV}=\dfrac{E_{es}(\mathrm{EDV}-V_0)}{E_{es}+E_a}`,
    figures: 3, minutes: 40, available: true,
  },
  {
    n: 3, path: '/lessons/3', short: 'Resistance and reflex',
    title: 'Vascular resistance, arterial load, and the baroreflex',
    deck: "Poiseuille's law, the arterial Windkessel, calculated SVR and its pitfalls, and short-term reflex compensation for hemorrhage and vasodilation.",
    kicker: 'The arterial side',
    relation: String.raw`R=\dfrac{8\eta L}{\pi r^4}`,
    figures: 3, minutes: 35, available: true,
  },
  {
    n: 4, path: '/lessons/4', short: 'Venous return',
    title: 'Venous return, preload, and volume status',
    deck: 'Stressed volume, mean systemic filling pressure, the Guyton diagram, heart-lung interaction, and dynamic indices of fluid responsiveness.',
    kicker: 'The venous side',
    relation: String.raw`\mathrm{VR}=\dfrac{P_{msf}-P_{RA}}{R_{VR}}`,
    figures: 2, minutes: 40, available: true,
  },
  {
    n: 5, path: '/lessons/5', short: 'Pharmacology',
    title: 'Pharmacologic modulation of hemodynamics',
    deck: "Receptor signaling mapped onto the model's parameters: vasopressors, inotropes and inodilators, vasodilators, and anesthetic agents, each with its reflex consequences.",
    kicker: 'Vasoactive and anesthetic agents',
    relation: String.raw`\text{net effect}=\text{direct}+\text{reflex}`,
    figures: 1, minutes: 45, available: true,
  },
  {
    n: 6, path: '/lessons/6', short: 'Cases',
    title: 'Integrated cases: shock states and the perioperative patient',
    deck: 'Case-based synthesis of Lessons 1 to 5.',
    kicker: 'Synthesis',
    relation: '',
    figures: 0, minutes: 0, available: false,
  },
]

export const AVAILABLE = LESSONS.filter((l) => l.available)
