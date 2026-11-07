import { useMemo, useState } from 'react'
import { BASELINE, cloneParams, type Params } from '../../model/params'
import { Circulation, type Beat } from '../../model/engine'
import { DRUGS, DRUG_BY_ID, combine, applyEffect, type DrugClass, type LabelClass } from '../../model/drugs'
import { STATES, STATE_BY_ID } from '../../model/states'
import { Figure } from '../../ui/Figure'
import { Button, Chips, PanelLabel, Segmented, Slider } from '../../ui/Controls'
import { Readouts } from '../../ui/Readouts'
import { fmt } from '../../ui/format'
import { useSim } from '../../viz/useSim'
import { Strip, type Panel } from '../../viz/Strip'

/* ------------------------------------------------------------------------ */
/* ISO 26825 / ASTM D4774 syringe-label identity.                            */
/* These hex values are the real standard colors and are used only here, as  */
/* the identifying mark on each agent.                                       */
/* ------------------------------------------------------------------------ */

const ISO_VIOLET = '#A05EB5'
const ISO_YELLOW = '#F2C500'

function labelFill(label: LabelClass): string {
  switch (label) {
    case 'vasopressor':
      return ISO_VIOLET
    case 'hypotensive':
      // Violet with white diagonal stripes marks a hypotensive agent.
      return `repeating-linear-gradient(135deg, ${ISO_VIOLET} 0 4px, #ffffff 4px 7px)`
    case 'induction':
    case 'sevoflurane':
      return ISO_YELLOW
    default:
      // Unclassified agents (inotropes, inodilators, beta blockers): black on white.
      return 'var(--color-card)'
  }
}

function Swatch({ label, big = false }: { label: LabelClass; big?: boolean }) {
  const s = big ? 20 : 13
  const border = label === 'unclassified' ? '1.5px solid var(--color-ink)' : '1px solid rgba(0,0,0,0.25)'
  return (
    <span
      aria-hidden="true"
      style={{ display: 'inline-block', width: s, height: s, borderRadius: 3, flex: 'none', background: labelFill(label), border }}
    />
  )
}

const LABEL_NAME: Record<LabelClass, string> = {
  vasopressor: 'Vasopressor (violet)',
  hypotensive: 'Hypotensive agent (violet, striped)',
  induction: 'Induction agent (yellow)',
  sevoflurane: 'Volatile agent (yellow)',
  unclassified: 'No standard class (black on white)',
}

/* ------------------------------------------------------------------------ */
/* Figure 5.1: the pharmacology bench                                        */
/* ------------------------------------------------------------------------ */

const DRUG_CLASSES: DrugClass[] = ['Vasopressor', 'Inotrope', 'Inodilator', 'Vasodilator', 'Beta blocker', 'Anesthetic']
const DRUGS_BY_CLASS = (k: DrugClass) => DRUGS.filter((d) => d.klass === k)

const PANELS: Panel[] = [
  { height: 150, min: 0, max: 160, unit: 'mmHg', ticks: [0, 40, 80, 120], minor: 20, traces: [{ ch: 'Pao', color: 'art', label: 'Pao', width: 2 }] },
  { height: 70, min: 0, max: 16, unit: 'mmHg', ticks: [0, 5, 10], minor: 5, traces: [{ ch: 'Pra', color: 'ven', label: 'CVP', width: 1.8 }] },
]

const STATE_OPTS = STATES.map((s) => ({
  value: s.id,
  label: s.name.replace('Hemorrhagic hypovolemia', 'Hypovolemia').replace('Vasodilatory shock', 'Vasodilatory').replace('Cardiogenic shock', 'Cardiogenic').replace('Healthy adult', 'Healthy'),
}))

/** Steady state of a parameter set, for the no-drug reference and deltas. */
function steady(p: Params): Beat {
  return new Circulation(p, 'closed').settle(120, 0.0005, 0.0005)
}

export function FigurePharmBench() {
  const [stateId, setStateId] = useState('healthy')
  const [reflexOn, setReflexOn] = useState(true)
  const [klass, setKlass] = useState<DrugClass>('Vasopressor')
  const [drugId, setDrugId] = useState('phenylephrine')
  const [dose, setDose] = useState(0)

  const state = STATE_BY_ID[stateId]
  const drug = DRUG_BY_ID[drugId]

  const stateBase = useMemo(() => {
    const p = state.apply(cloneParams(BASELINE))
    p.reflex.gain = reflexOn ? 1 : 0
    p.reflex.Pset = 86
    return p
  }, [state, reflexOn])

  // No-drug reference for this state and reflex setting.
  const ref = useMemo(() => steady(stateBase), [stateBase])

  const params = useMemo(
    () => (dose > 0 ? applyEffect(stateBase, combine({ [drugId]: dose }, state.sensitivity)) : stateBase),
    [stateBase, drugId, dose, state.sensitivity],
  )

  const { runner, box, beat, reset } = useSim(params, { topology: 'closed', warm: 20, seconds: 5 })

  const pickDrug = (id: string) => {
    setDrugId(id)
    setDose(DRUG_BY_ID[id].usual[0])
  }
  const pickClass = (k: DrugClass) => {
    setKlass(k)
    const first = DRUGS_BY_CLASS(k)[0]
    if (first.id !== drugId) pickDrug(first.id)
  }

  const b = beat
  const d = (k: keyof Beat) => (b ? (b[k] as number) - (ref[k] as number) : 0)

  return (
    <Figure
      n="5.1"
      interactive
      title="The pharmacology bench"
      actions={<Button small onClick={() => { setDose(0); reset() }}>Clear drug</Button>}
      caption={
        <>
          Choose a patient, an agent, and a dose, and the closed-loop model responds beat by beat. Each readout shows the change from
          the same patient with no drug, so the direct effect and the reflex response are visible together. Turn the baroreflex off to
          see the agent's unopposed action: a pure α1 agonist then raises the pressure far more and does not slow the heart, because the
          slowing was reflex. The syringe-label color on each agent follows the ASTM D4774 and ISO 26825 standard a clinician reads at
          the bedside.
        </>
      }
    >
      <div ref={box} className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-4 font-sans">
          <div className="min-w-0" style={{ flex: '1 1 260px' }}>
            <PanelLabel>Patient</PanelLabel>
            <Chips label="Patient state" value={stateId} onChange={setStateId} options={STATE_OPTS} />
            <p className="mt-2.5 mb-0 text-[13.5px] leading-[1.5] text-ink-2" style={{ fontFamily: 'var(--font-serif)' }}>{state.summary}</p>
          </div>
          <div className="min-w-0" style={{ flex: '1 1 220px' }}>
            <PanelLabel>Baroreflex</PanelLabel>
            <Segmented
              label="Baroreflex"
              value={reflexOn ? 'on' : 'off'}
              onChange={(v) => setReflexOn(v === 'on')}
              options={[{ value: 'on', label: 'Intact' }, { value: 'off', label: 'Blocked' }]}
            />
            <p className="mt-2.5 mb-0 text-[13.5px] leading-[1.5] text-ink-2" style={{ fontFamily: 'var(--font-serif)' }}>
              {reflexOn ? 'The reflex opposes the drug, as in an awake patient.' : 'The reflex is removed, isolating the agent’s direct effect.'}
            </p>
          </div>
        </div>

        <div className="font-sans">
          <PanelLabel>Agent</PanelLabel>
          <Chips label="Drug class" value={klass} onChange={(k) => pickClass(k as DrugClass)} options={DRUG_CLASSES.map((k) => ({ value: k, label: k }))} />
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Agent">
            {DRUGS_BY_CLASS(klass).map((dr) => (
              <Button key={dr.id} small pressed={dr.id === drugId} onClick={() => pickDrug(dr.id)}>
                <Swatch label={dr.label} />
                <span className="ml-1.5">{dr.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-8 gap-y-3 rounded border border-rule bg-plate px-4 py-3 font-sans">
          <div className="flex items-center gap-3" style={{ flex: '0 0 auto' }}>
            <Swatch label={drug.label} big />
            <div>
              <div className="text-[15px] font-semibold">{drug.name}</div>
              <div className="text-[12.5px] text-ink-3">{drug.target} · {LABEL_NAME[drug.label]}</div>
            </div>
          </div>
          <p className="m-0 min-w-0 text-[14px] leading-[1.5] text-ink-2" style={{ flex: '1 1 320px', fontFamily: 'var(--font-serif)' }}>{drug.mechanism}</p>
        </div>

        <Slider
          name={`Dose of ${drug.name.toLowerCase()}`}
          value={dose}
          min={drug.min}
          max={drug.max}
          step={drug.step}
          unit={drug.unit}
          onChange={setDose}
          format={drug.step < 0.1 ? fmt.d2 : drug.step < 1 ? fmt.d1 : fmt.i}
          band={drug.usual}
          scale={[String(drug.min), 'usual range', String(drug.max)]}
        />

        <Strip runner={runner} panels={PANELS} window={3.4} label="Arterial pressure and central venous pressure during the drug infusion" />

        <Readouts
          items={[
            { k: 'MAP', v: fmt.i(b?.MAP ?? NaN), u: b ? `mmHg · ${fmt.bp(b.SBP, b.DBP)}` : 'mmHg', ch: 'art', delta: d('MAP'), deltaDigits: 0 },
            { k: 'HR', v: fmt.i(b?.HR ?? NaN), u: 'min⁻¹', delta: d('HR'), deltaDigits: 0 },
            { k: 'CO', v: fmt.d1(b?.CO ?? NaN), u: 'L·min⁻¹', ch: 'flow', delta: d('CO'), deltaDigits: 1 },
            { k: 'SV', v: fmt.i(b?.SV ?? NaN), u: 'mL', ch: 'flow', delta: d('SV'), deltaDigits: 0 },
            { k: 'SVR', v: fmt.i(b?.SVR ?? NaN), u: 'dyn·s·cm⁻⁵', ch: 'load', delta: d('SVR'), deltaDigits: 0 },
            { k: 'CVP', v: fmt.d1(b?.CVP ?? NaN), u: 'mmHg', ch: 'ven', delta: d('CVP'), deltaDigits: 1 },
            { k: 'LAP', v: fmt.d1(b?.LAP ?? NaN), u: 'mmHg', ch: 'pa', delta: d('LAP'), deltaDigits: 1 },
            { k: 'EF', v: fmt.pct(b?.EF ?? NaN), u: 'percent', delta: b ? (b.EF - ref.EF) * 100 : 0, deltaDigits: 0 },
          ]}
          min={118}
        />
        <p className="m-0 font-sans text-[13px] text-ink-3">
          Change is measured against the same patient with no drug ({stateId === 'healthy' ? 'MAP' : 'baseline MAP'} {Math.round(ref.MAP)} mmHg,
          CO {ref.CO.toFixed(1)} L·min⁻¹, SVR {Math.round(ref.SVR)} dyn·s·cm⁻⁵). Numbers settle over a few seconds as the model reaches
          a new steady state.
        </p>
      </div>
    </Figure>
  )
}
