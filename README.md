# HemoLab

Free, open interactive hemodynamics lessons for nursing students, ICU nurses,
and CCRN candidates. Each lesson teaches the concept in prose first, then lets
you manipulate the physiology and watch the numbers respond.

**Live:** https://perfusia.github.io/hemodynamics

## Lessons

| # | Title | Status |
|---|---|---|
| 1 | The Core Equation — MAP = CO × SVR | Live |
| 2 | Cardiac Output — HR × SV and the Frank-Starling curve | Live |
| 3 | Vascular Resistance and Compensation | Planned |
| 4 | Preload and Volume Status | Planned |
| 5 | Drug Effects on Hemodynamics | Planned |
| 6 | Clinical Scenarios | Planned |

## How the physiology is modelled

Everything is computed from equations rather than lookup tables, so the
simulator responds correctly to inputs the author never anticipated. See
`src/shared/utils.ts`.

- **MAP** — `MAP = (CO × SVR) / 80`
- **Stroke volume** — a Frank-Starling curve of the form `SV ∝ 2.5p / (1 + 2p²)`,
  which rises steeply, plateaus, and falls at extreme preload where the
  ventricle is over-distended. Contractility scales the whole curve; afterload
  reduces ejection through `1 / (0.5 + 0.5·afterload)`.
- **Drug effects** are applied as deltas to CO and SVR derived from each agent's
  receptor profile, not as arbitrary numbers.

## Design system

Three colour layers, each taken from a standard that already exists in the
critical care environment. Tokens live in `src/index.css` (`@theme`) and are
mirrored for JavaScript in `src/shared/tokens.ts`. Those two files are the only
places a hex literal belongs.

| Layer | Used for | Source |
|---|---|---|
| Chart stock | Reading surface | Paper flowsheet stock |
| Monitor | Measured haemodynamic parameters only | Bedside monitor channel convention: arterial red, ECG green, PA yellow, CVP blue, SpO₂ cyan |
| ISO 26825 | Drug identity | International anaesthetic syringe label standard |

## Clinical accuracy

Equations, normal ranges, and drug effects are referenced against Guyton and
Hall *Textbook of Medical Physiology*, Miller's *Anesthesia*, Goodman & Gilman's
*The Pharmacological Basis of Therapeutics*, and the Surviving Sepsis Campaign
guidelines.

Drug responses are educational approximations. Real responses vary with dose,
patient physiology, and context. **This tool is for learning. It is not for
clinical decision-making.**

Corrections are welcome. Open an issue.

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # typecheck and production build
npm run lint
```

Pushing to `main` runs typecheck, lint, and build, then deploys to GitHub Pages
via `.github/workflows/deploy.yml`. Do not deploy by hand — the workflow is the
only path to production, so the source and the live site cannot drift apart.

## Licence

MIT.
