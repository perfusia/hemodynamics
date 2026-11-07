import { LessonPage, type LessonSection, type NotationRow } from '../../ui/Lesson'
import { LESSONS } from '../registry'
import { Eq, M } from '../../ui/Math'
import { Box, Note, Term } from '../../ui/Prose'
import { Cite } from '../../ui/Cite'
import type { QuestionData } from '../../ui/Question'
import { R2, L2_REFS } from './refs'
import { FigureCoupling, FigureCurves, FigureCycle } from './figures'

const META = LESSONS[1]

const objectives = [
  <>Construct the left ventricular pressure-volume loop and locate end-diastole, end-systole, stroke volume, stroke work, and the four phases of the cycle on it.</>,
  <>Define contractility as end-systolic elastance and explain why ejection fraction is a load-dependent index rather than a measure of contractility.</>,
  <>Describe preload with the end-diastolic pressure-volume relation and explain why a filling pressure misrepresents volume when ventricular compliance changes.</>,
  <>Quantify afterload with effective arterial elastance and derive stroke volume from the coupling of the ventricle to its load.</>,
  <>Explain the Frank-Starling mechanism at the level of the sarcomere and predict the effect of tachycardia on filling, stroke volume, and cardiac output.</>,
]

const notation: NotationRow[] = [
  { sym: String.raw`\mathrm{CO}`, def: 'cardiac output', unit: 'L·min⁻¹' },
  { sym: String.raw`\mathrm{HR}`, def: 'heart rate', unit: 'min⁻¹' },
  { sym: String.raw`\mathrm{SV}`, def: <>stroke volume, <M t={String.raw`\mathrm{EDV}-\mathrm{ESV}`} /></>, unit: 'mL' },
  { sym: String.raw`\mathrm{EDV},\ \mathrm{ESV}`, def: 'end-diastolic, end-systolic volume', unit: 'mL' },
  { sym: String.raw`\mathrm{EF}`, def: <>ejection fraction, <M t={String.raw`\mathrm{SV}/\mathrm{EDV}`} /></>, unit: 'ratio' },
  { sym: String.raw`P_{es},\ \mathrm{EDP}`, def: 'end-systolic, end-diastolic pressure', unit: 'mmHg' },
  { sym: String.raw`E(t)`, def: 'time-varying elastance', unit: 'mmHg·mL⁻¹' },
  { sym: String.raw`E_{es}`, def: 'end-systolic elastance, slope of the ESPVR', unit: 'mmHg·mL⁻¹' },
  { sym: String.raw`V_0`, def: 'volume intercept of the ESPVR', unit: 'mL' },
  { sym: String.raw`E_a`, def: <>effective arterial elastance, <M t={String.raw`P_{es}/\mathrm{SV}`} /></>, unit: 'mmHg·mL⁻¹' },
  { sym: String.raw`A,\ B`, def: 'EDPVR scale and stiffness coefficients', unit: 'mmHg, mL⁻¹' },
  { sym: String.raw`T`, def: <>cardiac cycle length, <M t={String.raw`60/\mathrm{HR}`} /></>, unit: 's' },
  { sym: String.raw`\sigma`, def: 'wall stress', unit: 'mmHg' },
]

const sections: LessonSection[] = [
  {
    id: 's1', num: '2.1', title: 'Cardiac output as the product of rate and stroke volume',
    body: (
      <>
        <p>
          Lesson 1 treated cardiac output as a single quantity. It is the product of two. Heart rate sets how many contractions occur
          in a minute; stroke volume, the volume ejected by one contraction, is the difference between the volume of the ventricle at
          the end of filling and the volume that remains when ejection ends. Ejection fraction normalizes stroke volume to the filled
          volume.
        </p>
        <Eq n="2.1" t={String.raw`\mathrm{CO}=\mathrm{HR}\cdot\mathrm{SV}`} />
        <Eq n="2.2" t={String.raw`\mathrm{SV}=\mathrm{EDV}-\mathrm{ESV},\qquad \mathrm{EF}=\frac{\mathrm{SV}}{\mathrm{EDV}}`} />
        <p>
          In a healthy adult at rest these are of the order of 70 mL for stroke volume, 120 mL for end-diastolic volume, 50 mL for
          end-systolic volume, and 0.6 for ejection fraction; the echocardiographic reference limits for end-diastolic volume are wider
          and differ by sex <Cite r={R2.lang2015} />.
          <Note>With HR in min⁻¹ and SV in mL, <M t={String.raw`\mathrm{CO}=\mathrm{HR}\cdot\mathrm{SV}/1000`} /> gives L·min⁻¹. At 72 min⁻¹ and 73 mL, the closed-loop baseline of the model, CO is 5.3 L·min⁻¹.</Note>{' '}
          The two factors in Equation 2.1 are not independent. Rate determines how long the ventricle has to fill, and filling is one
          of the determinants of stroke volume, so cardiac output cannot be raised indefinitely by raising either term (Section 2.7).
        </p>
        <p>
          The rest of this lesson builds the framework in which stroke volume follows from three properties of the system: how full
          the ventricle is at the end of diastole (<Term>preload</Term>), how stiff it becomes at the end of systole (<Term>contractility</Term>),
          and how the arterial tree opposes ejection (<Term>afterload</Term>). The framework is the pressure-volume plane, and it is the
          language in which cardiac anesthesia and critical care reason about a ventricle under load <Cite r={[R2.sagawa1978, R2.walley2016]} />.
        </p>
      </>
    ),
  },
  {
    id: 's2', num: '2.2', title: 'The pressure-volume loop',
    body: (
      <>
        <p>
          Plotting left ventricular pressure against left ventricular volume over one beat produces a closed loop whose corners are
          the valve events (Figure 2.1). Begin at end-diastole, the lower right corner. The mitral valve has just closed, and the
          ventricle contracts with both valves shut: pressure rises at constant volume, the phase of <Term>isovolumic contraction</Term>,
          until it exceeds aortic pressure and the aortic valve opens. <Term>Ejection</Term> follows; volume falls while pressure first rises
          and then declines with the aortic pressure. When the ventricle begins to relax and its pressure falls below aortic pressure,
          the aortic valve closes. That instant, the upper left corner, is <Term>end-systole</Term>. Pressure then falls at constant volume
          during <Term>isovolumic relaxation</Term> until it drops below left atrial pressure, the mitral valve opens, and <Term>filling</Term>{' '}
          carries the loop along its lower border back to end-diastole.
        </p>
        <p>
          The width of the loop is stroke volume. Its area is the external work done on the blood in one beat, the{' '}
          <Term>stroke work</Term>:
        </p>
        <Eq n="2.3" t={String.raw`\mathrm{SW}=\oint P\,dV`} />
        <p>
          For the isolated ventricle in Figures 2.1 and 2.2, stroke work is about 7,900 mmHg·mL, roughly 1.05 J per beat.
          <Note>One mmHg·mL is 1.333 × 10⁻⁴ J. The figure readouts give stroke work in mmHg·mL, the unit in which the loop is drawn.</Note>{' '}
          Stroke work is not the whole energetic cost of a beat. Suga showed that myocardial oxygen consumption per beat is linearly
          related to the <Term>pressure-volume area</Term>, the stroke work plus the elastic potential energy stored in the ventricle at
          end-systole, the triangle bounded by the ESPVR, the EDPVR, and the left border of the loop <Cite r={R2.suga1990} />. Anything that
          lowers end-systolic pressure or end-systolic volume therefore lowers oxygen demand, which is one reason afterload reduction
          relieves ischemia.
        </p>
        <FigureCycle />
        <p>
          Set Figure 2.1 to quarter speed and follow the moving point. The aortic valve opens only when left ventricular pressure
          crosses aortic pressure, about 65 mmHg in this model, so a large part of the pressure the ventricle generates is spent
          before any blood moves. The mitral valve opens only when ventricular pressure falls below left atrial pressure, so the
          rate of relaxation, not only its completeness, determines when filling can begin.
        </p>
      </>
    ),
  },
  {
    id: 's3', num: '2.3', title: 'Contractility: end-systolic elastance',
    body: (
      <>
        <p>
          <Term>Contractility</Term>, or inotropic state, is the intrinsic capacity of the myocardium to develop force and shorten,
          independent of the loads imposed on it. Before the pressure-volume framework there was no single index that satisfied that
          definition. Suga, Sagawa, and Shoukas supplied one by treating the ventricle as an elastic chamber whose stiffness changes
          with time <Cite r={R2.suga1973} />. They defined the time-varying elastance as the ratio of pressure to volume above a dead volume <M t="V_0" />:
        </p>
        <Eq n="2.4" t={String.raw`E(t)=\frac{P(t)}{V(t)-V_0}`} />
        <p>
          In excised, supported canine ventricles, elastance rose through systole to a maximum that was nearly independent of preload
          and afterload but increased with epinephrine <Cite r={[R2.suga1973, R2.suga1974]} />. Plotted across beats of different load,
          the end-systolic points therefore fall on one line, the <Term>end-systolic pressure-volume relation</Term> (ESPVR), whose slope is
          the end-systolic elastance <M t="E_{es}" />:
        </p>
        <Eq n="2.5" t={String.raw`P_{es}=E_{es}\,(\mathrm{ESV}-V_0)`} />
        <p>
          A steeper ESPVR means that at any end-systolic pressure the ventricle empties to a smaller volume. The cellular basis is the
          size of the systolic calcium transient and the sensitivity of the myofilaments to it. β<sub>1</sub>-adrenergic stimulation
          acts through G<sub>s</sub>, adenylyl cyclase, cyclic AMP and protein kinase A, which phosphorylates L-type calcium channels,
          ryanodine receptors, and phospholamban; the result is a larger trigger influx, a larger release from the sarcoplasmic
          reticulum, faster reuptake by SERCA2a, and more cross-bridges recruited per beat <Cite r={R2.bers2002} />. Acidosis, hypoxia,
          ischemia, β-blockade, volatile anesthetics, and the loss of viable myocardium after infarction flatten the ESPVR.
        </p>
        <p>
          The HemoLab model represents each ventricle in exactly these terms. Ventricular pressure is a weighted sum of the ESPVR and
          the end-diastolic relation of Section 2.4, weighted by an activation function <M t="e(t)" /> that rises from 0 to 1 during
          systole and returns to 0 in diastole:
        </p>
        <Eq n="2.6" t={String.raw`P(V,t)=e(t)\,E_{es}\,(V-V_0)+\bigl[1-e(t)\bigr]\,A\left(e^{B(V-V_0)}-1\right)`} />
        <p>
          A positive inotrope in the model is a larger <M t="E_{es}" /> and nothing else. In Figure 2.2, the Inotropy preset raises
          <M t="E_{es}" /> from 2.6 to 4.2 mmHg·mL⁻¹ at unchanged preload and resistance: end-systolic volume falls from 47 to 36 mL,
          stroke volume rises from 79 to 90 mL, and ejection fraction from 62 to 72 percent.
        </p>
        <p>
          Ejection fraction, the most widely reported index of systolic function, is not itself a measure of contractility. It
          depends on afterload (Section 2.5) and on the route of ejection. In mitral regurgitation part of each stroke volume leaves
          backward into the low-pressure left atrium, which can preserve the ejection fraction while forward output falls. A normal
          ejection fraction can therefore coexist with a depressed <M t="E_{es}" />, and a low one can reflect an excessive load on a
          normal ventricle.
          <Note>Measuring <M t="E_{es}" /> requires several loops at different loads, usually obtained by transient occlusion of the inferior vena cava with a conductance catheter in place <Cite r={R2.burkhoff2005} />; this is why it remains a research and cardiac surgical tool.</Note>
        </p>
      </>
    ),
  },
  {
    id: 's4', num: '2.4', title: 'Preload: the end-diastolic pressure-volume relation',
    body: (
      <>
        <p>
          <Term>Preload</Term> is the load on the myocardium before it contracts. Physiologically it is sarcomere length at end-diastole;
          mechanically it is end-diastolic wall stress; clinically its best surrogate is end-diastolic volume. The relation between
          end-diastolic pressure and volume, the <Term>EDPVR</Term>, is curvilinear and is well described by an exponential:
        </p>
        <Eq n="2.7" t={String.raw`\mathrm{EDP}=A\left(e^{B(\mathrm{EDV}-V_0)}-1\right),\qquad C_d=\frac{d\,\mathrm{EDV}}{d\,\mathrm{EDP}}=\frac{1}{B\,(\mathrm{EDP}+A)}`} />
        <p>
          Over the physiological range a compliant ventricle accepts volume with little rise in pressure. At larger volumes the
          relation steepens as the collagen matrix and the elastic sarcomeric protein titin bear more of the load, and the pericardium
          adds an external constraint <Cite r={R2.burkhoff2005} />. Diastolic compliance <M t="C_d" />, the reciprocal of the slope, therefore
          falls as pressure rises: in the model's baseline ventricle it is about 4.0 mL·mmHg⁻¹ at an end-diastolic pressure of 8 mmHg
          and 1.6 mL·mmHg⁻¹ at 20 mmHg.
        </p>
        <p>
          The clinical consequence is that a filling pressure is an indirect and conditional estimate of preload. A pulmonary artery
          occlusion pressure of 18 mmHg describes a dilated ventricle if the EDPVR is normal and possibly a normal-sized one if the
          ventricle is hypertrophied, ischemic, or externally constrained by tamponade or high airway pressure. What distends the
          ventricle is its <Term>transmural pressure</Term>, intracavitary pressure minus the pericardial or pleural pressure around it.
          Positive-pressure ventilation and PEEP raise the measured filling pressure without raising, and sometimes while lowering, the
          distending pressure (Lesson 4).
        </p>
        <p>
          Preload and afterload are, in the end, two moments of one variable: wall stress. For a thin-walled sphere, Laplace's law
          gives
        </p>
        <Eq n="2.8" t={String.raw`\sigma=\frac{P\,r}{2h}`} />
        <p>
          where <M t="r" /> is the cavity radius and <M t="h" /> the wall thickness. Stress rises with pressure and radius and falls with
          wall thickness. Concentric hypertrophy, the response to chronic pressure overload in aortic stenosis or hypertension,
          normalizes systolic wall stress by thickening the wall, and pays for it with a steeper EDPVR and slower relaxation
          <Cite r={R2.hall2025} />. Dilation does the opposite: a larger radius raises the stress needed to generate the same pressure,
          which is part of why the dilated failing ventricle consumes more oxygen for less output.
        </p>
      </>
    ),
  },
  {
    id: 's5', num: '2.5', title: 'Afterload and ventricular-arterial coupling',
    body: (
      <>
        <p>
          <Term>Afterload</Term> is, strictly, the wall stress the myocardium must develop during ejection. That definition is exact but
          difficult to measure, so a lumped index is used instead. The end-systolic point of the loop must satisfy two relations at
          once. It lies on the ESPVR, which describes the ventricle (Eq. 2.5), and it lies on a line that describes the arterial load,
          whose slope is the <Term>effective arterial elastance</Term> <M t="E_a" />. Sunagawa and colleagues showed in the isolated canine
          ventricle that <M t="E_a" />, the ratio of end-systolic pressure to stroke volume, behaves as a property of the arterial tree
          determined chiefly by peripheral resistance and heart rate <Cite r={R2.sunagawa1983} />.
          <Note><M t="E_a" /> is a lumped index rather than a physical elastance. It folds resistance, compliance, and cycle timing into one number; the approximation <M t={String.raw`E_a\approx R/T`} /> holds when the arterial time constant is long relative to diastole <Cite r={R2.kelly1992} />.</Note>
        </p>
        <Eq n="2.9" t={String.raw`P_{es}=E_a\cdot\mathrm{SV},\qquad E_a\approx\frac{R}{T}`} />
        <p>
          Substituting <M t={String.raw`\mathrm{ESV}=\mathrm{EDV}-\mathrm{SV}`} /> into Equation 2.5 and solving the pair gives stroke volume in
          terms of the ventricle, the load, and the filling volume:
        </p>
        <Eq ruled n="2.10" t={String.raw`\mathrm{SV}=\frac{E_{es}\,(\mathrm{EDV}-V_0)}{E_{es}+E_a}`} />
        <p>
          Equation 2.10 is the quantitative core of this lesson. Stroke volume rises in proportion to filling volume above <M t="V_0" />,
          rises with contractility, and falls with arterial load. Dividing by <M t="\mathrm{EDV}" /> shows why ejection fraction moves with
          the load as well as with the ventricle:
        </p>
        <Eq n="2.11" t={String.raw`\mathrm{EF}\approx\frac{E_{es}}{E_{es}+E_a}\qquad(V_0\ll\mathrm{EDV})`} />
        <p>
          The ratio <M t="E_a/E_{es}" />, the <Term>ventricular-arterial coupling ratio</Term>, summarizes the match between heart and
          vasculature. Stroke work is maximal when <M t="E_a=E_{es}" />, and mechanical efficiency is maximal when <M t="E_a" /> is about
          half of <M t="E_{es}" /> <Cite r={R2.burkhoff1986} />; in healthy adults at rest the ratio is usually about 0.6 to 1.0 <Cite r={R2.chantler2008} />,
          and the model's baseline of 0.47 sits at the lower, efficiency-favoring end, reflecting a ventricle modestly over-contractile
          for its load. The equation also explains an observation that is otherwise difficult to rationalize: the
          failing ventricle is <Term>afterload-sensitive</Term>. When <M t="E_{es}" /> is low, <M t="E_a" /> dominates the denominator, and a
          given reduction in arterial load returns a proportionally larger gain in stroke volume.
          <Note>This is the mechanical basis for afterload reduction in low-output states with a dilated ventricle, whether by vasodilator, inodilator, or intra-aortic balloon counterpulsation (Lesson 5).</Note>
        </p>
        <FigureCoupling />
        <p>
          The final readout of Figure 2.2 compares the numerical model with Equation 2.10. At baseline, <M t={String.raw`E_a\approx R/T`} />{' '}
          gives 1.02 mmHg·mL⁻¹, the model's measured <M t={String.raw`P_{es}/\mathrm{SV}`} /> is 1.21, and the predicted stroke volume
          (83 mL) is within about 6 percent of the simulated value (79 mL). The residual is the arterial compliance, which the{' '}
          <M t="R/T" /> approximation neglects. That an algebraic relation derived on a whiteboard and a beat-by-beat numerical solution
          agree this closely is the strongest argument for teaching the heart in these terms.
        </p>
        <Box n="2.1" kind="Clinical correlate · Cardiac surgical ICU">
          <p>
            After cardiopulmonary bypass, a ventricle with depressed contractility often meets a high and labile arterial load from
            hypothermia, exogenous catecholamines, and emergence. Equation 2.10 predicts that lowering <M t="E_a" /> in this ventricle
            returns more stroke volume than the same reduction would in a normal heart. In Figure 2.2, choose HFrEF, then HFrEF,
            unloaded: halving the resistance raises stroke volume by about 40 percent in the failing ventricle, against about 20
            percent for the same change in a normal one, and mean arterial pressure falls by 28 percent, less than the 50 percent fall
            in resistance alone would produce. The limit is perfusion pressure. The coronary and cerebral circulations still require an
            adequate mean pressure, which is why afterload reduction in a low-output state is titrated against an arterial line.
          </p>
        </Box>
      </>
    ),
  },
  {
    id: 's6', num: '2.6', title: 'The Frank-Starling mechanism',
    body: (
      <>
        <p>
          Patterson and Starling showed in 1914, in the isolated canine heart-lung preparation, that the output of the ventricle is
          determined by its filling: within limits, a ventricle filled to a larger volume ejects a larger stroke volume <Cite r={R2.patterson1914} />.
          The mechanism matches the output of the two ventricles to each other and to venous return beat by beat, with no neural
          input. Its basis is <Term>length-dependent activation</Term>. Stretching a cardiomyocyte along the ascending limb of its
          length-tension relation increases the calcium sensitivity of the myofilaments, so that more force develops at the same
          cytosolic calcium; reduced spacing between thick and thin filaments and strain on titin both contribute <Cite r={R2.detombe2010} />.
        </p>
        <p>
          The ventricular function curve expresses the mechanism in clinical terms, stroke volume against filling pressure (Figure 2.3A),
          and its shape follows from two equations already derived. Stroke volume is linear in end-diastolic volume (Eq. 2.10), but
          end-diastolic volume is a logarithmic function of end-diastolic pressure (Eq. 2.7). The curve is therefore steep at low
          filling pressures and flat at high ones. In the baseline ventricle, 1 mmHg of added left atrial pressure buys 4.5 mL of stroke
          volume near 4 mmHg and 1.1 mL near 20 mmHg. Contractility scales the whole curve: a depressed ventricle sits on a lower and
          flatter curve, where added volume raises filling pressure, and with it pulmonary capillary hydrostatic pressure, while adding
          little output.
        </p>
        <p>
          Isolated preparations at extreme filling show a descending limb, a fall in stroke volume with further stretch. In the intact
          circulation the curve flattens rather than falls, because the pericardium and the steepening EDPVR limit distension before
          sarcomeres are overstretched <Cite r={R2.berlin2015} />. The model accordingly has no descending limb.
        </p>
        <FigureCurves />
        <p>
          The curve answers the question Lesson 4 develops in full: whether a fluid bolus will increase stroke volume depends on where
          the ventricle operates on its function curve. The filling pressure alone does not answer it, because the same pressure can
          sit on the steep part of one curve and the flat part of another.
        </p>
      </>
    ),
  },
  {
    id: 's7', num: '2.7', title: 'Heart rate and diastolic filling',
    body: (
      <>
        <p>
          Heart rate enters cardiac output twice: directly, as the multiplier in Equation 2.1, and indirectly through the duration of
          diastole. Systole shortens less than diastole as rate rises. In the model, the interval in which the ventricle is fully
          relaxed is 375 ms of an 833 ms cycle at 72 min⁻¹ (45 percent) and 82 ms of a 400 ms cycle at 150 min⁻¹ (21 percent). At first
          the loss costs little, because most filling occurs in the rapid early phase of diastole. Beyond a critical rate, filling is
          truncated, end-diastolic volume falls, and stroke volume falls faster than rate rises (Figure 2.3B). With normal relaxation
          the model's isolated ventricle reaches its peak output near 150 min⁻¹; with slowed relaxation and a stiffer chamber the peak
          falls to near 100 min⁻¹ and is a third lower.
        </p>
        <p>
          Two other rate effects matter clinically. The first is the <Term>force-frequency relation</Term>, the positive staircase or
          Bowditch effect: in healthy myocardium contractility increases with rate as intracellular calcium loading rises, while failing
          myocardium loses or reverses the relation. The model omits it, so that Figure 2.3B isolates the effect of filling time. The
          second is contained in Equation 2.9. Because <M t={String.raw`E_a\approx R/T`} />, arterial elastance rises with heart rate, and a
          faster heart ejects into a stiffer effective load even at unchanged vascular resistance.
        </p>
        <p>
          In the closed circulation a further limit appears. Pacing the model from 72 to 130 min⁻¹ with no change in vascular properties
          raises cardiac output by only about 15 percent, because a faster pump cannot increase the venous return that fills it. That
          limit belongs to the venous side of the circulation, and it is the subject of Lesson 4.
        </p>
        <Box n="2.2" kind="Clinical correlate · Operating room">
          <p>
            Severe aortic stenosis is the canonical rate-sensitive lesion. Concentric hypertrophy stiffens the EDPVR and slows
            relaxation, so filling depends on diastolic time and on atrial contraction, and the thickened, high-stress subendocardium is
            perfused almost entirely in diastole. Tachycardia therefore lowers stroke volume and coronary supply at the same time that it
            raises oxygen demand. The anesthetic goals that follow, sinus rhythm, a normal to slow rate, adequate preload, and a maintained
            systemic vascular resistance to protect coronary perfusion pressure, are a direct application of Sections 2.4 to 2.7{' '}
            <Cite r={R2.brown2005} />.
          </p>
        </Box>
      </>
    ),
  },
]

const keyPoints = [
  <>Cardiac output is the product of heart rate and stroke volume, and stroke volume is the width of the pressure-volume loop.</>,
  <>Contractility is best expressed as end-systolic elastance, the slope of the ESPVR, which is nearly independent of load. Ejection fraction is not: it depends on afterload and on the route of ejection.</>,
  <>The EDPVR is exponential. Diastolic compliance falls as filling pressure rises, so a pressure is a conditional estimate of volume.</>,
  <>Afterload in the pressure-volume plane is effective arterial elastance, <M t={String.raw`E_a\approx R/T`} />. Stroke volume follows from <M t={String.raw`\mathrm{SV}=E_{es}(\mathrm{EDV}-V_0)/(E_{es}+E_a)`} />.</>,
  <>The failing ventricle is afterload-sensitive because a low <M t="E_{es}" /> lets <M t="E_a" /> dominate the coupling equation.</>,
  <>The Frank-Starling curve is steep at low filling pressures and flat at high ones; where the ventricle sits on it, not the pressure itself, predicts the response to volume.</>,
  <>Tachycardia shortens diastole disproportionately and raises <M t="E_a" />; ventricles with impaired relaxation lose output at lower rates.</>,
]

const questions: QuestionData[] = [
  {
    id: 'l2-loop',
    stem: <>On a left ventricular pressure-volume loop, which event occurs at the upper left corner?</>,
    options: [
      <>Mitral valve closure, at end-diastole</>,
      <>Aortic valve opening, at the end of isovolumic contraction</>,
      <>Aortic valve closure, at end-systole</>,
      <>Mitral valve opening, at the end of isovolumic relaxation</>,
    ],
    answer: 2,
    rationale: (
      <>The upper left corner is the smallest volume at high pressure: ejection has ended and the aortic valve closes, which defines end-systole. Mitral closure (A) is the lower right corner, where contraction begins at the largest volume. Aortic opening (B) is the upper right corner, where isovolumic contraction ends. Mitral opening (D) is the lower left corner, where isovolumic relaxation ends and filling begins.</>
    ),
  },
  {
    id: 'l2-ino',
    stem: <>A β<sub>1</sub> agonist raises end-systolic elastance while preload and arterial elastance are held constant. Which change follows?</>,
    options: [
      <>End-systolic volume falls and stroke volume rises.</>,
      <>End-diastolic volume rises and stroke volume is unchanged.</>,
      <>End-systolic pressure falls because the ventricle empties more completely.</>,
      <>Ejection fraction is unchanged because preload is unchanged.</>,
    ],
    answer: 0,
    rationale: (
      <>A steeper ESPVR intersects the unchanged <M t="E_a" /> line at a smaller volume and a higher pressure, so ESV falls and SV rises (Eq. 2.10). B describes a preload change, which the stem excludes. C has the direction wrong: with a fixed <M t="E_a" /> line, a larger SV means a higher end-systolic pressure. D is incorrect because EF rises with <M t="E_{es}" /> even at constant preload (Eq. 2.11).</>
    ),
  },
  {
    id: 'l2-coupling',
    stem: <>A 68-year-old with ischemic cardiomyopathy (LVEF 25%) has a radial arterial pressure of 128/84 mmHg after induction. Clevidipine lowers arteriolar resistance by 30% with little effect on venous capacitance. Which change is most likely?</>,
    options: [
      <>Stroke volume falls because coronary perfusion pressure falls.</>,
      <>Stroke volume rises, and mean arterial pressure falls proportionally less than resistance.</>,
      <>Stroke volume is unchanged because contractility is unchanged.</>,
      <>Mean arterial pressure rises because cardiac output rises.</>,
    ],
    answer: 1,
    rationale: (
      <>With a low <M t="E_{es}" />, <M t="E_a" /> dominates the denominator of Equation 2.10, so lowering it raises stroke volume substantially; because cardiac output rises, MAP falls by less than 30 percent. A describes a late risk of profound hypotension, not the immediate mechanical effect. C ignores the load dependence of stroke volume. D would require cardiac output to rise by more than 43 percent, since MAP − CVP = CO · SVR and SVR has fallen to 0.7 of its value.</>
    ),
  },
  {
    id: 'l2-edpvr',
    stem: <>A patient with long-standing hypertension and concentric left ventricular hypertrophy has a pulmonary artery occlusion pressure of 18 mmHg. Which statement is most accurate?</>,
    options: [
      <>The left ventricle is dilated, because filling pressure is high.</>,
      <>The left ventricle may have a normal end-diastolic volume, because its EDPVR is steeper.</>,
      <>Further volume will raise stroke volume as much as it would in a normal ventricle at the same pressure.</>,
      <>The occlusion pressure overestimates left atrial pressure because hypertrophy raises pulmonary vascular resistance.</>,
    ],
    answer: 1,
    rationale: (
      <>A hypertrophied ventricle has a steeper, leftward-shifted EDPVR, so a high pressure can correspond to a normal volume (Eq. 2.7). A assumes a normal EDPVR. C is incorrect because at high pressure a stiff ventricle sits on the flat part of its function curve, where added volume buys little stroke volume. D confuses two different relations: the occlusion pressure estimates left atrial pressure through a static column of blood, and pulmonary vascular resistance does not enter that estimate.</>
    ),
  },
  {
    id: 'l2-rate',
    stem: <>In a patient with severe aortic stenosis, heart rate rises from 70 to 120 min⁻¹ during laryngoscopy. Which combination best describes the consequence?</>,
    options: [
      <>Stroke volume rises and coronary perfusion time is unchanged.</>,
      <>Stroke volume falls, myocardial oxygen demand rises, and diastolic coronary perfusion time falls.</>,
      <>Stroke volume is unchanged because the Frank-Starling mechanism compensates.</>,
      <>Cardiac output must rise because cardiac output is the product of rate and stroke volume.</>,
    ],
    answer: 1,
    rationale: (
      <>The hypertrophied ventricle relaxes slowly and depends on diastolic time to fill, so tachycardia truncates filling and stroke volume falls; demand rises with rate while the diastolic interval in which the subendocardium is perfused shortens. A ignores the loss of diastolic time. C is incorrect: the Frank-Starling mechanism responds to filling and cannot restore a volume that the shortened diastole never delivered. D treats the two factors of Equation 2.1 as independent, which Section 2.7 shows they are not.</>
    ),
  },
]

export default function Lesson2() {
  return (
    <LessonPage
      meta={META}
      objectives={objectives}
      notation={notation}
      sections={sections}
      keyPoints={keyPoints}
      questions={questions}
      refs={L2_REFS}
    />
  )
}
