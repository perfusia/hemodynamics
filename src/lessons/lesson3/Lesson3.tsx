import { LessonPage, type LessonSection, type NotationRow } from '../../ui/Lesson'
import { LESSONS } from '../registry'
import { Eq, M } from '../../ui/Math'
import { Box, Note, Term } from '../../ui/Prose'
import { Cite } from '../../ui/Cite'
import type { QuestionData } from '../../ui/Question'
import { R3, L3_REFS } from './refs'
import { FigurePoiseuille, FigureWindkessel, FigureBaroreflex } from './figures'

const META = LESSONS[2]

const objectives = [
  <>State the Hagen-Poiseuille law and explain why arteriolar radius, raised to the fourth power, is the dominant control of vascular resistance.</>,
  <>Combine resistances in series and in parallel, and explain why systemic vascular resistance is a whole-body lumped quantity.</>,
  <>Describe the arterial tree as a Windkessel and relate pulse pressure to stroke volume and arterial compliance.</>,
  <>Explain why calculated systemic vascular resistance is a derived index rather than a measured property, and name its pitfalls.</>,
  <>Trace the arterial baroreflex from afferent to effector and predict the compensated response to hemorrhage and to vasodilation, including its failure under anesthesia.</>,
]

const notation: NotationRow[] = [
  { sym: String.raw`R`, def: 'hydraulic resistance', unit: 'mmHg·s·mL⁻¹' },
  { sym: String.raw`\eta`, def: 'blood viscosity', unit: 'Pa·s' },
  { sym: String.raw`L,\ r`, def: 'vessel length, radius', unit: 'cm' },
  { sym: String.raw`\mathrm{SVR}`, def: 'systemic vascular resistance', unit: 'dyn·s·cm⁻⁵' },
  { sym: String.raw`\mathrm{PVR}`, def: 'pulmonary vascular resistance', unit: 'dyn·s·cm⁻⁵' },
  { sym: String.raw`C_{sa}`, def: 'arterial compliance', unit: 'mL·mmHg⁻¹' },
  { sym: String.raw`\mathrm{PP}`, def: <>pulse pressure, <M t={String.raw`\mathrm{SBP}-\mathrm{DBP}`} /></>, unit: 'mmHg' },
  { sym: String.raw`Z_c`, def: 'characteristic impedance of the aorta', unit: 'mmHg·s·mL⁻¹' },
  { sym: String.raw`E_a`, def: 'effective arterial elastance', unit: 'mmHg·mL⁻¹' },
  { sym: String.raw`\tau`, def: 'effector time constant', unit: 's' },
  { sym: String.raw`G`, def: 'open-loop reflex gain', unit: 'dimensionless' },
]

const sections: LessonSection[] = [
  {
    id: 's1', num: '3.1', title: "Poiseuille's law and the fourth power of the radius",
    body: (
      <>
        <p>
          Lesson 1 defined systemic vascular resistance as the lumped opposition of the whole circulation to flow. This lesson asks
          what sets it, and the answer begins with a single vessel. For the steady laminar flow of a Newtonian fluid through a rigid
          cylindrical tube, the <Term>Hagen-Poiseuille law</Term> gives the resistance as
        </p>
        <Eq ruled n="3.1" t={String.raw`R=\frac{8\,\eta\,L}{\pi\,r^{4}}`} />
        <p>
          Resistance rises with the length of the tube and the viscosity of the fluid, but it depends on the radius raised to the
          <em> fourth</em> power. That exponent is the single most important fact about vascular control. Halving a vessel's radius does
          not double its resistance; it raises it sixteenfold. A narrowing of only 16 percent doubles the resistance of a bed, and the
          same small change, applied across the millions of arterioles in parallel, moves the resistance of the whole circulation
          (Figure 3.1).
        </p>
        <FigurePoiseuille />
        <p>
          This is why the <Term>arterioles</Term>, not the arteries or the capillaries, are the <Term>resistance vessels</Term>. Their
          walls are mostly circular smooth muscle, so a modest change in muscle tone produces a large change in radius and an enormous
          change in resistance. The largest pressure drop in the circulation, from a mean of about 85 mmHg in the aorta to near 30 mmHg
          at the start of the capillaries, occurs across them <Cite r={R3.hall2025} />. It is also why resistance is such a sensitive
          control: the same fourth-power law that lets a drug raise pressure quickly makes the system prone to overshoot.
          <Note>Equation 3.1 assumes steady laminar flow of a Newtonian fluid in a rigid tube. Blood is non-Newtonian, its apparent viscosity falling in the smallest vessels (the Fåhraeus-Lindqvist effect), flow is pulsatile, and vessels are distensible <Cite r={R3.pries1996} />. The fourth-power dependence on radius nonetheless dominates in vivo.</Note>
        </p>
      </>
    ),
  },
  {
    id: 's2', num: '3.2', title: 'Resistances in series and in parallel',
    body: (
      <>
        <p>
          The systemic circulation is not one tube but a network. Along a single path, the resistances of the arteries, arterioles,
          capillaries, and veins are in <Term>series</Term> and simply add; because the arteriolar term is so much larger than the
          others, it sets the total. The organs, by contrast, are arranged in <Term>parallel</Term> between the aorta and the right
          atrium, and parallel resistances combine as the reciprocal of the sum of reciprocals:
        </p>
        <Eq n="3.2" t={String.raw`R_{\text{series}}=\sum_i R_i,\qquad \frac{1}{R_{\text{parallel}}}=\sum_i \frac{1}{R_i}`} />
        <p>
          Two consequences follow. First, adding a parallel path always lowers the total resistance, which is why opening a large
          vascular bed, as exercise opens the muscle circulation or sepsis opens many beds at once, drops systemic vascular resistance.
          Second, because the beds share one arterial inflow pressure, the flow each receives is set by its own resistance, so
          regional blood flow is distributed by local arteriolar tone while the heart supplies the sum.
        </p>
        <p>
          Systemic vascular resistance is therefore a <Term>whole-body lumped quantity</Term>, the single number that represents this
          entire parallel network. The model computes it exactly as a clinician does, from the pressure drop and the flow
          (<M t={String.raw`\mathrm{SVR}=80(\mathrm{MAP}-\mathrm{CVP})/\mathrm{CO}`} />), and reports about 1,140 dyn·s·cm⁻⁵ at baseline.
          The pulmonary circulation, carrying the same cardiac output across a far smaller pressure drop, has a resistance roughly a
          tenth as large.
        </p>
      </>
    ),
  },
  {
    id: 's3', num: '3.3', title: 'The arterial Windkessel',
    body: (
      <>
        <p>
          Resistance explains the mean pressure, but not the pulse. The ventricle ejects its stroke volume in about a third of the
          cycle, yet flow continues through the capillaries throughout. The large elastic arteries reconcile the two: they distend in
          systole, storing part of each stroke volume, and recoil in diastole, driving that stored volume forward. This buffering
          function is the <Term>Windkessel</Term>, from the air chamber of a fire engine that smooths a pulsatile pump into steady flow
          <Cite r={R3.westerhof2009} />.
        </p>
        <p>
          The quantity that measures it is the arterial <Term>compliance</Term>, the volume stored per unit rise in pressure. To a good
          approximation the pulse pressure is the stroke volume divided by the arterial compliance:
        </p>
        <Eq n="3.3" t={String.raw`\mathrm{PP}\approx \frac{\mathrm{SV}}{C_{sa}}`} />
        <p>
          so a stiffer aorta, which has a lower compliance, produces a wider pulse at the same stroke volume <Cite r={R3.chemla1998} />.
          In Figure 3.2, lowering the compliance from a young adult's value toward that of a stiffened, aged aorta widens the model's
          pulse pressure from about 41 to 64 mmHg while the mean pressure barely changes, because the mean is set by output and
          resistance and the compliance only redistributes the pressure within the beat. This is the mechanism of <Term>isolated
          systolic hypertension</Term>, the dominant form of hypertension after the sixth decade, and the widened pulse pressure it
          produces is itself a marker of cardiovascular risk <Cite r={R3.mitchell2010} />.
        </p>
        <FigureWindkessel />
        <p>
          A complete description of the arterial load needs three elements, not one: the arteriolar resistance that sets the mean, the
          compliance that buffers the pulse, and the <Term>characteristic impedance</Term> <M t="Z_c" /> of the proximal aorta, which
          opposes the initial ejection and depends on the aorta's local stiffness and caliber. The model uses exactly this three-element
          Windkessel. Together these elements are summarized, for the purpose of coupling to the ventricle, by the effective arterial
          elastance <M t="E_a" /> of Lesson 2, which is why <M t="E_a" /> rises both when resistance rises and when the aorta stiffens
          <Cite r={R3.nichols2011} />.
          <Note>Over a cardiac cycle <M t={String.raw`E_a\approx R/T`} /> captures most of the load, but the compliance and <M t="Z_c" /> account for the difference between that estimate and the true ratio of end-systolic pressure to stroke volume seen in Lesson 2.</Note>
        </p>
      </>
    ),
  },
  {
    id: 's4', num: '3.4', title: 'Calculated resistance and its pitfalls',
    body: (
      <>
        <p>
          Systemic vascular resistance is almost never measured. It is <Term>calculated</Term>, after the fact, from a measured mean
          pressure, a measured or assumed central venous pressure, and a measured cardiac output, by rearranging the arterial pressure
          equation:
        </p>
        <Eq n="3.4" t={String.raw`\mathrm{SVR}=80\cdot\frac{\mathrm{MAP}-\mathrm{CVP}}{\mathrm{CO}}`} />
        <p>
          The number is useful, but three cautions follow from how it is produced. First, it is a <Term>lump</Term>: it compresses the
          whole parallel network, with its regional differences, into one value, and says nothing about where the tone resides.
          Second, it describes <em>steady</em> flow and ignores the pulsatile load, so two circulations with the same calculated
          resistance can present very different loads to the ventricle if their compliances differ (Section 3.3).
        </p>
        <p>
          Third, and most treacherous at the bedside, the calculated resistance is not independent of the cardiac output used to
          compute it. Because cardiac output sits in the denominator, a fall in output raises the calculated resistance even if the
          vessels have not changed at all. A patient whose output drops for a cardiac reason will show a rising calculated resistance
          that can be misread as vasoconstriction, when it is in part an artifact of the arithmetic <Cite r={R3.hall2025} />. The
          resistance is a derived index to be interpreted alongside the output and the clinical picture, never a direct readout of
          vascular tone.
        </p>
        <Box n="3.1" kind="Clinical correlate · Hemodynamic monitoring">
          <p>
            A pulmonary artery catheter reports cardiac output and the pressures from which resistance is derived, and early
            goal-directed protocols once targeted a calculated resistance directly. The practice fell out of favor partly for the reason
            above: driving a number that is itself a function of cardiac output invites circular corrections. Modern practice treats
            resistance as one input to a judgment about which term of the pressure equation has failed, read together with the output,
            the filling pressures, and the examination, rather than as a target in its own right.
          </p>
        </Box>
      </>
    ),
  },
  {
    id: 's5', num: '3.5', title: 'The arterial baroreflex',
    body: (
      <>
        <p>
          The circulation defends its own pressure. Stretch-sensitive nerve endings in the walls of the <Term>carotid sinus</Term> and
          the <Term>aortic arch</Term> fire in proportion to arterial pressure and its rate of rise, signaling through the
          glossopharyngeal and vagus nerves to the nucleus tractus solitarius in the medulla. A fall in pressure unloads these
          baroreceptors, their firing drops, and the medulla responds by withdrawing parasympathetic and increasing sympathetic
          outflow <Cite r={R3.hall2025} />. This is the <Term>arterial baroreflex</Term>, the fastest controller of blood pressure.
        </p>
        <p>
          Its efferent limb acts on four effectors, the same four the model implements, each with its own latency. Vagal withdrawal
          and sympathetic drive raise the <strong>heart rate</strong> within a beat or two; sympathetic drive raises myocardial
          <strong> contractility</strong>; it constricts the <strong>arterioles</strong>, raising resistance; and it constricts the
          veins, reducing their <strong>unstressed volume</strong> and shifting blood toward the heart to support filling (Lesson 4).
          In the model these act through first-order lags of about 2 s for heart rate, 8 s for contractility, 6 s for resistance, and
          20 s for venous capacitance, the fastest arm being the vagally mediated change in rate.
          <Note>The strength of the loop is its <Term>open-loop gain</Term> <M t="G" />, the ratio of the correction it produces to the disturbance that provoked it. A gain of roughly 2 to 5 for the intact human reflex means it offsets most, but never all, of an acute pressure change; the residual error is what remains after compensation. Clinically the reflex is quantified as <Term>baroreflex sensitivity</Term>, the change in cardiac interval per mmHg, which declines with age and carries prognostic weight after myocardial infarction <Cite r={R3.larovere2008} />.</Note>
        </p>
        <p>
          The reflex is a <Term>short-term buffer</Term>, not a long-term controller. Over hours to days it resets its set point to the
          prevailing pressure, so it cannot be the cause of, or the cure for, chronic hypertension; the slow control of pressure
          belongs to the kidney and the renin-angiotensin-aldosterone system. What the baroreflex does, and does within seconds, is
          hold the pressure steady through the moment-to-moment disturbances of posture, breathing, and acute blood loss.
        </p>
      </>
    ),
  },
  {
    id: 's6', num: '3.6', title: 'Compensation, and its failure under anesthesia',
    body: (
      <>
        <p>
          Figure 3.3 subjects the model to two insults, a 20 percent hemorrhage and an abrupt halving of arteriolar resistance, with
          the baroreflex intact and with it switched off. The difference is the whole argument of the lesson. After the hemorrhage with
          the reflex intact, heart rate rises to about 102 min⁻¹ and calculated resistance to about 1,650 dyn·s·cm⁻⁵, and the mean
          pressure, having dipped, recovers to about 77 mmHg. With the reflex absent, the same blood loss drives the mean pressure to
          about 33 mmHg, frank shock, with no change in rate. Acute vasodilation tells the same story: the intact reflex holds the mean
          near 79 mmHg by raising rate and output, while without it the pressure falls to about 50 mmHg.
        </p>
        <FigureBaroreflex />
        <p>
          The compensated state is not the healthy state. The tachycardia and the cool, vasoconstricted periphery that defend the
          pressure are themselves the signs by which hemorrhage and cardiogenic shock are recognized, and they are bought at the cost
          of myocardial oxygen demand. A normal blood pressure in a bleeding patient is reassuring only until the reflex is exhausted,
          after which the pressure falls precipitously. Reading the compensation, not just the pressure, is what distinguishes early
          from late shock.
        </p>
        <Box n="3.2" kind="Clinical correlate · Induction of anesthesia">
          <p>
            Almost every anesthetic blunts the efferent arm of the baroreflex. Propofol in particular attenuates the reflex increase in
            heart rate and sympathetic outflow, so the vasodilation and mild myocardial depression it produces are no longer opposed
            <Cite r={R3.ebert1992} />. This is why induction hypotension is both common and larger than the agent's direct effect would
            predict: the figure's reflex-absent curve is the better model of the anesthetized patient than its reflex-intact curve.
            Neuraxial anesthesia does the same regionally by blocking the sympathetic efferents below the level of the block, and a
            denervated transplanted heart, or one under high-dose beta-blockade, cannot mount the reflex tachycardia at all. In each
            case the clinician must supply, with a vasopressor or an inotrope, the correction the reflex can no longer make.
          </p>
        </Box>
      </>
    ),
  },
]

const keyPoints = [
  <>Resistance varies with the inverse fourth power of vessel radius, so the arterioles, whose smooth muscle sets their radius, are the controlling resistance vessels; a 16 percent narrowing doubles a bed's resistance.</>,
  <>Resistances in series add; parallel beds combine as reciprocals. Systemic vascular resistance is the single lumped value of this whole parallel network.</>,
  <>Arterial compliance buffers the pulse: <M t={String.raw`\mathrm{PP}\approx \mathrm{SV}/C_{sa}`} />. A stiff aorta widens the pulse pressure at an unchanged mean, the mechanism of isolated systolic hypertension.</>,
  <>Calculated resistance is a derived lumped index. Because cardiac output is in its denominator, a fall in output raises it even when the vessels are unchanged.</>,
  <>The baroreflex is the fast, short-term defender of pressure, acting through heart rate, contractility, arteriolar tone, and venous capacitance; it is blunted by anesthesia, which is why induction hypotension exceeds a drug's direct effect.</>,
]

const questions: QuestionData[] = [
  {
    id: 'l3-poiseuille',
    stem: <>An arteriole constricts so that its radius falls to 70 percent of its resting value. By approximately what factor does its resistance change?</>,
    options: [
      <>It increases about 1.4-fold.</>,
      <>It increases about 2-fold.</>,
      <>It increases about 4-fold.</>,
      <>It increases about 16-fold.</>,
    ],
    answer: 2,
    rationale: (
      <>By Poiseuille's law resistance scales as <M t={String.raw`1/r^4`} />, so a radius of 0.70 gives <M t={String.raw`1/0.70^4\approx 4.2`} />, about a fourfold rise. A uses the radius itself rather than its fourth power; B uses the square; D is the value for halving the radius (<M t={String.raw`1/0.5^4=16`} />), a larger constriction than described.</>
    ),
  },
  {
    id: 'l3-parallel',
    stem: <>During exercise a large skeletal muscle bed dilates and opens in parallel with the rest of the systemic circulation. Holding cardiac output constant for the moment, what is the immediate effect on systemic vascular resistance and on the flow to other organs' beds?</>,
    options: [
      <>Resistance rises, and flow to other beds rises.</>,
      <>Resistance falls, and flow to other beds tends to fall unless output rises.</>,
      <>Resistance falls, and flow to other beds is unchanged because each bed is independent.</>,
      <>Resistance is unchanged because the new bed was already present.</>,
    ],
    answer: 1,
    rationale: (
      <>Adding a low-resistance parallel path lowers the total resistance (Eq. 3.2). At a fixed output the arterial pressure falls, so other beds, seeing a lower perfusion pressure, tend to receive less flow unless cardiac output rises to compensate, which in exercise it does. A has the direction of resistance wrong; C ignores the shared inflow pressure that couples the beds; D ignores that the bed's resistance has just fallen.</>
    ),
  },
  {
    id: 'l3-pp',
    stem: <>A 75-year-old has a blood pressure of 160/70 mmHg; a 25-year-old has 120/80 mmHg. Both have a normal cardiac output. What best explains the older patient's wide pulse pressure?</>,
    options: [
      <>A higher systemic vascular resistance.</>,
      <>A reduced arterial compliance from aortic stiffening.</>,
      <>A higher stroke volume.</>,
      <>An elevated central venous pressure.</>,
    ],
    answer: 1,
    rationale: (
      <>Pulse pressure is approximately <M t={String.raw`\mathrm{SV}/C_{sa}`} /> (Eq. 3.3); a stiff, low-compliance aorta widens it at a normal stroke volume, the mechanism of isolated systolic hypertension. A higher resistance would raise the mean and the diastolic pressure, not selectively widen the pulse; the stroke volume is not stated to be high; central venous pressure does not set the pulse pressure.</>
    ),
  },
  {
    id: 'l3-svr',
    stem: <>A patient with a failing heart has a cardiac output that falls from 5.0 to 2.5 L·min⁻¹ while mean arterial pressure holds at 80 mmHg and central venous pressure at 8 mmHg. The calculated systemic vascular resistance therefore doubles. Which interpretation is most correct?</>,
    options: [
      <>The vasculature has vasoconstricted to exactly double its tone.</>,
      <>The calculated rise is at least partly an arithmetic consequence of the lower output, though reflex vasoconstriction may also contribute.</>,
      <>The calculation is invalid because resistance cannot change that fast.</>,
      <>Mean arterial pressure must have been measured incorrectly.</>,
    ],
    answer: 1,
    rationale: (
      <>Cardiac output is in the denominator of Equation 3.4, so halving it doubles the calculated resistance even with no change in the vessels; a real reflex vasoconstriction usually coexists, but the number alone cannot separate the two. A over-reads the calculated value as a direct measurement; C and D invent errors rather than recognizing the structure of the formula.</>
    ),
  },
  {
    id: 'l3-reflex',
    stem: <>A healthy patient and a patient on chronic high-dose beta-blockade each lose 15 percent of their blood volume. Compared with the healthy patient, the beta-blocked patient is most likely to show:</>,
    options: [
      <>A larger compensatory tachycardia and a better-defended pressure.</>,
      <>A blunted heart-rate response and a greater fall in mean arterial pressure for the same loss.</>,
      <>An identical response, because the baroreflex acts mainly through vasoconstriction.</>,
      <>A higher mean pressure, because beta-blockade raises systemic vascular resistance.</>,
    ],
    answer: 1,
    rationale: (
      <>Beta-blockade disables the reflex's fastest effector, the increase in heart rate, so the beta-blocked patient cannot raise rate to defend the pressure and falls further for the same loss, as the figure's attenuated-reflex curve shows. A reverses the effect; C understates the contribution of rate and contractility, both of which are beta-mediated; D is wrong because beta-blockade does not raise resistance and the net effect here is a lower, not higher, pressure.</>
    ),
  },
]

export default function Lesson3() {
  return (
    <LessonPage
      meta={META}
      objectives={objectives}
      notation={notation}
      sections={sections}
      keyPoints={keyPoints}
      questions={questions}
      refs={L3_REFS}
    />
  )
}
