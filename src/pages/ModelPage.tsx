import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Eq, M } from '../ui/Math'
import { RefList, type Ref } from '../ui/Cite'
import { COMMON } from '../content/refs'
import { validateBaseline } from '../model/validation'
import { BASELINE, UNITS } from '../model/params'

const MODEL_REFS: Ref[] = [
  COMMON.suga1974, COMMON.sunagawa1983, COMMON.westerhof2009, COMMON.ursino1998, COMMON.guyton1955, COMMON.magder2016, COMMON.hall2025,
  {
    key: 'shishido2000', kind: 'article', authors: 'Shishido, T., Hayashi, K., Shigemi, K., Sato, T., Sugimachi, M., & Sunagawa, K.', short: 'Shishido et al.', year: '2000',
    title: 'Single-beat estimation of end-systolic elastance using bilinearly approximated time-varying elastance curve',
    container: 'Circulation', volume: '102', issue: '16', pages: '1983–1989', doi: '10.1161/01.CIR.102.16.1983',
  },
]

function Rubric({ id, children }: { id: string; children: React.ReactNode }) {
  return <h2 id={id} className="label m-0 mb-4 border-t-2 border-ink pt-3" style={{ fontSize: 13 }}>{children}</h2>
}

const comp = (name: string, color: string, sub?: React.ReactNode) => (
  <span className="inline-flex items-center rounded border px-2.5 py-2 font-sans text-[13.5px]" style={{ borderColor: color, borderWidth: 1.5 }}>
    <b style={{ color }}>{name}</b>{sub && <span className="ml-1.5 text-ink-3">{sub}</span>}
  </span>
)
const arrow = (label: React.ReactNode, color = 'var(--color-ink-3)') => (
  <span className="font-sans text-[13.5px]" style={{ color }}>{label} ›</span>
)

export default function ModelPage() {
  useEffect(() => { document.title = 'The model · Titrate' }, [])
  const rows = useMemo(() => validateBaseline(), [])
  const svr = Math.round(UNITS.toDyn(BASELINE.Rs + BASELINE.Zc))

  return (
    <div className="prose mx-auto max-w-[var(--wide)] px-[var(--gutter)] pt-12 pb-24 md:pt-16">
      <div className="mb-8 max-w-[900px]">
        <div className="label cond" style={{ color: 'var(--color-ink-3)', letterSpacing: '0.14em', fontWeight: 600 }}>Methods</div>
        <h1 className="mt-4 mb-5 font-sans font-semibold leading-[1.04] tracking-[-0.025em]" style={{ fontSize: 'clamp(34px, 5vw, 56px)', maxWidth: '16ch', textWrap: 'balance' }}>
          The circulation model and its validation
        </h1>
        <p className="m-0 text-ink-2" style={{ fontSize: 'clamp(18px, 1.8vw, 21px)', lineHeight: 1.5, maxWidth: '40em' }}>
          Every figure in Titrate is produced by one lumped-parameter model of the circulation, solved numerically in the browser.
          This page specifies the model, states its assumptions and limitations, and compares its baseline output with adult reference
          values.
        </p>
      </div>

      <section aria-labelledby="structure">
        <Rubric id="structure">Structure</Rubric>
        <p>
          The circulation is represented as seven compliant compartments connected by resistances and gated by four ideal valves
          (Figure M1). Blood volume is conserved except for explicit infusion or hemorrhage. The heart, atria, and pulmonary vessels
          lie within the thorax, so their intravascular pressure is the sum of transmural pressure and pleural pressure; this is the
          route by which positive-pressure ventilation enters the model.
        </p>
        <figure className="my-7 max-w-[var(--wide)] rounded-md border border-rule bg-plate p-5">
          <div className="flex flex-col gap-3.5 font-sans">
            <div className="flex flex-wrap items-center gap-2">
              {comp('LV', 'var(--color-ink)')}{arrow('aortic valve')}
              {comp('Systemic arteries', 'var(--color-art)', <><M t="C_{sa}" />, <M t="Z_c" /></>)}
              {arrow(<M t="R_s" />, 'var(--color-load)')}
              {comp('Systemic veins', 'var(--color-ven)', <><M t="C_{sv}" />, <M t="V_u" /></>)}
              {arrow(<M t="R_{VR}" />)}
              {comp('RA', 'var(--color-ven)')}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {arrow('tricuspid')}{comp('RV', 'var(--color-ink)')}{arrow('pulmonic')}
              {comp('Pulmonary arteries', 'var(--color-pa)', <M t="C_{pa}" />)}
              {arrow(<M t="R_p" />)}
              {comp('Pulmonary veins + LA', 'var(--color-pa)', <M t="C_{pv}" />)}
              {arrow('mitral')}{comp('LV', 'var(--color-ink)')}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-dashed border-rule-2 pt-3 text-[13.5px] text-ink-2">
              <span><b className="text-ink">Baroreflex</b> senses <M t="P_{ao}" />, then adjusts</span>
              <span>HR (<M t="\tau" /> 2 s)</span><span><M t="E_{es}" /> (<M t="\tau" /> 8 s)</span>
              <span><M t="R_s" /> (<M t="\tau" /> 6 s)</span><span><M t="V_u" /> (<M t="\tau" /> 20 s)</span>
            </div>
          </div>
          <figcaption className="mt-3.5 text-[15.5px] leading-[1.5] text-ink-2">
            <span className="font-sans font-bold text-ink">Figure M1.</span> Topology of the Titrate model. Boxes are compliant
            compartments; labeled arrows are resistances or valves. Colors follow bedside monitor convention: arterial red, venous
            blue, pulmonary amber.
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="eqs">
        <Rubric id="eqs">Governing equations</Rubric>
        <p>
          Each ventricle is a time-varying elastance (<Link to="/lessons/2#s3">Lesson 2</Link>). Ventricular pressure is a weighted
          sum of the end-systolic and end-diastolic pressure-volume relations, weighted by an activation function <M t="e(t)" /> that
          rises from 0 to 1 during systole and returns to 0 in diastole <span className="cite">(<a href="#ref-suga1974">Suga &amp; Sagawa, 1974</a>)</span>:
        </p>
        <Eq n="M1" t={String.raw`P_i(V,t)=e(t)\,E_{es,i}\,(V-V_{0,i})+\bigl[1-e(t)\bigr]\,A_i\!\left(e^{B_i(V-V_{0,i})}-1\right)+P_{pl}`} />
        <p>Each vascular compartment is a linear compliance above an unstressed volume, and its volume changes with the net flow in and out:</p>
        <Eq n="M2" t={String.raw`\frac{dV_i}{dt}=Q_{\text{in}}-Q_{\text{out}},\qquad P_i=\frac{V_i-V_{u,i}}{C_i}+P_{\text{thorax},i}`} />
        <p>Flow through each resistance is the pressure difference divided by the resistance; valves conduct in one direction only:</p>
        <Eq n="M3" t={String.raw`Q=\frac{P_{\text{up}}-P_{\text{down}}}{R},\qquad Q_{\text{valve}}=\max\!\left(0,\ \frac{P_{\text{up}}-P_{\text{down}}}{R_{\text{valve}}}\right)`} />
        <p>
          The aorta and pulmonary artery carry a characteristic impedance <M t="Z_c" /> in series with the arteriolar resistance, which
          makes the arterial load a three-element Windkessel <span className="cite">(<a href="#ref-westerhof2009">Westerhof et al., 2009</a>)</span>. The
          baroreflex senses a low-pass-filtered aortic pressure and drives four effectors through first-order lags with
          effector-specific time constants <span className="cite">(<a href="#ref-ursino1998">Ursino, 1998</a>)</span>:
        </p>
        <Eq n="M4" t={String.raw`\tau_x\,\frac{dx}{dt}=x^{*}\!\left(\bar P_{ao}-P_{\text{set}}\right)-x,\qquad x\in\{\mathrm{HR},\,E_{es},\,R_s,\,V_u\}`} />
        <p>
          The system of ordinary differential equations is integrated by explicit Euler with a fixed step of 0.25 ms. The smallest
          compartment time constant is about 8 ms, so the step is well inside the stability limit; a run of one simulated second takes
          about four thousand steps and completes in a few milliseconds, which is what lets the figures animate in real time.
        </p>
      </section>

      <section aria-labelledby="validation">
        <Rubric id="validation">Validation</Rubric>
        <p className="max-w-[46em]">
          Baseline parameters were chosen so that the closed-loop steady state, with reflexes at rest, falls within standard adult
          reference ranges across every reported variable (Table 1). The model values below are computed live in your browser from the
          baseline parameter set; the systemic vascular resistance of the arterial Windkessel is {svr.toLocaleString('en-US')} dyn·s·cm⁻⁵.
        </p>
        <div className="tbl-wrap">
          <div className="tbl-cap"><b>Table 1.</b> Baseline model output compared with adult reference values</div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Variable</th><th>Symbol</th><th className="r">Model</th><th className="r">Reference</th><th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  <td className="text-ink-3">{r.symbol}</td>
                  <td className="r" style={{ fontWeight: 600 }}>{r.model}</td>
                  <td className="r">{r.reference}</td>
                  <td className="text-ink-3">{r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="tbl-note">
            Model values are the steady state of the closed-loop model with the baroreflex at rest. Reference ranges are compiled from
            Guyton and Hall (2025) and standard critical care sources; ventricular volumes follow echocardiographic reference limits,
            which vary with body size and sex.
          </div>
        </div>
      </section>

      <section aria-labelledby="limits">
        <Rubric id="limits">Assumptions and limitations</Rubric>
        <p>The model is built to teach the relationships among hemodynamic variables, not to predict an individual patient. Its principal simplifications are deliberate:</p>
        <ul className="bul">
          <li>Atrial contraction is not modeled; the atria are passive compliant chambers, so the model cannot represent the loss of the atrial kick in atrial fibrillation.</li>
          <li>Ventricular interdependence through the septum and pericardium is omitted, so acute right ventricular failure and tamponade physiology are approximated only through their effect on filling.</li>
          <li>Regional autoregulation and the metabolic control of local blood flow are absent; arteriolar resistance changes only through the reflex or an imposed drug effect.</li>
          <li>Transcapillary fluid exchange is not represented, so the model does not develop edema or redistribute volume over hours.</li>
          <li>Drug effects (<Link to="/lessons/5">Lesson 5</Link>) are dose-response calibrations tuned for direction and approximate magnitude in a 70 kg adult, not pharmacokinetic predictions.</li>
          <li>The baroreflex is the only neural control, with fixed effector gains and time constants; the renin-angiotensin system and other slow controllers are not modeled.</li>
        </ul>
        <div className="box" style={{ borderTopColor: 'var(--color-art)' }}>
          <div className="box-head label"><span>Not for clinical use</span></div>
          <p className="m-0">Titrate is an educational model. It is not a medical device, has not been validated against patient outcomes, and must not be used to guide the care of any patient.</p>
        </div>
      </section>

      <section aria-labelledby="refs">
        <Rubric id="refs">References</Rubric>
        <div className="max-w-[820px]"><RefList refs={MODEL_REFS} /></div>
      </section>
    </div>
  )
}
