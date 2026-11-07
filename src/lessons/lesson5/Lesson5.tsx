import { LessonPage, type LessonSection, type NotationRow } from '../../ui/Lesson'
import { LESSONS } from '../registry'
import { Eq, M } from '../../ui/Math'
import { Box, Note, Term } from '../../ui/Prose'
import { Cite } from '../../ui/Cite'
import type { QuestionData } from '../../ui/Question'
import { R5, L5_REFS } from './refs'
import { FigurePharmBench } from './figures'

const META = LESSONS[4]

const objectives = [
  <>Map the major adrenergic, vasopressin, angiotensin, phosphodiesterase, and anesthetic drug targets onto the parameters of the circulation they change.</>,
  <>Separate the direct effect of a vasoactive agent from the baroreflex response it provokes, and predict the net result.</>,
  <>Choose a vasopressor, an inotrope, an inodilator, or a vasodilator from the failed term of the arterial pressure equation and the state of the ventricle.</>,
  <>Explain why the hemodynamic response to an agent depends on the patient: the depleted reserve, the downregulated receptor, the blunted reflex.</>,
  <>Anticipate the cardiovascular effects of the common induction and maintenance anesthetics and the states that exaggerate them.</>,
]

const notation: NotationRow[] = [
  { sym: String.raw`E_{es}`, def: 'end-systolic elastance (contractility)', unit: 'mmHg·mL⁻¹' },
  { sym: String.raw`R_s`, def: 'systemic arteriolar resistance', unit: 'mmHg·s·mL⁻¹' },
  { sym: String.raw`V_u`, def: 'venous unstressed volume (venous tone)', unit: 'mL' },
  { sym: String.raw`\mathrm{HR}`, def: 'intrinsic heart rate', unit: 'min⁻¹' },
  { sym: String.raw`E_a`, def: 'effective arterial elastance (afterload)', unit: 'mmHg·mL⁻¹' },
  { sym: String.raw`g`, def: 'baroreflex gain, 1 intact and 0 absent', unit: 'ratio' },
  { sym: String.raw`P_{\text{set}}`, def: 'baroreflex arterial set point', unit: 'mmHg' },
  { sym: String.raw`E_{\max}`, def: 'maximal drug effect', unit: 'ratio' },
  { sym: String.raw`\mathrm{ED}_{50}`, def: 'dose at half-maximal effect', unit: 'dose' },
]

const sections: LessonSection[] = [
  {
    id: 's1', num: '5.1', title: 'Receptors mapped to parameters',
    body: (
      <>
        <p>
          Every vasoactive drug acts on a receptor, and every receptor, through its second messenger, changes one or more of the
          physical parameters that the previous four lessons defined. Once the mapping is fixed, the hemodynamic consequence of an agent
          follows from the same equations as any other perturbation. A drug is not a special case; it is a way to move a parameter.
        </p>
        <p>The adrenergic and related receptors map onto the model as follows.</p>
        <ul className="bul">
          <li><strong>α<sub>1</sub></strong> (G<sub>q</sub>) constricts arterioles and veins: it raises systemic resistance <M t="R_s" /> and lowers venous unstressed volume <M t="V_u" /> (Lessons 3 and 4). No direct cardiac action.</li>
          <li><strong>β<sub>1</sub></strong> (G<sub>s</sub>) raises contractility <M t="E_{es}" />, heart rate, and the rate of relaxation (Lesson 2).</li>
          <li><strong>β<sub>2</sub></strong> (G<sub>s</sub>) dilates arterioles, lowering <M t="R_s" />.</li>
          <li><strong>V<sub>1</sub></strong> and <strong>AT<sub>1</sub></strong> (both G<sub>q</sub>) constrict arterioles non-adrenergically, raising <M t="R_s" /> through a pathway that does not depend on catecholamine receptors.</li>
          <li><strong>PDE3 inhibition</strong> raises cyclic AMP downstream of the β receptor, so it raises <M t="E_{es}" /> and relaxation while dilating the systemic and pulmonary beds, lowering <M t="R_s" />.</li>
          <li><strong>GABA<sub>A</sub> potentiation and the volatile anesthetics</strong> lower sympathetic outflow: they reduce <M t="R_s" />, raise <M t="V_u" />, depress <M t="E_{es}" />, and blunt the reflex gain <M t="g" /> and set point <M t="P_{\text{set}}" />.</li>
        </ul>
        <p>
          The strength of each effect rises with dose along a saturating (Emax) relation, the standard description of receptor
          occupancy:
        </p>
        <Eq n="5.1" t={String.raw`E(D)=\frac{E_{\max}\,D}{\mathrm{ED}_{50}+D}`} />
        <p>
          The model uses Equation 5.1 for every agent, with constants chosen to reproduce the direction and the approximate magnitude
          of the clinical effect at usual doses; they are teaching calibrations, not pharmacokinetic predictions
          <Note>The model applies the drug as an instantaneous change in parameters and lets the circulation and the reflex find the new steady state. It has no pharmacokinetics: no onset, offset, redistribution, or clearance. Milrinone's long elimination half-life and renal clearance, and nitroprusside's seconds-long action, are clinical facts the model does not represent.</Note>. The
          reflex response is never written into the drug. It is computed by the model, which is the subject of the next sections.
        </p>
      </>
    ),
  },
  {
    id: 's2', num: '5.2', title: 'The direct effect and the reflex',
    body: (
      <>
        <p>
          A vasoactive agent produces two effects at once: the direct action at its receptor, and the baroreflex response to the change
          in arterial pressure the direct action causes (Lesson 3). The result a clinician sees is the sum.
        </p>
        <Eq n="5.2" t={String.raw`\text{net response}=\text{direct effect}+\text{reflex response}`} />
        <p>
          <Term>Phenylephrine</Term>, a selective α<sub>1</sub> agonist, is the clearest example. Its direct action is pure
          vasoconstriction: it raises resistance and venous tone, and has no receptor on the heart. In the pharmacology bench
          (Figure 5.1), a healthy patient given phenylephrine with the baroreflex intact shows the mean pressure rise by about 7 mmHg and
          the heart rate fall by about 11 min⁻¹. Turn the reflex off and the same dose raises the mean pressure roughly four times as
          much, to about 114 mmHg, and the heart rate does not change at all. The bradycardia was never an action of the drug; it was the
          reflex responding to the rise in pressure, and the smaller net pressure change is the reflex opposing the drug
          <Cite r={R5.overgaard2008} />. The rise in afterload also lowers stroke volume and cardiac output slightly, by the coupling of
          Lesson 2.
        </p>
        <p>
          <Term>Norepinephrine</Term> adds β<sub>1</sub> activity to a dominant α<sub>1</sub> effect, so it raises resistance and venous
          tone while supporting contractility; the reflex bradycardia is therefore smaller than with phenylephrine, and cardiac output
          is better preserved. It is the first-line vasopressor in vasodilatory shock <Cite r={[R5.debacker2010, R5.hollenberg2011]} />.
          In the bench's vasodilatory-shock patient, whose untreated mean pressure sits near 63 mmHg, a norepinephrine infusion restores
          the mean above the 65 mmHg threshold by raising the collapsed resistance.
          <Term>Epinephrine</Term> stimulates β and α in a dose-dependent order: at low dose its β effects dominate, raising output and
          rate while β<sub>2</sub> slightly lowers resistance, and α<sub>1</sub> vasoconstriction appears only as the dose climbs.
        </p>
        <p>
          <Term>Vasopressin</Term> and <Term>angiotensin II</Term> constrict through non-adrenergic G<sub>q</sub> receptors, so they keep
          working when adrenergic receptors are desensitized by prolonged catecholamine exposure or acidosis. Low-dose vasopressin is a
          catecholamine-sparing adjunct in septic shock <Cite r={R5.russell2008} />, and angiotensin II raises pressure in
          catecholamine-resistant vasodilatory shock <Cite r={R5.khanna2017} />. In the bench, adding a low dose of vasopressin to
          norepinephrine in the vasodilatory patient lifts the mean pressure further and, by restoring tone, lets the reflex bring the
          racing heart rate down.
        </p>
      </>
    ),
  },
  {
    id: 's3', num: '5.3', title: 'Inotropes and inodilators',
    body: (
      <>
        <p>
          When the failed term is cardiac output and the ventricle is weak, the treatment raises contractility. An <Term>inotrope</Term>{' '}
          steepens the end-systolic pressure-volume relation, which by Equation 2.10 raises stroke volume at a given filling and load.
          <Term>Dobutamine</Term>, a β<sub>1</sub> agonist, is the archetype. In the bench's cardiogenic-shock patient, a dobutamine
          infusion raises cardiac output by more than a litre per minute and, by emptying the ventricle more completely, lowers the left
          atrial pressure from about 31 to 22 mmHg while the ejection fraction rises from roughly 21 to 30 percent. Raising contractility
          both increases forward output and relieves the pulmonary congestion of the failing ventricle, which is why an inotrope targets
          the primary defect in cardiogenic shock when the perfusion pressure is adequate. When the patient is frankly hypotensive,
          though, a vasopressor is usually added or started first to protect coronary and organ perfusion, because dobutamine's β<sub>2</sub>
          vasodilation can lower an already low pressure further <Cite r={R5.overgaard2008} />.
        </p>
        <p>
          <Term>Milrinone</Term> reaches the same contractile endpoint by a different route. It inhibits phosphodiesterase 3, raising
          cyclic AMP <em>downstream</em> of the β receptor, so it still works in a ventricle whose β receptors are downregulated by
          chronic failure or blocked by a beta blocker, where dobutamine is weakened. Because it also dilates the systemic and pulmonary
          beds, it is an <Term>inodilator</Term>: in the bench it raises cardiac output like dobutamine but also drops the systemic
          vascular resistance by several hundred dyn·s·cm⁻⁵. The afterload reduction is useful in the dilated, afterload-sensitive
          ventricle of Lesson 2, but it can drop the arterial pressure, which is why milrinone is often paired with a vasopressor
          <Note>Milrinone is renally cleared with a long half-life, so its effect cannot be withdrawn quickly once started. The model has no pharmacokinetics and so does not show this, but it is the dominant practical difference between milrinone and dobutamine at the bedside.</Note>.
        </p>
        <Box n="5.1" kind="Clinical correlate · Cardiac surgical ICU">
          <p>
            A ventricle coming off cardiopulmonary bypass is often both weak and facing a high, labile afterload. The reasoning of
            Lesson 2 and this lesson combine: an inodilator raises contractility while lowering the arterial elastance the ventricle
            ejects against, and in the afterload-sensitive failing ventricle this returns more stroke volume than inotropy alone. The
            trade-off is the systemic pressure, so the inodilator is titrated against an arterial line, often with a vasopressor added to
            hold the perfusion pressure that the coronary and cerebral beds require <Cite r={R5.bangash2012} />.
          </p>
        </Box>
      </>
    ),
  },
  {
    id: 's4', num: '5.4', title: 'Vasodilators',
    body: (
      <>
        <p>
          A <Term>vasodilator</Term> lowers tone, and where it acts decides what it does. An arterial dilator lowers systemic resistance
          and, with it, the afterload the ventricle ejects against; a venodilator raises venous unstressed volume, shifting blood out of
          the stressed compartment and lowering preload (Lesson 4). Most agents do some of both.
        </p>
        <p>
          <Term>Nitroprusside</Term> is a balanced arterial and venous nitric oxide donor: it lowers both resistance and preload within
          seconds and is titrated against an arterial line in hypertensive emergency. <Term>Nitroglycerin</Term> is venodilator-predominant
          at low dose, so it unloads preload and relieves pulmonary congestion and myocardial ischemia before it lowers the arterial
          pressure much, with arterial dilation appearing as the dose rises. <Term>Clevidipine</Term> is an arteriolar-selective
          dihydropyridine calcium channel blocker with little venous effect and an ultrashort action, which makes it precise for
          perioperative pressure control.
        </p>
        <p>
          Every arterial vasodilator provokes a reflex tachycardia as the baroreflex responds to the fall in pressure, which the bench
          shows plainly. The afterload reduction that benefits the failing ventricle is bounded by perfusion pressure: lowering
          resistance raises stroke volume, but once the mean arterial pressure falls toward the autoregulatory floor the coronary and
          cerebral beds are at risk, so the same drug that helps a dilated low-output ventricle can harm a pressure-dependent
          circulation. The clevidipine example of Lesson 2 is this trade-off in a single agent.
        </p>
      </>
    ),
  },
  {
    id: 's5', num: '5.5', title: 'Anesthetic agents',
    body: (
      <>
        <p>
          Induction and maintenance of anesthesia are, hemodynamically, a controlled vasodilation and myocardial depression with the
          baroreflex removed, which is why hypotension is the expected accompaniment of induction (Lesson 1).
        </p>
        <p>
          <Term>Propofol</Term> lowers sympathetic outflow and vascular tone (both arteriolar and venous), depresses contractility
          mildly, and blunts the baroreflex while resetting its target downward. The combination produces the characteristic induction
          hypotension, and it is state-dependent in a way the bench makes vivid: in a healthy patient a standard effect-site
          concentration lowers the mean pressure by about 16 mmHg, but in the hypovolemic patient, who has no venous reserve to recruit
          and depends on reflex tone, the same concentration drops the mean pressure roughly twice as far, to the mid-40s. The
          anesthetic has not changed; the patient's capacity to compensate has. <Term>Sevoflurane</Term> produces a similar
          dose-dependent vasodilation and depression with attenuation of the reflex control of rate.
        </p>
        <p>
          <Term>Ketamine</Term> is the exception among the anesthetics, and it teaches the lesson of reserve. By stimulating central
          sympathetic outflow it usually raises heart rate, resistance, and contractility, so in a patient with intact catecholamine
          reserve it supports the pressure, as the bench shows for the healthy patient. But ketamine also has a direct negative
          inotropic action that is normally masked by the sympathetic stimulation. In a patient whose endogenous catecholamines are
          already maximally mobilized, by cardiogenic or late shock, there is no further sympathetic response to recruit, and the direct
          myocardial depression is unmasked: in the bench's cardiogenic patient, ketamine barely raises the pressure and lowers cardiac
          output. <Term>Etomidate</Term> is prized for hemodynamic stability, with little effect on tone, contractility, or the reflex;
          its cost is adrenal suppression, which lies outside the circulation this course models <Cite r={R5.flood2015} />.
        </p>
        <Box n="5.2" kind="Clinical correlate · Operating room">
          <p>
            Induction of the hypovolemic or shocked patient is a recurring hazard precisely because the drugs remove the compensation the
            patient is relying on. The reasoning of this course predicts the management: restore the stressed volume before induction,
            choose the agent with the least vasodilation and reflex blunting, reduce the dose, and have a vasopressor drawn up and ready,
            because the reflex that would normally defend the pressure has been taken away <Cite r={R5.flood2015} />.
          </p>
        </Box>
      </>
    ),
  },
  {
    id: 's6', num: '5.6', title: 'Why the same drug does different things',
    body: (
      <>
        <p>
          Equation 5.2 is the theme of the lesson, and the pharmacology bench is built to make it visible. The net response to an agent
          is never the direct effect alone, and both terms depend on the patient.
        </p>
        <p>
          The <strong>reflex term</strong> varies with its own gain. In an awake patient it opposes the drug, blunting a pressor and
          provoking tachycardia to a vasodilator. Under anesthesia the reflex is weakened, so the same pressor raises the pressure more
          and the same vasodilator drops it further, which is one reason intraoperative pressures swing more than ward pressures. The
          bench's reflex toggle reproduces this directly.
        </p>
        <p>
          The <strong>direct term</strong> varies with receptor availability. Catecholamines weaken where their receptors are
          downregulated or uncoupled, by chronic heart failure, prolonged infusion, or acidosis, which is the rationale for the
          non-adrenergic vasopressors and for the phosphodiesterase inhibitor that acts downstream of the β receptor. Ketamine's pressor
          effect weakens where catecholamine reserve is exhausted. A drug is a lever on a parameter, but the length of the lever, and the
          reflex that pushes back, are properties of the patient.
        </p>
        <FigurePharmBench />
        <p>
          This is why the five lessons are one argument. A low pressure is a failed term of <M t={String.raw`\mathrm{MAP}-\mathrm{CVP}=\mathrm{CO}\cdot\mathrm{SVR}`} /> (Lesson 1);
          which term, and whether output can be raised, is read from the ventricle (Lesson 2), the vasculature and its reflex (Lesson 3),
          and the venous return and filling (Lesson 4); and the drug is chosen to move the term that failed, with its reflex and its
          state dependence anticipated. Pharmacology is not a separate subject to memorize. It is the same circulation, moved on purpose.
        </p>
      </>
    ),
  },
]

const keyPoints = [
  <>Every vasoactive drug acts by changing a model parameter: α<sub>1</sub> raises <M t="R_s" /> and venous tone, β<sub>1</sub> raises <M t="E_{es}" /> and rate, V<sub>1</sub> and AT<sub>1</sub> raise <M t="R_s" /> non-adrenergically, PDE3 inhibition raises <M t="E_{es}" /> and lowers <M t="R_s" />, and anesthetics lower tone and contractility and blunt the reflex.</>,
  <>The net response is the direct effect plus the baroreflex response; a pure α<sub>1</sub> agonist's reflex bradycardia and its blunted pressor effect are the reflex, not the drug.</>,
  <>Match the agent to the failed term: a vasopressor for low resistance, an inotrope for a weak pump, an inodilator for a weak and afterload-burdened pump, a vasodilator to unload.</>,
  <>Non-adrenergic vasopressors and phosphodiesterase inhibitors keep working where adrenergic receptors are downregulated or acidotic; this is their reason for existing.</>,
  <>The hemodynamic effect of any agent depends on the patient's reserve and reflex: propofol falls harder in hypovolemia, ketamine's support fails when catecholamine reserve is spent.</>,
]

const questions: QuestionData[] = [
  {
    id: 'l5-phenyl',
    stem: <>A healthy, awake patient receives phenylephrine, a pure α<sub>1</sub> agonist. The heart rate falls. What is the mechanism?</>,
    options: [
      <>A direct negative chronotropic action of phenylephrine on the sinoatrial node.</>,
      <>A baroreflex response to the rise in arterial pressure, since phenylephrine has no cardiac receptor.</>,
      <>A fall in cardiac output that slows the heart.</>,
      <>β<sub>1</sub> blockade by phenylephrine.</>,
    ],
    answer: 1,
    rationale: (
      <>Phenylephrine acts only at α<sub>1</sub>, so it has no direct cardiac action; the bradycardia is the baroreflex responding to the pressure it raises, and removing the reflex removes the slowing (Figure 5.1). A invents a receptor the drug lacks. C confuses cause and effect: rate is set by the reflex, not by output. D is wrong; phenylephrine is an α<sub>1</sub> agonist, not a β blocker.</>
    ),
  },
  {
    id: 'l5-cardiogenic',
    stem: <>A patient in cardiogenic shock has a cardiac output of 3.6 L·min⁻¹, a left atrial pressure of 31 mmHg, and a mean arterial pressure of 78 mmHg. Which agent best addresses the primary problem?</>,
    options: [
      <>Phenylephrine, to raise the mean arterial pressure.</>,
      <>Dobutamine, to raise contractility, which raises output and lowers the filling pressure.</>,
      <>Nitroprusside alone, to reduce afterload.</>,
      <>Intravenous fluid, to raise preload.</>,
    ],
    answer: 1,
    rationale: (
      <>The failed term is output from a weak ventricle with a high filling pressure; raising contractility increases forward output and empties the congested ventricle, lowering the left atrial pressure (Figure 5.1). A raises afterload on an already failing ventricle and does not address output. C alone risks dropping an already marginal perfusion pressure, though afterload reduction is a useful adjunct. D adds volume to a ventricle whose filling pressure is already high, worsening pulmonary congestion (Lesson 2).</>
    ),
  },
  {
    id: 'l5-milrinone',
    stem: <>A patient on chronic high-dose beta blockade develops low cardiac output. Why might milrinone raise output when dobutamine is relatively ineffective?</>,
    options: [
      <>Milrinone is a stronger β<sub>1</sub> agonist than dobutamine.</>,
      <>Milrinone raises cyclic AMP downstream of the β receptor, so it does not depend on an available, coupled β receptor.</>,
      <>Milrinone has no effect on vascular tone, so all of its effect reaches the heart.</>,
      <>Beta blockade increases the number of β receptors, which milrinone then activates.</>,
    ],
    answer: 1,
    rationale: (
      <>Milrinone inhibits phosphodiesterase 3, raising cyclic AMP by blocking its breakdown rather than by stimulating the β receptor, so it works when the receptor is blocked or downregulated. A is wrong; milrinone is not a β agonist at all. C is false, as milrinone is a systemic and pulmonary vasodilator, which is why it is an inodilator. D confuses the receptor upregulation of chronic blockade with a mechanism of milrinone, which does not act at the receptor.</>
    ),
  },
  {
    id: 'l5-propofol',
    stem: <>A standard induction dose of propofol lowers the mean arterial pressure by about 16 mmHg in a healthy patient but by roughly twice as much in a hypovolemic patient. Why?</>,
    options: [
      <>Propofol is more potent at the GABA<sub>A</sub> receptor when blood volume is low.</>,
      <>The hypovolemic patient depends on reflex vascular tone and has little venous reserve, both of which propofol removes.</>,
      <>Propofol directly dilates vessels more in hypovolemia.</>,
      <>The measurement is an artifact of the lower starting pressure.</>,
    ],
    answer: 1,
    rationale: (
      <>Propofol lowers vascular tone, raises venous unstressed volume, and blunts the baroreflex; the hypovolemic patient is leaning on exactly that reflex tone and has no stressed-volume reserve to recruit, so the same drug effect produces a far larger pressure fall (Figure 5.1). A and C attribute to the drug a potency change that does not occur; the drug effect is the same and the patient's compensation differs. D is wrong, as the effect is a real, larger absolute fall, not a scaling artifact.</>
    ),
  },
  {
    id: 'l5-ketamine',
    stem: <>Ketamine usually raises heart rate and blood pressure, yet in a patient in late shock it can lower cardiac output. What explains the difference?</>,
    options: [
      <>Ketamine changes from a sympathomimetic to a sympatholytic at high doses.</>,
      <>In late shock the catecholamine reserve is exhausted, so the indirect sympathetic support is absent and ketamine's direct negative inotropy is unmasked.</>,
      <>Ketamine directly blocks α<sub>1</sub> receptors in shock.</>,
      <>The effect is due to ketamine's analgesia reducing sympathetic tone.</>,
    ],
    answer: 1,
    rationale: (
      <>Ketamine's pressor effect is indirect, depending on central sympathetic stimulation; when endogenous catecholamines are already maximally mobilized there is nothing further to recruit, and the drug's intrinsic myocardial depression becomes apparent (Figure 5.1). A describes a dose-dependent switch that does not occur. C invents an α<sub>1</sub>-blocking action ketamine lacks. D misattributes a myocardial effect to analgesia.</>
    ),
  },
]

export default function Lesson5() {
  return (
    <LessonPage
      meta={META}
      objectives={objectives}
      notation={notation}
      sections={sections}
      keyPoints={keyPoints}
      questions={questions}
      refs={L5_REFS}
    />
  )
}
