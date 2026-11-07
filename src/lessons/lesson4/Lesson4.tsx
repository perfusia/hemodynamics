import { LessonPage, type LessonSection, type NotationRow } from '../../ui/Lesson'
import { LESSONS } from '../registry'
import { Eq, M } from '../../ui/Math'
import { Box, Note, Term } from '../../ui/Prose'
import { Cite } from '../../ui/Cite'
import type { QuestionData } from '../../ui/Question'
import { R4, L4_REFS } from './refs'
import { FigureGuyton, FigureFluidResponse } from './figures'

const META = LESSONS[3]

const objectives = [
  <>Distinguish stressed from unstressed volume and define mean systemic filling pressure as the pressure that drives venous return.</>,
  <>Construct the venous return curve and explain why right atrial pressure is the back-pressure to venous return and why the curve plateaus.</>,
  <>Locate the circulatory operating point as the intersection of the venous return and cardiac function curves, and explain why cardiac output equals venous return in the steady state.</>,
  <>Predict how volume, venous tone, and contractility move the two curves and the operating point.</>,
  <>Explain heart-lung interaction and why transmural pressure, not measured filling pressure, determines ventricular distension.</>,
  <>State the basis, threshold, and limitations of dynamic indices of fluid responsiveness.</>,
]

const notation: NotationRow[] = [
  { sym: String.raw`\mathrm{VR}`, def: 'venous return', unit: 'L·min⁻¹' },
  { sym: String.raw`P_{msf}`, def: 'mean systemic filling pressure', unit: 'mmHg' },
  { sym: String.raw`P_{RA}`, def: 'right atrial pressure (equals CVP)', unit: 'mmHg' },
  { sym: String.raw`R_{VR}`, def: 'resistance to venous return', unit: 'mmHg·min·L⁻¹' },
  { sym: String.raw`V_s`, def: 'stressed volume', unit: 'mL' },
  { sym: String.raw`V_u`, def: 'unstressed volume', unit: 'mL' },
  { sym: String.raw`C`, def: 'total vascular compliance', unit: 'mL·mmHg⁻¹' },
  { sym: String.raw`P_{tm}`, def: 'transmural (distending) pressure', unit: 'mmHg' },
  { sym: String.raw`P_{pl}`, def: 'pleural pressure', unit: 'mmHg' },
  { sym: String.raw`\mathrm{PPV}`, def: 'pulse pressure variation', unit: '%' },
]

const sections: LessonSection[] = [
  {
    id: 's1', num: '4.1', title: 'The venous reservoir: stressed and unstressed volume',
    body: (
      <>
        <p>
          Lesson 2 showed that stroke volume depends on filling, and Lesson 1 placed cardiac output on one side of the pressure
          equation. Neither asked what fills the heart. The answer lies in the veins, which hold about two thirds of the blood volume
          at a low pressure and act as the capacitance of the circulation <Cite r={R4.hall2025} />. Understanding preload means
          understanding this reservoir.
        </p>
        <p>
          Not all of the venous blood generates pressure. Fill a collapsed, compliant vein and the first increment rounds it out
          without stretching its wall; this is the <Term>unstressed volume</Term>, and it produces no distending pressure. Only volume
          added beyond that point stretches the wall and raises intravascular pressure; this is the <Term>stressed volume</Term>. The
          pressure that the stressed volume generates throughout the systemic circulation, measured when flow has stopped and pressures
          have equalized, is the <Term>mean systemic filling pressure</Term>:
        </p>
        <Eq n="4.1" t={String.raw`P_{msf}=\frac{V_s}{C}=\frac{V_{\text{total}}-V_u}{C}`} />
        <p>
          where <M t="C" /> is the total vascular compliance. In a normal adult <M t="P_{msf}" /> is about 7 to 10 mmHg; the model's
          baseline is about 8 mmHg.
          <Note>Guyton measured <M t="P_{msf}" /> in dogs by fibrillating the heart and reading the pressure to which the whole circulation equilibrated within seconds, before reflexes intervened <Cite r={R4.guyton1955} />. It cannot be measured directly at the bedside, but it can be estimated, and it is the pressure that the circulation defends when it recruits volume.</Note>{' '}
          Two interventions raise <M t="P_{msf}" /> and so raise the pressure available to fill the heart: adding volume increases{' '}
          <M t="V_s" />, and venoconstriction converts unstressed volume into stressed volume by reducing <M t="V_u" />. A sympathetic
          surge or an α-agonist can recruit several hundred millilitres this way without any transfusion, which is why venous tone is a
          hidden reserve in shock.
        </p>
      </>
    ),
  },
  {
    id: 's2', num: '4.2', title: "Guyton's venous return curve",
    body: (
      <>
        <p>
          Blood returns to the heart down a pressure gradient, from the mean systemic filling pressure out in the small veins to the
          right atrial pressure at the entrance to the heart, across the resistance of the venous pathway. The flow is their difference
          divided by that resistance:
        </p>
        <Eq ruled n="4.2" t={String.raw`\mathrm{VR}=\frac{P_{msf}-P_{RA}}{R_{VR}}`} />
        <p>
          This relation reverses the usual intuition about right atrial pressure. Here <M t="P_{RA}" /> is not a result of venous return
          but the <Term>back-pressure</Term> that opposes it: the higher the right atrial pressure, the smaller the gradient and the less
          blood returns. Plotting venous return against right atrial pressure therefore gives a line that falls as <M t="P_{RA}" /> rises
          and reaches zero when <M t="P_{RA}=P_{msf}" /> (Figure 4.1, blue). At the other end the curve flattens into a plateau: once
          right atrial pressure falls below atmospheric, the great veins collapse where they enter the thorax, and further lowering of
          right atrial pressure cannot increase flow <Cite r={R4.henderson2010} />.
        </p>
        <p>
          Guyton's framing is a didactic one, and its causality has been debated, since <M t="P_{RA}" /> and venous return are determined
          simultaneously rather than one causing the other <Cite r={[R4.magder2016, R4.henderson2010]} />. The model sidesteps the debate
          by computing both from the same equations; the venous return curve it draws is a description of the circuit, not an assertion
          about which variable is independent.
        </p>
      </>
    ),
  },
  {
    id: 's3', num: '4.3', title: 'The cardiac function curve and the operating point',
    body: (
      <>
        <p>
          The heart has its own relation between filling and output, the <Term>cardiac function curve</Term>, which is the Frank-Starling
          mechanism of Lesson 2 plotted against right atrial pressure rather than left atrial pressure: output rises steeply as filling
          rises, then plateaus. Plotted on the same axes as the venous return curve, the two describe the same two variables, cardiac
          output and right atrial pressure, from opposite points of view, the heart and the circulation.
        </p>
        <p>
          In the steady state the heart cannot eject more than the veins deliver, nor the veins deliver more than the heart ejects, so
          cardiac output must equal venous return:
        </p>
        <Eq n="4.3" t={String.raw`\mathrm{CO}=\mathrm{VR}`} />
        <p>
          The circulation can therefore operate only where the two curves cross (Figure 4.1). At the model's baseline that intersection
          sits at a right atrial pressure of about 4 mmHg and an output of about 5.3 L·min⁻¹. This single diagram is the resolution of a
          question Lesson 2 left open: a stronger pump alone raises output only a little, because steepening the cardiac function curve
          moves the intersection up a nearly flat venous return curve. The circulation is filled by the veins, and <Term>the heart can
          pump only what it receives</Term> <Cite r={R4.berlin2015} />.
        </p>
        <FigureGuyton />
        <Box n="4.1" kind="Clinical correlate · Why the CVP disappoints">
          <p>
            A central venous pressure is a single point on this diagram, the x-coordinate of the operating point, and the same value can
            arise from opposite situations. A CVP of 10 mmHg can mean an overfilled circulation on a normal heart or a normal circulation
            on a failing heart, and the response to a fluid bolus differs completely between them. Systematic reviews have repeatedly
            found that the central venous pressure does not predict who will respond to fluid <Cite r={[R4.marik2008, R4.berlin2015]} />.
            The diagram shows why: responsiveness depends on the slope of the cardiac function curve at the operating point, which a single
            pressure cannot reveal.
          </p>
        </Box>
      </>
    ),
  },
  {
    id: 's4', num: '4.4', title: 'Moving the curves',
    body: (
      <>
        <p>
          Every hemodynamic intervention moves one curve or the other, and the operating point follows to the new intersection. Four
          cases cover most of the bedside (follow them in Figure 4.1).
        </p>
        <p>
          <strong>Volume.</strong> A fluid bolus raises stressed volume and therefore <M t="P_{msf}" />, shifting the whole venous return
          curve to the right. In the model, 1,000 mL raises <M t="P_{msf}" /> from about 8 to about 13 mmHg and moves the operating point
          up the cardiac function curve from 5.3 to about 6.7 L·min⁻¹, at a higher right atrial pressure. Hemorrhage does the reverse:
          losing 1,000 mL drops <M t="P_{msf}" /> to about 3 mmHg and output to about 2.2 L·min⁻¹.
        </p>
        <p>
          <strong>Venous tone.</strong> Venoconstriction recruits unstressed volume and raises <M t="P_{msf}" /> without any transfusion,
          shifting the venous return curve right just as a bolus does; in the model, recruiting about 700 mL raises output to roughly 6.3
          L·min⁻¹. This is a large part of how a vasopressor raises cardiac output, and why the distinction between arterial and venous
          effects matters in Lesson 5.
        </p>
        <p>
          <strong>Contractility.</strong> A positive inotrope raises the cardiac function curve, and a failing ventricle lowers it. The
          failing heart is the instructive case: lowering contractility moves the operating point to a higher right atrial pressure and a
          lower output, which is the mechanism of the systemic congestion and low output of heart failure. Because the venous return
          curve is nearly flat near its intersection, inotropy alone buys only a modest rise in output unless venous return is also
          supported.
        </p>
        <Box n="4.2" kind="Clinical correlate · The passive leg raise">
          <p>
            Raising a supine patient's legs translocates roughly 300 mL of venous blood from the legs toward the thorax, a reversible,
            self-limited volume challenge that transiently shifts the venous return curve to the right. If the ventricle is on the steep
            limb of its function curve, cardiac output rises within a minute and the patient is a fluid responder; if it is on the plateau,
            output does not change. The maneuver is a bedside enactment of Figure 4.1 and, unlike a bolus, it is undone by lowering the
            legs <Cite r={R4.monnet2016} />.
          </p>
        </Box>
      </>
    ),
  },
  {
    id: 's5', num: '4.5', title: 'Heart-lung interaction and transmural pressure',
    body: (
      <>
        <p>
          The heart and great veins sit inside the thorax and are exposed to pleural pressure, so breathing modulates venous return.
          What distends any chamber is not its intravascular pressure but its <Term>transmural pressure</Term>, the pressure inside minus
          the pleural pressure surrounding it:
        </p>
        <Eq n="4.4" t={String.raw`P_{tm}=P_{\text{intracavitary}}-P_{pl}`} />
        <p>
          During a spontaneous breath, pleural pressure falls, right atrial transmural pressure rises, and venous return briefly
          increases. Positive-pressure ventilation inverts this. Each mechanical breath raises pleural pressure, which raises right
          atrial pressure, narrows the <M t="P_{msf}-P_{RA}" /> gradient, and transiently reduces venous return and hence left ventricular
          stroke volume a few beats later <Cite r={R4.pinsky2018} />. The arterial pressure therefore swings in time with the ventilator,
          the phenomenon Figure 4.2 displays.
        </p>
        <p>
          Transmural pressure also explains a recurring bedside trap. Positive end-expiratory pressure raises the measured central venous
          and pulmonary occlusion pressures by raising the pressure around the heart, while the distending pressure that actually sets
          preload may be unchanged or lower. A rising filling pressure on the monitor can thus accompany a falling preload, which is one
          more reason a pressure is a poor surrogate for volume (Lesson 2).
        </p>
      </>
    ),
  },
  {
    id: 's6', num: '4.6', title: 'Dynamic predictors of fluid responsiveness',
    body: (
      <>
        <p>
          Heart-lung interaction turns a liability into a test. Under controlled mechanical ventilation, the cyclic change in preload
          imposed by each breath produces a cyclic change in stroke volume whose size depends on where the ventricle sits on its function
          curve. On the steep ascending limb, the respiratory swing in preload produces a large swing in stroke volume, and a fluid bolus
          will raise output; on the plateau, the same preload swing produces little stroke-volume variation, and fluid will not help. The
          variation is quantified as the <Term>pulse pressure variation</Term> or stroke volume variation across a respiratory cycle:
        </p>
        <Eq n="4.5" t={String.raw`\mathrm{PPV}=\frac{\mathrm{PP}_{\max}-\mathrm{PP}_{\min}}{\overline{\mathrm{PP}}}`} />
        <p>
          A pulse pressure variation above about 13 percent predicts fluid responsiveness, with good overall accuracy in the populations
          where it has been validated <Cite r={[R4.michard2002, R4.marik2009]} />. In Figure 4.2 the model reproduces the relationship: a
          hypovolemic state shows a pulse pressure variation near 30 percent and gains more than half its stroke volume with a bolus, a
          euvolemic state sits near the 13 percent threshold, and an overfilled state shows a variation of only a few percent and barely
          responds to fluid.
        </p>
        <FigureFluidResponse />
        <p>
          The method is powerful but conditional, and its assumptions are often broken at the bedside. It requires a passive patient on a
          controlled mode with an adequate tidal volume and a regular rhythm. Spontaneous breathing efforts, cardiac arrhythmia, low
          tidal volume ventilation, an open chest, very high respiratory rates, and right ventricular failure all invalidate it, and
          measured values near the threshold fall in a <Term>gray zone</Term> where the test is inconclusive <Cite r={[R4.cannesson2011, R4.monnet2016]} />.
          A dynamic index predicts the response to a fluid bolus; it does not establish that the patient needs one, which remains a
          judgment about perfusion.
        </p>
      </>
    ),
  },
]

const keyPoints = [
  <>The veins hold about two thirds of the blood volume; only the stressed volume generates pressure, and mean systemic filling pressure is stressed volume divided by total vascular compliance.</>,
  <>Venous return is <M t={String.raw`(P_{msf}-P_{RA})/R_{VR}`} />. Right atrial pressure is the back-pressure to return, so the venous return curve falls as it rises and plateaus when the great veins collapse.</>,
  <>Cardiac output equals venous return in the steady state, so the circulation operates at the single intersection of the venous return and cardiac function curves.</>,
  <>Volume and venous tone shift the venous return curve; contractility and afterload move the cardiac function curve. A single filling pressure cannot predict the response to fluid.</>,
  <>Transmural pressure, not measured filling pressure, distends the heart; PEEP can raise the measured pressure while lowering the distending pressure.</>,
  <>Under controlled ventilation, a pulse pressure variation above about 13 percent predicts fluid responsiveness, but only when its assumptions hold.</>,
]

const questions: QuestionData[] = [
  {
    id: 'l4-pmsf',
    stem: <>A norepinephrine infusion is started in a patient with distributive shock, and cardiac output rises even though the dose is below that needed to change arteriolar resistance much. What is the most likely mechanism?</>,
    options: [
      <>Venoconstriction recruits unstressed volume, raising mean systemic filling pressure and venous return.</>,
      <>The drug directly increases the resistance to venous return, which raises flow.</>,
      <>Raising right atrial pressure increases the gradient for venous return.</>,
      <>Arterial vasoconstriction increases cardiac output by raising afterload.</>,
    ],
    answer: 0,
    rationale: (
      <>α-mediated venoconstriction converts unstressed to stressed volume, raising <M t="P_{msf}" /> and shifting the venous return curve to the right, so the operating point climbs the cardiac function curve to a higher output (Section 4.4). B is backward: raising <M t="R_{VR}" /> would lower venous return. C is backward: a higher <M t="P_{RA}" /> narrows the <M t="P_{msf}-P_{RA}" /> gradient. D raises afterload, which tends to lower stroke volume, not raise output.</>
    ),
  },
  {
    id: 'l4-operating',
    stem: <>On a Guyton diagram, a positive inotrope is given with no change in blood volume or venous tone. Which change in the operating point is expected?</>,
    options: [
      <>Cardiac output rises and right atrial pressure rises, as the operating point moves up the venous return curve.</>,
      <>Cardiac output rises and right atrial pressure falls, as the cardiac function curve steepens.</>,
      <>Cardiac output and right atrial pressure both fall.</>,
      <>Neither changes, because output is set by venous return alone.</>,
    ],
    answer: 1,
    rationale: (
      <>A steeper cardiac function curve intersects the unchanged venous return curve higher and to the left: output rises and right atrial pressure falls, because a stronger heart empties the atrium more completely. A has the direction of <M t="P_{RA}" /> wrong. C describes a failing heart. D ignores that the heart curve sets the intersection jointly with the venous return curve; the gain is modest because the venous return curve is flat there, but it is not zero.</>
    ),
  },
  {
    id: 'l4-peep',
    stem: <>PEEP is increased from 5 to 15 cmH₂O in a ventilated patient. The central venous pressure rises from 8 to 13 mmHg. What is the most accurate interpretation?</>,
    options: [
      <>The patient is now volume overloaded, because the filling pressure has risen.</>,
      <>Right ventricular transmural pressure has risen by 5 mmHg, increasing preload.</>,
      <>The measured pressure rose because pleural pressure rose; the transmural (distending) pressure may be unchanged or lower.</>,
      <>Venous return has increased, because right atrial pressure is higher.</>,
    ],
    answer: 2,
    rationale: (
      <>PEEP raises pleural pressure, which raises the measured intravascular pressure without necessarily raising transmural pressure, the quantity that distends the chamber (Eq. 4.4). A and B mistake the measured pressure for the distending pressure. D is backward: a higher right atrial pressure narrows the venous return gradient, so PEEP tends to reduce venous return.</>
    ),
  },
  {
    id: 'l4-ppv',
    stem: <>A deeply sedated patient on volume-controlled ventilation with a tidal volume of 8 mL·kg⁻¹ and sinus rhythm has a pulse pressure variation of 22 percent and a mean arterial pressure of 58 mmHg. What does this predict?</>,
    options: [
      <>The patient will not respond to fluid, because the variation reflects the ventilator, not volume status.</>,
      <>A fluid bolus is likely to increase stroke volume, because the ventricle is on the steep part of its function curve.</>,
      <>The patient needs a vasopressor rather than fluid, because the mean pressure is low.</>,
      <>The measurement is invalid because any PPV above 15 percent is an artifact.</>,
    ],
    answer: 1,
    rationale: (
      <>With the assumptions met (passive, controlled ventilation, adequate tidal volume, regular rhythm), a PPV of 22 percent is well above the ~13 percent threshold and predicts that a bolus will raise stroke volume (Section 4.6). A misstates the mechanism. C may be a reasonable clinical choice, but the question asks what the PPV predicts, which is fluid responsiveness; responsiveness is not the same as need. D invents a cutoff; high PPV is the expected finding on the steep limb.</>
    ),
  },
  {
    id: 'l4-grayzone',
    stem: <>In which patient is pulse pressure variation a reliable predictor of fluid responsiveness?</>,
    options: [
      <>A patient breathing spontaneously on pressure support.</>,
      <>A patient in atrial fibrillation with a rapid ventricular response.</>,
      <>A passive, sedated patient on controlled ventilation at 8 mL·kg⁻¹ in sinus rhythm.</>,
      <>A patient ventilated at 4 mL·kg⁻¹ for acute respiratory distress syndrome.</>,
    ],
    answer: 2,
    rationale: (
      <>Pulse pressure variation is valid only under controlled ventilation with an adequate tidal volume, a regular rhythm, and no spontaneous effort. C meets all of these. A fails because spontaneous efforts make the respiratory preload change irregular; B fails because beat-to-beat stroke volume already varies with the arrhythmia; D fails because a low tidal volume produces too small a preload swing to be discriminating <Cite r={R4.cannesson2011} />.</>
    ),
  },
]

export default function Lesson4() {
  return (
    <LessonPage
      meta={META}
      objectives={objectives}
      notation={notation}
      sections={sections}
      keyPoints={keyPoints}
      questions={questions}
      refs={L4_REFS}
    />
  )
}
