/**
 * Parameter set for the HemoLab circulation model.
 *
 * Units throughout the model:
 *   volume       mL
 *   pressure     mmHg
 *   flow         mL·s⁻¹
 *   time         s
 *   resistance   mmHg·s·mL⁻¹   (1 mmHg·s·mL⁻¹ = 1333 dyn·s·cm⁻⁵ = 16.67 Wood units)
 *   compliance   mL·mmHg⁻¹
 *   elastance    mmHg·mL⁻¹
 *
 * Clinical units (L·min⁻¹, dyn·s·cm⁻⁵) are produced only at the reporting
 * layer (see metrics.ts), so the solver never mixes unit systems.
 */

/** A ventricle described by the time-varying elastance model. */
export interface Ventricle {
  /** End-systolic elastance, slope of the ESPVR (mmHg·mL⁻¹). */
  Ees: number
  /** Volume intercept of the ESPVR and EDPVR (mL). */
  V0: number
  /** EDPVR scaling coefficient (mmHg). */
  A: number
  /** EDPVR stiffness exponent (mL⁻¹). */
  B: number
}

export interface Ventilation {
  /** Controlled positive-pressure ventilation on or off. */
  on: boolean
  /** Respiratory rate (breaths·min⁻¹). */
  RR: number
  /** Inspiratory fraction of the respiratory cycle (I:E 1:2 gives 1/3). */
  Ti: number
  /** Tidal volume (mL·kg⁻¹ predicted body weight). */
  VT: number
  /**
   * Model assumption: rise in pleural pressure per mL·kg⁻¹ of tidal volume
   * (mmHg). With a normal chest wall roughly a quarter to a half of the
   * airway pressure swing reaches the pleural space.
   */
  pplPerVT: number
  /** End-expiratory pleural pressure (mmHg), raised by PEEP. */
  Ppl0: number
}

export interface Reflex {
  /** Overall gain multiplier: 1 intact, 0 absent. */
  gain: number
  /** Effector arms, each 0 to 1 (1 = arm fully available). */
  hrArm: number
  eesArm: number
  rsArm: number
  vuArm: number
  /** Arterial pressure set point (mmHg). */
  Pset: number
}

export interface Params {
  /** Intrinsic heart rate before reflex modulation (beats·min⁻¹). */
  HR: number
  lv: Ventricle
  rv: Ventricle
  /** Time to peak elastance at a cycle length of 0.857 s (HR 70), s. */
  tPeak: number
  /** Relaxation duration as a fraction of time to peak. */
  relaxFrac: number

  /** Systemic arterial compliance (mL·mmHg⁻¹). */
  Csa: number
  /** Systemic arterial unstressed volume (mL). */
  Vusa: number
  /** Aortic characteristic impedance (mmHg·s·mL⁻¹). */
  Zc: number
  /** Systemic arteriolar resistance (mmHg·s·mL⁻¹). */
  Rs: number

  /** Systemic venous compliance (mL·mmHg⁻¹). */
  Csv: number
  /** Systemic venous unstressed volume (mL). */
  Vusv: number
  /** Resistance from the venous reservoir to the right atrium (mmHg·s·mL⁻¹). */
  Rvr: number

  /** Right atrial compliance and unstressed volume. */
  Cra: number
  Vura: number

  /** Pulmonary arterial compliance, unstressed volume, impedance, resistance. */
  Cpa: number
  Vupa: number
  Zpa: number
  Rp: number

  /** Pulmonary venous and left atrial compliance and unstressed volume. */
  Cpv: number
  Vupv: number

  /** Open-valve resistances: mitral, aortic, tricuspid, pulmonic. */
  Rmv: number
  Rav: number
  Rtv: number
  Rpvv: number

  /** Total blood volume (mL). */
  Vtot: number

  /** Open-loop (isolated left ventricle) mode: left atrial source pressure. */
  Pla: number
  /** Open-loop mode: venous sink pressure downstream of Rs. */
  Pven: number

  vent: Ventilation
  reflex: Reflex
}

/**
 * Baseline: a healthy supine adult at rest (about 70 kg, blood volume
 * 5,000 mL). Values were chosen so that the model's steady state falls
 * inside standard adult reference ranges; the calibration is reported in
 * validation.ts and on the Methods page.
 */
export const BASELINE: Params = {
  HR: 72,
  lv: { Ees: 2.6, V0: 10, A: 0.30, B: 0.030 },
  rv: { Ees: 0.72, V0: 20, A: 0.22, B: 0.024 },
  tPeak: 0.30,
  relaxFrac: 0.55,

  Csa: 1.8,
  Vusa: 620,
  Zc: 0.038,
  Rs: 0.815,

  Csv: 150,
  Vusv: 2420,
  Rvr: 0.036,

  Cra: 4.0,
  Vura: 28,

  Cpa: 4.2,
  Vupa: 110,
  Zpa: 0.012,
  Rp: 0.072,

  Cpv: 11,
  Vupv: 262,

  Rmv: 0.008,
  Rav: 0.006,
  Rtv: 0.006,
  Rpvv: 0.003,

  Vtot: 5000,

  Pla: 9.5,
  Pven: 4,

  vent: { on: false, RR: 12, Ti: 1 / 3, VT: 8, pplPerVT: 0.5, Ppl0: 1.0 },
  reflex: { gain: 0, hrArm: 1, eesArm: 1, rsArm: 1, vuArm: 1, Pset: 87 },
}

/** Deep copy so callers can mutate safely. */
export function cloneParams(p: Params): Params {
  return {
    ...p,
    lv: { ...p.lv },
    rv: { ...p.rv },
    vent: { ...p.vent },
    reflex: { ...p.reflex },
  }
}

/** Unit conversions used at the reporting layer. */
export const UNITS = {
  /** mmHg·s·mL⁻¹ → dyn·s·cm⁻⁵ */
  toDyn: (r: number) => r * 1333.22,
  /** dyn·s·cm⁻⁵ → mmHg·s·mL⁻¹ */
  fromDyn: (r: number) => r / 1333.22,
  /** mL·s⁻¹ → L·min⁻¹ */
  toLmin: (q: number) => q * 0.06,
  /** L·min⁻¹ → mL·s⁻¹ */
  fromLmin: (q: number) => q / 0.06,
} as const
