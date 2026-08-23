# HemoLab: repo and design system migration

## What went wrong

`npm run deploy` publishes `dist/` to the `gh-pages` branch. It does not commit
source. So `main` still holds the original Vite scaffold from 30 April, while
the real application exists only as a minified bundle on `gh-pages` and as an
uncommitted folder on one laptop.

Two consequences:

1. Anyone who opens `github.com/perfusia/hemodynamics` sees a starter template.
2. There is no backup. A dead SSD ends the project.

## Step 1 — commit the source, tonight

```bash
cd path/to/your/hemodynamics
git checkout main
git add -A
git commit -m "Add HemoLab source: lessons 1 and 2, shared hemodynamic model"
git push origin main
```

Confirm `src/` is visible on GitHub before doing anything else.

## Step 2 — replace manual deploys with CI

Copy `.github/workflows/deploy.yml` into the repo, then in GitHub:

**Settings → Pages → Build and deployment → Source: GitHub Actions**

Then remove the manual deploy path so the two cannot drift again:

```bash
npm pkg delete scripts.predeploy
npm pkg delete scripts.deploy
npm uninstall gh-pages
git push origin --delete gh-pages    # only after the Actions deploy succeeds
```

Every push to `main` now typechecks, lints, builds, and publishes. Source and
deployed site can no longer disagree, and pull requests get checked without
deploying.

## Step 3 — adopt the token layer

Replace `src/index.css` with the version in this bundle and add
`src/shared/tokens.ts`.

The current code has 257 inline `style={{}}` objects and 71 hardcoded hex
literals across 8 files, with `#34d399` alone appearing 27 times. Tailwind is
imported but only 12 utility classes are used anywhere. That is why changing the
palette currently means editing every file.

The `@theme` block generates utilities from the tokens, so `--color-paper`
becomes `bg-paper`, `--color-ink-soft` becomes `text-ink-soft`, and so on.

### Migration order

Work file by file, smallest first, so each step is verifiable:

| Order | File | Inline styles | Notes |
|---|---|---|---|
| 1 | `shared/utils.ts` | n/a | `getMAPStatus` and `getRangeState` return hex strings. Import from `tokens.ts` instead. |
| 2 | `lessons/*/data.ts` | n/a | Delete both `TAG_COLOR` blocks. They are byte-identical duplicates. Import from `tokens.ts`. |
| 3 | `components/MAPArc.tsx` | 2 | SVG. Keep inline, but source values from `tokens.ts`. |
| 4 | `components/VarRow.tsx` | 14 | Convert to utility classes. |
| 5 | `components/DrugButton.tsx` | 9 | Add the ISO 26825 swatch via `DRUG_CLASS_COLOR`. |
| 6 | `components/ZonedSlider.tsx` | 23 | Zone fills come from `STATUS`. |
| 7 | `App.tsx` | 17 | See breakpoint note below. |
| 8 | `lessons/lesson2/Lesson2Dashboard.tsx` | 53 | |
| 9 | `lessons/lesson1/Lesson1Dashboard.tsx` | 68 | |
| 10 | `pages/LandingPage.tsx` | 71 | Also rewrite the About copy. |

### Breakpoints

`useBreakpoint` works, but it subscribes to an unthrottled `resize` listener and
swaps whole component trees in JavaScript, so layout cannot settle until React
runs. Prefer Tailwind's `md:` and `lg:` variants for anything that is purely
layout. Keep the hook only where the two states render genuinely different
components, such as the nav collapsing to a hamburger.

## Step 4 — content

- Add **milrinone** to `lessons/lesson1/data.ts`. PDE3 inhibitor, acts
  downstream of the beta receptor so it still works in a beta-blocked or
  downregulated ventricle. Suggested effect: `{ co: +1.2, svr: -350 }`,
  class `Inodilator`. It is the signature post-cardiotomy agent and its absence
  is conspicuous to a CVICU reader.
- Rewrite the About block on the landing page. It currently leads with
  "senior software engineer transitioning into nursing school." Lead with the
  tool, not the author.
- Replace the stock `React + TypeScript + Vite` README.
