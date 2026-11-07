# HemoLab

An open, interactive curriculum in cardiovascular physiology for anesthesia
and critical care. Every figure is computed in the browser by one closed-loop
model of the circulation, so the reader can perturb the physiology and watch
the consequences propagate.

**Live:** https://perfusia.github.io/hemodynamics

## Curriculum

| # | Title | Governing relation |
|---|---|---|
| 1 | Arterial pressure as the product of flow and resistance | MAP − CVP = CO · SVR |
| 2 | Stroke volume and the pressure-volume framework | SV = Eₑₛ(EDV − V₀) / (Eₑₛ + Eₐ) |
| 3 | Vascular resistance, arterial load, and the baroreflex | R = 8ηL / πr⁴ |
| 4 | Venous return, preload, and volume status | VR = (Pₘₛf − P_RA) / R_VR |
| 5 | Pharmacologic modulation of hemodynamics | net = direct + reflex |

Each lesson defines its notation, derives its relations, ties them to the
cellular and anatomic basis, connects them to intraoperative and critical care
practice, and closes with review questions and APA-7 references. The model and
its validation are documented on the in-app **The model** page.

## The model

A lumped-parameter, closed-loop model of the circulation, solved in the browser:

- **Ventricles** — time-varying elastance (Suga & Sagawa), both left and right.
- **Arterial load** — a three-element Windkessel (characteristic impedance,
  arterial compliance, arteriolar resistance).
- **Venous and pulmonary compartments** — linear compliances with an unstressed
  volume; total blood volume is conserved except for explicit infusion or
  hemorrhage.
- **Thoracic coupling** — the heart, atria, and pulmonary vessels see pleural
  pressure, which is how positive-pressure ventilation enters the model.
- **Baroreflex** — senses aortic pressure and drives heart rate, contractility,
  arteriolar resistance, and venous capacitance through first-order lags.

The equations are integrated by explicit Euler at a fixed 0.25 ms step. Baseline
parameters reproduce a healthy supine adult at rest; the steady state falls
inside standard adult reference ranges across every reported variable
(`src/model/validation.ts`, and Table 1 on the model page).

Model source: `src/model/` (`params.ts`, `engine.ts`, `drugs.ts`, `states.ts`,
`curves.ts`, `validation.ts`). Physiology regression tests:
`src/model/__tests__/model.test.ts` (`npm test`).

**This tool is for learning. It is not a medical device and must not inform the
care of any patient.**

## Design system

"Physiological Record": a scholarly monograph crossed with a physiological
polygraph. Archivo for the interface, figures, and readouts; STIX Two Text for
reading; STIX Two Math (via [temml](https://temml.org), rendered to MathML) for
equations. Channel colors follow bedside monitor convention (arterial red,
venous blue, pulmonary amber, flow and volume teal, load violet), so the only
color on the page is physiology. Light (day) and dark (night, read as a monitor)
themes. Color tokens live in `src/index.css`; the JavaScript mirror is
`src/ui/palette.ts`. Those two files are the only place a color literal belongs.

## Architecture

- **React 19 + TypeScript + Vite + Tailwind 4**, hash routing for GitHub Pages.
- `src/model/` — the physiology, framework-free and unit-tested.
- `src/viz/` — the rendering layer: a real-time `SimRunner`, a canvas `Strip`
  chart, and SVG `Plot`, `PVLoop`, and `Trend` components. Figures read model
  output directly; drawing never passes through React state.
- `src/ui/` — the design system: typography, controls, equations, citations,
  the lesson scaffold, and the review-question engine.
- `src/lessons/lessonN/` — each lesson as `Lesson N.tsx` (prose + questions),
  `figures.tsx` (its interactive figures), and `refs.ts` (its references).
- `src/pages/` — the home page and the model page.

Fonts are self-hosted from `@fontsource`; nothing is fetched at runtime.

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # physiology regression tests (vitest)
npm run build      # typecheck, then production build
npm run lint
```

Pushing to `main` runs typecheck, lint, and build, then deploys to GitHub Pages
via `.github/workflows/deploy.yml`. The workflow is the only path to production,
so source and the live site cannot drift.

## Clinical accuracy

Equations, reference ranges, and drug effects are referenced against Guyton and
Hall *Textbook of Medical Physiology*, the primary physiology literature cited
in each lesson, and standard anesthesia and critical care texts. Drug responses
are educational dose-response calibrations tuned for direction and approximate
magnitude, not pharmacokinetic predictions. Corrections are welcome as issues.

## License

MIT. STIX Two Math is licensed under the SIL Open Font License
(`src/assets/fonts/OFL-STIX.txt`).
