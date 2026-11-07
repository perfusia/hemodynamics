import { LessonPage, type LessonSection, type NotationRow } from '../../ui/Lesson'
import { LESSONS } from '../registry'
import { Eq, M } from '../../ui/Math'
import { Box, Note, Term } from '../../ui/Prose'
import { Cite } from '../../ui/Cite'
import type { QuestionData } from '../../ui/Question'
import { R1, L1_REFS } from './refs'
import { FigureTimeAverage, FigureMAPPlane, FigureShockMonitor } from './figures'

const META = LESSONS[0]

const objectives = [
  <>Define mean arterial pressure as the time average of the arterial waveform and state why it, rather than systolic pressure, is the quantity that governs organ perfusion.</>,
  <>Write the arterial pressure equation in its hydraulic form and calculate systemic vascular resistance from measured pressures and cardiac output.</>,
  <>Distinguish perfusion pressure from arterial pressure and explain the basis of the 65 mmHg threshold used in critical care.</>,
  <>Classify hypotension by the term of the equation that has failed, and give the archetypal cause and first treatment for each.</>,
]

const notation: NotationRow[] = [
  { sym: String.raw`\mathrm{MAP}`, def: 'mean arterial pressure', unit: 'mmHg' },
  { sym: String.raw`\mathrm{SBP},\ \mathrm{DBP}`, def: 'systolic, diastolic pressure', unit: 'mmHg' },
  { sym: String.raw`\mathrm{PP}`, def: <>pulse pressure, <M t={String.raw`\mathrm{SBP}-\mathrm{DBP}`} /></>, unit: 'mmHg' },
  { sym: String.raw`\mathrm{CO}`, def: 'cardiac output', unit: 'L·min⁻¹' },
  { sym: String.raw`\mathrm{CVP}`, def: 'central venous pressure', unit: 'mmHg' },
  { sym: String.raw`\mathrm{SVR}`, def: 'systemic vascular resistance', unit: 'dyn·s·cm⁻⁵' },
  { sym: String.raw`\mathrm{MPP}`, def: 'mean perfusion pressure', unit: 'mmHg' },
  { sym: String.raw`\Delta P`, def: 'pressure difference across a bed', unit: 'mmHg' },
]

const sections: LessonSection[] = [
  {
    id: 's1', num: '1.1', title: 'Mean arterial pressure as a time average',
    body: (
      <>
        <p>
          A blood pressure reported as 120 over 80 names two instants of a continuous waveform: the systolic peak as the ventricle
          ejects and the diastolic trough as it fills. Neither instant is the pressure that drives blood through the organs over a whole
          cardiac cycle. That quantity is the <Term>mean arterial pressure</Term>, the time average of arterial pressure across one beat:
        </p>
        <Eq n="1.1" t={String.raw`\mathrm{MAP}=\frac{1}{T}\int_0^{T} P_{a}(t)\,dt`} />
        <p>
          Because systole is shorter than diastole, the average lies nearer the diastolic value than halfway between the two. The bedside
          estimate weights diastole by two thirds of the cycle:
        </p>
        <Eq n="1.2" t={String.raw`\mathrm{MAP}\approx \mathrm{DBP}+\tfrac{1}{3}\,(\mathrm{SBP}-\mathrm{DBP})=\mathrm{DBP}+\tfrac{1}{3}\,\mathrm{PP}`} />
        <p>
          For 120/80 this gives about 93 mmHg. The rule is only an approximation, and it underestimates the true mean, because the
          arterial waveform carries a form factor nearer 0.4 than one third; the shortfall grows at faster heart rates, where systole
          occupies a larger fraction of the cycle <Cite r={R1.razminia2004} />.
          <Note>In Figure 1.1 the model's true mean (solid line) runs a few mmHg above the <M t={String.raw`\mathrm{DBP}+\tfrac{1}{3}\mathrm{PP}`} /> estimate (dashed) at every heart rate; an invasive monitor integrates the waveform directly and so reports the true mean. The lumped model understates how much the gap widens with tachycardia in real recordings, so read its heart-rate trend with that caveat.</Note>
        </p>
        <FigureTimeAverage />
        <p>
          Mean arterial pressure is nearly constant along the large arteries, because their resistance is low, so a radial arterial line
          reports essentially the aortic mean. Systolic pressure, by contrast, is amplified in the periphery as the pressure wave
          reflects, which is one reason the mean is the more stable and more physiologic number to follow.
        </p>
      </>
    ),
  },
  {
    id: 's2', num: '1.2', title: 'Pressure, flow, and resistance',
    body: (
      <>
        <p>
          A pressure is generated whenever a flow is driven through a resistance. For steady laminar flow the relation is linear, the
          hydraulic analogue of Ohm's law: the pressure drop across a vascular bed equals the flow through it times the resistance of
          the bed.
        </p>
        <Eq n="1.3" t={String.raw`\Delta P = Q\cdot R`} />
        <p>
          Applied to the whole systemic circulation, the flow is the cardiac output, the pressure drop is the difference between the
          mean arterial pressure at the inflow and the central venous pressure at the outflow, and the resistance is the{' '}
          <Term>systemic vascular resistance</Term>:
        </p>
        <Eq ruled n="1.4" t={String.raw`\mathrm{MAP}-\mathrm{CVP}=\mathrm{CO}\cdot\mathrm{SVR}`} />
        <p>
          This is the central equation of the course. It states that the pressure driving systemic flow is set by just two quantities:
          how much blood the heart delivers per minute, and how tightly the vasculature resists its passage. Rearranged, it defines the
          resistance a clinician calculates from a pulmonary artery catheter, with the factor of 80 converting to the conventional
          units of dyn·s·cm⁻⁵:
        </p>
        <Eq n="1.5" t={String.raw`\mathrm{SVR}=80\cdot\frac{\mathrm{MAP}-\mathrm{CVP}}{\mathrm{CO}}`} />
        <p>
          Every combination of cardiac output and resistance that yields the same mean pressure lies on one curve in the output-resistance
          plane (Figure 1.2). The normal adult operates near a cardiac output of 5 L·min⁻¹ and a resistance of about 1,000 to 1,200
          dyn·s·cm⁻⁵; the model's baseline sits at the lower edge of that band.
          <Note>Equation 1.4 is a steady-state identity, not a mechanism. It does not say which variable is independent. Cardiac output and resistance are coupled through the heart and the vasculature, which is why changing one often changes the other, as Lessons 3 and 4 show.</Note>
        </p>
        <FigureMAPPlane />
        <Box n="1.1" kind="Analogy · Electrical circuits">
          <p>
            Equation 1.4 is Ohm's law with the terms renamed: mean arterial pressure is the voltage across the circuit, cardiac output is
            the current, and systemic vascular resistance is the resistance. The analogy is exact for steady flow and useful for
            intuition, but it has limits. Blood is not an ideal fluid, vessels are distensible rather than rigid, and flow is pulsatile,
            so the arterial tree also stores and returns energy with each beat, an effect captured by compliance rather than resistance
            (Lesson 3).
          </p>
        </Box>
      </>
    ),
  },
  {
    id: 's3', num: '1.3', title: 'Perfusion pressure and the critical threshold',
    body: (
      <>
        <p>
          Mean arterial pressure is the inflow pressure to an organ, but what drives flow through an organ is the difference between its
          inflow and its outflow pressure, the <Term>perfusion pressure</Term>. For most organs the outflow pressure is near the central
          venous pressure, so
        </p>
        <Eq n="1.6" t={String.raw`\mathrm{MPP}=\mathrm{MAP}-\mathrm{CVP}`} />
        <p>
          but for two organs the relevant downstream pressure is higher than the venous pressure. Cerebral perfusion pressure is mean
          arterial pressure minus intracranial pressure, and coronary perfusion of the left ventricle is driven in diastole by the
          difference between aortic diastolic pressure and left ventricular diastolic pressure. A raised intracranial or ventricular
          filling pressure therefore lowers perfusion at an unchanged arterial pressure, which is why both the numerator and the
          downstream pressure matter.
        </p>
        <p>
          Within a range, organs defend their own blood flow against changes in perfusion pressure by adjusting arteriolar tone, a
          process called <Term>autoregulation</Term>. The brain, heart, and kidney hold flow roughly constant over a mean arterial
          pressure classically given as about 60 to 150 mmHg in a normotensive adult, though the plateau is a textbook idealization and
          the true lower limit varies widely between individuals <Cite r={R1.meng2018} />; the whole range shifts upward in chronic
          hypertension. Below the lower limit, autoregulation is exhausted and flow falls with pressure. The threshold of 65 mmHg used across critical care is a
          pragmatic floor set near that lower limit <Cite r={R1.vincent2013} />; a large randomized trial in septic shock found no
          overall benefit to targeting 80 to 85 rather than 65 to 70 mmHg, although chronically hypertensive patients needed less renal
          replacement at the higher target <Cite r={R1.asfar2014} />. The right threshold is therefore a patient-specific judgment, not
          a universal constant <Cite r={[R1.leone2015, R1.meng2018]} />.
        </p>
        <Box n="1.2" kind="Clinical correlate · Operating room">
          <p>
            Induction of general anesthesia predictably lowers mean arterial pressure by reducing vascular tone and, with most agents,
            cardiac output (Lesson 5). The perioperative literature associates even brief intraoperative mean pressures below about 65
            mmHg with myocardial and renal injury, and the association steepens the lower and longer the exposure <Cite r={R1.meng2018} />.
            The equation explains the management: the pressure can be restored by raising resistance with a vasopressor, raising output
            with an inotrope or fluid, or both, and the correct choice depends on which term fell.
          </p>
        </Box>
      </>
    ),
  },
  {
    id: 's4', num: '1.4', title: 'A first classification of hypotension',
    body: (
      <>
        <p>
          Equation 1.4 has only two terms on its right side, so a low mean arterial pressure has only two proximate causes: cardiac
          output has fallen, or systemic vascular resistance has fallen, or both. This yields a classification of shock that the rest of
          the course refines <Cite r={R1.vincent2013} />.
        </p>
        <p>
          <strong>Resistance has fallen.</strong> In <Term>vasodilatory</Term> (distributive) shock, the archetype of which is sepsis,
          arteriolar tone collapses. Cardiac output is usually normal or high, yet mean pressure falls because resistance has dropped
          further than output has risen. In Figure 1.3, the vasodilatory state shows a high output with a resistance near 500
          dyn·s·cm⁻⁵. The first-line treatment restores tone with a vasopressor <Cite r={R1.vincent2013} />.
        </p>
        <p>
          <strong>Output has fallen.</strong> In <Term>cardiogenic</Term> shock the pump fails, and in <Term>hypovolemic</Term> shock
          the pump is underfilled. In both, cardiac output falls and the baroreflex raises resistance to defend the pressure, so the
          skin is cool and the calculated resistance is high. The two are distinguished by filling: the central venous pressure is low
          in hemorrhage and normal or high in cardiac failure. The treatment differs accordingly, volume for one and inotropy or
          mechanical support for the other, and giving the wrong one is harmful.
        </p>
        <FigureShockMonitor />
        <p>
          The lesson of Figure 1.3 is that the mean arterial pressure alone does not name the problem. The same low pressure can
          conceal a high output with a collapsed resistance or a low output with a clamped-down resistance, and the two demand opposite
          interventions. Reading which term has failed, from the cardiac output, the filling pressures, and the examination, is the
          first act of hemodynamic reasoning. The remaining lessons supply the quantitative tools: what sets cardiac output
          (Lesson 2), what sets resistance and how the reflex defends the pressure (Lesson 3), what sets venous return and filling
          (Lesson 4), and how drugs move each term (Lesson 5).
        </p>
      </>
    ),
  },
]

const keyPoints = [
  <>Mean arterial pressure is the time average of the arterial waveform and the pressure that governs organ perfusion; the bedside estimate <M t={String.raw`\mathrm{DBP}+\tfrac{1}{3}\mathrm{PP}`} /> underestimates the true mean, which an invasive monitor obtains by integration.</>,
  <>The arterial pressure equation is <M t={String.raw`\mathrm{MAP}-\mathrm{CVP}=\mathrm{CO}\cdot\mathrm{SVR}`} />, from which <M t={String.raw`\mathrm{SVR}=80(\mathrm{MAP}-\mathrm{CVP})/\mathrm{CO}`} />.</>,
  <>Perfusion pressure is mean arterial pressure minus the downstream pressure, which is the central venous pressure for most organs, intracranial pressure for the brain, and ventricular diastolic pressure for the left coronary bed.</>,
  <>Autoregulation holds organ flow roughly constant from about 60 to 150 mmHg; the 65 mmHg critical-care threshold is a pragmatic floor, not a universal target.</>,
  <>A low mean pressure is always either a low cardiac output or a low systemic vascular resistance. The cause determines the treatment, and the number alone does not reveal the cause.</>,
]

const questions: QuestionData[] = [
  {
    id: 'l1-map',
    stem: <>An arterial line reads 160/60 mmHg at a heart rate of 50 min⁻¹. How will the monitor's integrated mean arterial pressure compare with the bedside estimate <M t={String.raw`\mathrm{DBP}+\tfrac{1}{3}\mathrm{PP}`} />, which equals 93 mmHg here?</>,
    options: [
      <>Lower than the estimate, because the wide pulse pressure inflates the one-third term.</>,
      <>Higher than the estimate, because the one-third rule underestimates the true mean, which an invasive monitor obtains by integration.</>,
      <>Equal to the estimate, because the formula computes the integral exactly.</>,
      <>Indeterminate without knowing the systolic upstroke time.</>,
    ],
    answer: 1,
    rationale: (
      <>The one-third rule is only an approximation, and it underestimates the true mean: the best-fit coefficient on the pulse pressure is nearer 0.4 than one third, and it grows at faster heart rates (Razminia et al., 2004), so the fixed one-third rule falls short. The model's integrated mean sits above the estimate (Figure 1.1). A has the direction backward, C claims an exactness the formula lacks, and D is wrong because the direction of the error is systematic and known.</>
    ),
  },
  {
    id: 'l1-svr',
    stem: <>A patient has a mean arterial pressure of 60 mmHg, a central venous pressure of 10 mmHg, and a cardiac output of 2.5 L·min⁻¹. What is the systemic vascular resistance, and what pattern does it suggest?</>,
    options: [
      <>1,600 dyn·s·cm⁻⁵; a low output with compensatory vasoconstriction.</>,
      <>1,600 dyn·s·cm⁻⁵; vasodilatory shock.</>,
      <>2,240 dyn·s·cm⁻⁵; a low output with compensatory vasoconstriction.</>,
      <>400 dyn·s·cm⁻⁵; vasodilatory shock.</>,
    ],
    answer: 0,
    rationale: (
      <>Equation 1.5 gives <M t={String.raw`80\times(60-10)/2.5 = 1{,}600`} /> dyn·s·cm⁻⁵, a high resistance, so the low pressure is driven by the low output, not by vasodilation; the raised resistance and raised filling pressure fit cardiogenic shock. B names the wrong pattern. C adds the central venous pressure instead of subtracting it, computing <M t={String.raw`80\times(60+10)/2.5`} />. D inverts the arithmetic.</>
    ),
  },
  {
    id: 'l1-cpp',
    stem: <>A patient with a traumatic brain injury has a mean arterial pressure of 70 mmHg and an intracranial pressure of 25 mmHg. Which statement is correct?</>,
    options: [
      <>Cerebral perfusion pressure is 70 mmHg, because the arterial pressure exceeds 65 mmHg.</>,
      <>Cerebral perfusion pressure is 45 mmHg, because the downstream pressure is the intracranial pressure.</>,
      <>Cerebral perfusion pressure is 95 mmHg, because the pressures add.</>,
      <>Cerebral perfusion is adequate because autoregulation holds flow constant at any pressure.</>,
    ],
    answer: 1,
    rationale: (
      <>For the brain the downstream pressure is intracranial pressure, so cerebral perfusion pressure is <M t={String.raw`70-25=45`} /> mmHg, below the usual 60 mmHg target. A applies the systemic threshold and the wrong downstream pressure; C adds instead of subtracting; D overstates autoregulation, which fails outside its range and is often impaired after injury.</>
    ),
  },
  {
    id: 'l1-class',
    stem: <>Two patients each have a mean arterial pressure of 58 mmHg. Patient A has a cardiac output of 9 L·min⁻¹ and warm extremities; patient B has a cardiac output of 2.8 L·min⁻¹ and cool extremities. Which is the best first intervention for each?</>,
    options: [
      <>A vasopressor for A, and an inotrope or fluid for B.</>,
      <>An inotrope for A, and a vasopressor for B.</>,
      <>Fluid for both, because both are hypotensive.</>,
      <>A vasodilator for A, because the output is high.</>,
    ],
    answer: 0,
    rationale: (
      <>A has a high output and must therefore have a low resistance (Eq. 1.4), the vasodilatory pattern, treated by restoring tone with a vasopressor. B has a low output with a high resistance, treated by raising output with fluid or an inotrope depending on filling. B and C misread the failed term, and D would lower an already low pressure.</>
    ),
  },
]

export default function Lesson1() {
  return (
    <LessonPage
      meta={META}
      objectives={objectives}
      notation={notation}
      sections={sections}
      keyPoints={keyPoints}
      questions={questions}
      refs={L1_REFS}
    />
  )
}
