/**
 * Titrate circulation model.
 *
 * A lumped-parameter, closed-loop model of the cardiovascular system:
 *
 *   LV ─AV─ Zc ─ systemic arteries (Csa) ─ Rs ─ systemic veins (Csv) ─ Rvr ─ RA (Cra)
 *    ↑                                                                        │
 *   MV                                                                       TV
 *    │                                                                        ↓
 *   pulmonary veins + LA (Cpv) ─ Rp ─ pulmonary arteries (Cpa) ─ Zpa ─ PV ─ RV
 *
 * Each ventricle is a time-varying elastance (Suga & Sagawa): pressure is a
 * weighted sum of a linear end-systolic pressure–volume relation and an
 * exponential end-diastolic relation, weighted by an activation function
 * e(t) that rises from 0 to 1 during systole and returns to 0 in diastole.
 * Vascular compartments are linear compliances with an unstressed volume.
 * Valves are ideal diodes with a small open resistance. Total blood volume is
 * conserved except for explicit infusion or haemorrhage.
 *
 * The heart, pulmonary vessels and atria sit inside the thorax: their
 * intravascular pressure is transmural pressure plus pleural pressure, which
 * is how positive-pressure ventilation enters the model.
 *
 * An arterial baroreflex can be enabled. It senses low-pass-filtered aortic
 * pressure and drives four effectors (heart rate, LV and RV end-systolic
 * elastance, arteriolar resistance and venous unstressed volume) through
 * first-order lags with effector-specific time constants.
 *
 * Two topologies share one solver:
 *   'closed'  the full loop above.
 *   'lvOpen'  an isolated left ventricle filled from a fixed left atrial
 *             pressure and ejecting into the arterial Windkessel, which drains
 *             to a fixed venous pressure. This is the classic ejecting-heart
 *             preparation used to study the PV loop under controlled preload.
 */

import type { Params } from './params'
import { cloneParams } from './params'

export type Topology = 'closed' | 'lvOpen'

/** Snapshot of instantaneous model variables, used to draw waveforms. */
export interface Sample {
  t: number
  /** LV pressure, aortic root pressure, RA, RV, PA, PV/LA pressure (mmHg). */
  Plv: number
  Pao: number
  Pra: number
  Prv: number
  Ppa: number
  Ppv: number
  /** LV volume (mL). */
  Vlv: number
  /** Aortic and mitral flow (mL·s⁻¹). */
  Qav: number
  Qmv: number
  /** Pleural pressure (mmHg). */
  Ppl: number
  /** Activation, 0 to 1. */
  e: number
}

/** Values summarised over one complete cardiac cycle. */
export interface Beat {
  /** Time of beat onset (s) and cycle length (s). */
  t: number
  T: number
  HR: number
  EDV: number
  ESV: number
  SV: number
  EF: number
  EDP: number
  ESP: number
  LVSP: number
  SBP: number
  DBP: number
  MAP: number
  CVP: number
  PAS: number
  PAD: number
  PAM: number
  LAP: number
  RVEDV: number
  RVESV: number
  /** Cardiac output, L·min⁻¹. */
  CO: number
  /** Calculated SVR and PVR, dyn·s·cm⁻⁵ (as a clinician would compute them). */
  SVR: number
  PVR: number
  /** Stroke work: area of the LV pressure–volume loop (mmHg·mL). */
  SW: number
  /** Mean systemic filling pressure, averaged over the beat (mmHg). */
  Pmsf: number
  /** Effective (post-reflex) parameters during this beat. */
  EesEff: number
  RsEff: number
  VusvEff: number
  /** Pleural pressure at beat onset (mmHg). */
  Ppl: number
  /** LV pressure–volume loop: interleaved V, P pairs. */
  loop: Float32Array
}

export interface Schedule {
  /** Infusion (+) or haemorrhage (−) rate into systemic veins, mL·s⁻¹. */
  rate: number
  /** Volume left to deliver (mL, positive). */
  remaining: number
}

const LOOP_DT = 0.002

/**
 * Baroreflex effector limits. `a` is the saturating afferent signal,
 * tanh((P − Pset)/scale), in −1…1. For hypotension (a < 0) each effector
 * moves toward its "Up" limit; for hypertension toward its "Down" limit.
 * Values are fractional changes except vu, which is in mL of venous
 * unstressed volume shifted into (hypotension) or out of the stressed pool.
 * Time constants (s) follow the ordering in carotid baroreflex models:
 * vagally mediated rate fastest, venous capacitance slowest.
 */
export const REFLEX = {
  scale: 20,
  hrUp: 1.0, hrDown: 0.4,
  eesUp: 0.6, eesDown: 0.2,
  rsUp: 1.0, rsDown: 0.35,
  vuUp: 1000, vuDown: 350,
  tauHR: 2.0, tauE: 8.0, tauR: 6.0, tauV: 20.0,
} as const

export class Circulation {
  p: Params
  topology: Topology

  // State: compartment volumes (mL).
  Vlv = 0
  Vsa = 0
  Vsv = 0
  Vra = 0
  Vrv = 0
  Vpa = 0
  Vpv = 0

  /** Simulation clock (s), time within the current beat, current cycle length. */
  t = 0
  tb = 0
  T = 60 / 70

  // Baroreflex states: fractional changes in HR, Ees, Rs and an absolute
  // change in venous unstressed volume (mL).
  rHR = 0
  rE = 0
  rR = 0
  rV = 0
  /** Low-pass-filtered aortic pressure sensed by the baroreceptors. */
  Pb = 90

  schedule: Schedule = { rate: 0, remaining: 0 }

  /** Latest instantaneous values. */
  now: Sample = {
    t: 0, Plv: 0, Pao: 0, Pra: 0, Prv: 0, Ppa: 0, Ppv: 0, Vlv: 0, Qav: 0, Qmv: 0, Ppl: 0, e: 0,
  }
  /** Most recent completed beat. */
  last: Beat | null = null
  /** Called at the end of every beat. */
  onBeat: ((b: Beat) => void) | null = null

  // Per-beat accumulators.
  private aEDV = 0
  private aEDP = 0
  private aVmin = 1e9
  private aPatVmin = 0
  private aLVSP = -1e9
  private aSBP = -1e9
  private aDBP = 1e9
  private aIPao = 0
  private aIPra = 0
  private aIPpa = 0
  private aPAS = -1e9
  private aPAD = 1e9
  private aIPpv = 0
  private aRVEDV = 0
  private aRVmin = 1e9
  private aPpl = 0
  private aIPmsf = 0
  private loopBuf: number[] = []
  private loopClock = 0

  constructor(p: Params, topology: Topology = 'closed') {
    this.p = cloneParams(p)
    this.topology = topology
    this.Pb = p.reflex.Pset
    this.reset()
  }

  /** Replace parameters without disturbing state (a perturbation). */
  setParams(p: Params): void {
    this.p = cloneParams(p)
  }

  /** Put the state at a plausible starting point consistent with Vtot. */
  reset(): void {
    const p = this.p
    this.t = 0
    this.tb = 0
    this.rHR = this.rE = this.rR = this.rV = 0
    this.Pb = p.reflex.Pset
    this.T = 60 / p.HR
    this.Vlv = 110
    this.Vsa = p.Vusa + p.Csa * 85
    if (this.topology === 'lvOpen') return
    this.Vra = p.Vura + p.Cra * 3
    this.Vrv = 120
    this.Vpa = p.Vupa + p.Cpa * 14
    this.Vpv = p.Vupv + p.Cpv * 8
    this.Vsv = p.Vtot - (this.Vlv + this.Vsa + this.Vra + this.Vrv + this.Vpa + this.Vpv)
    this.beginBeat()
  }

  /** Total blood volume currently in the model (mL). */
  volume(): number {
    return this.Vlv + this.Vsa + this.Vsv + this.Vra + this.Vrv + this.Vpa + this.Vpv
  }

  /** Infuse (+) or remove (−) a volume over a duration (s). */
  infuse(volume: number, seconds: number): void {
    this.schedule = { rate: volume / Math.max(seconds, 1e-3), remaining: Math.abs(volume) }
  }

  /** Effective parameters after the baroreflex. */
  effHR(): number { return clamp(this.p.HR * (1 + this.rHR), 25, 220) }
  effEesL(): number { return this.p.lv.Ees * (1 + this.rE) }
  effEesR(): number { return this.p.rv.Ees * (1 + this.rE) }
  effRs(): number { return this.p.Rs * (1 + this.rR) }
  effVusv(): number { return Math.max(200, this.p.Vusv + this.rV) }

  /** Pleural pressure at time t. */
  pleural(t: number): number {
    const v = this.p.vent
    if (!v.on) return 0
    const Tr = 60 / v.RR
    const ph = t % Tr
    const Ti = v.Ti * Tr
    const swing = v.pplPerVT * v.VT
    let f: number
    if (ph < Ti) {
      f = ph / Ti // constant-flow inspiration: volume rises linearly
    } else {
      f = Math.exp(-(ph - Ti) / 0.45) // passive exhalation
    }
    return v.Ppl0 + swing * f
  }

  private activation(tb: number): number {
    const p = this.p
    const Tc = p.tPeak * Math.sqrt(this.T / 0.857)
    const Tr = p.relaxFrac * Tc
    if (tb < Tc) return 0.5 * (1 - Math.cos((Math.PI * tb) / Tc))
    if (tb < Tc + Tr) return 0.5 * (1 + Math.cos((Math.PI * (tb - Tc)) / Tr))
    return 0
  }

  private beginBeat(): void {
    this.T = 60 / this.effHR()
    this.aEDV = this.Vlv
    this.aEDP = this.now.Plv
    this.aVmin = 1e9
    this.aLVSP = -1e9
    this.aSBP = -1e9
    this.aDBP = 1e9
    this.aIPao = 0
    this.aIPra = 0
    this.aIPpa = 0
    this.aPAS = -1e9
    this.aPAD = 1e9
    this.aIPpv = 0
    this.aRVEDV = this.Vrv
    this.aRVmin = 1e9
    this.aPpl = this.now.Ppl
    this.aIPmsf = 0
    this.loopBuf.length = 0
    this.loopClock = 0
  }

  private endBeat(): void {
    const T = this.T
    const p = this.p
    const SV = this.aEDV - this.aVmin
    const HR = 60 / T
    const MAP = this.aIPao / T
    const closed = this.topology === 'closed'
    const CVP = closed ? this.aIPra / T : p.Pven
    const PAM = closed ? this.aIPpa / T : 0
    const LAP = closed ? this.aIPpv / T : p.Pla
    const CO = (SV * HR) / 1000
    const loop = Float32Array.from(this.loopBuf)
    const b: Beat = {
      t: this.t - T,
      T,
      HR,
      EDV: this.aEDV,
      ESV: this.aVmin,
      SV,
      EF: SV / this.aEDV,
      EDP: this.aEDP,
      ESP: this.aPatVmin,
      LVSP: this.aLVSP,
      SBP: this.aSBP,
      DBP: this.aDBP,
      MAP,
      CVP,
      PAS: closed ? this.aPAS : 0,
      PAD: closed ? this.aPAD : 0,
      PAM,
      LAP,
      RVEDV: closed ? this.aRVEDV : 0,
      RVESV: closed ? this.aRVmin : 0,
      CO,
      SVR: CO > 0.05 ? (80 * (MAP - CVP)) / CO : 0,
      PVR: closed && CO > 0.05 ? (80 * (PAM - LAP)) / CO : 0,
      SW: shoelace(loop),
      Pmsf: closed ? this.aIPmsf / T : 0,
      EesEff: this.effEesL(),
      RsEff: this.effRs(),
      VusvEff: this.effVusv(),
      Ppl: this.aPpl,
      loop,
    }
    this.last = b
    if (this.onBeat) this.onBeat(b)
  }

  /** Mean systemic filling pressure from current systemic volumes (mmHg). */
  pmsf(): number {
    const p = this.p
    const stressed = this.Vsa - p.Vusa + (this.Vsv - this.effVusv()) + (this.Vra - p.Vura)
    return stressed / (p.Csa + p.Csv + p.Cra)
  }

  /**
   * Advance the model by one time step dt (s). Explicit Euler is stable here
   * because the smallest compartment time constant is about 8 ms and the
   * default step is 0.25 ms.
   */
  step(dt: number): void {
    const p = this.p
    const e = this.activation(this.tb)
    const Ppl = this.pleural(this.t)

    const EesL = this.effEesL()
    const xL = Math.min(p.lv.B * (this.Vlv - p.lv.V0), 9)
    const Plv = e * EesL * Math.max(this.Vlv - p.lv.V0, 0) + (1 - e) * p.lv.A * (Math.exp(xL) - 1) + Ppl

    const Psa = (this.Vsa - p.Vusa) / p.Csa
    const Rs = this.effRs()

    let Qmv: number
    let Qav: number
    let Qs: number
    let Pra = 0
    let Prv = 0
    let Ppa = 0
    let Ppv: number

    if (this.topology === 'closed') {
      const EesR = this.effEesR()
      const xR = Math.min(p.rv.B * (this.Vrv - p.rv.V0), 9)
      Prv = e * EesR * Math.max(this.Vrv - p.rv.V0, 0) + (1 - e) * p.rv.A * (Math.exp(xR) - 1) + Ppl
      const Psv = (this.Vsv - this.effVusv()) / p.Csv
      Pra = (this.Vra - p.Vura) / p.Cra + Ppl
      Ppa = (this.Vpa - p.Vupa) / p.Cpa + Ppl
      Ppv = (this.Vpv - p.Vupv) / p.Cpv + Ppl

      Qav = Plv > Psa ? (Plv - Psa) / (p.Rav + p.Zc) : 0
      Qs = (Psa - Psv) / Rs
      // Great veins collapse at the thoracic inlet when right atrial pressure
      // falls below atmospheric, which flattens the venous return curve.
      // Collapsed veins cannot drain the atrium backward, so return is floored at 0.
      const Qvr = Math.max(0, Psv - Math.max(Pra, 0)) / p.Rvr
      const Qtv = Pra > Prv ? (Pra - Prv) / p.Rtv : 0
      const Qpvv = Prv > Ppa ? (Prv - Ppa) / (p.Rpvv + p.Zpa) : 0
      const Qp = (Ppa - Ppv) / p.Rp
      Qmv = Ppv > Plv ? (Ppv - Plv) / p.Rmv : 0

      let Qinf = 0
      if (this.schedule.remaining > 0) {
        Qinf = this.schedule.rate
        this.schedule.remaining -= Math.abs(Qinf) * dt
        if (this.schedule.remaining <= 0) this.schedule = { rate: 0, remaining: 0 }
      }

      this.Vlv += (Qmv - Qav) * dt
      this.Vsa += (Qav - Qs) * dt
      this.Vsv += (Qs - Qvr + Qinf) * dt
      this.Vra += (Qvr - Qtv) * dt
      this.Vrv += (Qtv - Qpvv) * dt
      this.Vpa += (Qpvv - Qp) * dt
      this.Vpv += (Qp - Qmv) * dt
      if (this.Vsv < 1) this.Vsv = 1
      if (this.Vra < 1) this.Vra = 1
    } else {
      Ppv = p.Pla
      Qav = Plv > Psa ? (Plv - Psa) / (p.Rav + p.Zc) : 0
      Qs = (Psa - p.Pven) / Rs
      Qmv = Ppv > Plv ? (Ppv - Plv) / p.Rmv : 0
      this.Vlv += (Qmv - Qav) * dt
      this.Vsa += (Qav - Qs) * dt
    }

    const Pao = Psa + p.Zc * Qav

    // Baroreflex: sensed pressure, saturating afferent, first-order effectors.
    const r = p.reflex
    this.Pb += ((Pao - this.Pb) * dt) / 1.0
    if (r.gain > 0) {
      const a = Math.tanh((this.Pb - r.Pset) / REFLEX.scale)
      const g = r.gain
      const tHR = g * r.hrArm * (a < 0 ? -a * REFLEX.hrUp : -a * REFLEX.hrDown)
      const tE = g * r.eesArm * (a < 0 ? -a * REFLEX.eesUp : -a * REFLEX.eesDown)
      const tR = g * r.rsArm * (a < 0 ? -a * REFLEX.rsUp : -a * REFLEX.rsDown)
      const tV = g * r.vuArm * (a < 0 ? a * REFLEX.vuUp : a * REFLEX.vuDown)
      this.rHR += ((tHR - this.rHR) * dt) / REFLEX.tauHR
      this.rE += ((tE - this.rE) * dt) / REFLEX.tauE
      this.rR += ((tR - this.rR) * dt) / REFLEX.tauR
      this.rV += ((tV - this.rV) * dt) / REFLEX.tauV
    } else {
      this.rHR += ((0 - this.rHR) * dt) / REFLEX.tauHR
      this.rE += ((0 - this.rE) * dt) / REFLEX.tauE
      this.rR += ((0 - this.rR) * dt) / REFLEX.tauR
      this.rV += ((0 - this.rV) * dt) / REFLEX.tauV
    }

    // Record instantaneous values.
    const n = this.now
    n.t = this.t
    n.Plv = Plv
    n.Pao = Pao
    n.Pra = Pra
    n.Prv = Prv
    n.Ppa = Ppa
    n.Ppv = Ppv
    n.Vlv = this.Vlv
    n.Qav = Qav
    n.Qmv = Qmv
    n.Ppl = Ppl
    n.e = e

    // Beat accumulators.
    if (this.Vlv < this.aVmin) { this.aVmin = this.Vlv; this.aPatVmin = Plv }
    if (Plv > this.aLVSP) this.aLVSP = Plv
    if (Pao > this.aSBP) this.aSBP = Pao
    if (Pao < this.aDBP) this.aDBP = Pao
    this.aIPao += Pao * dt
    if (this.topology === 'closed') {
      this.aIPra += Pra * dt
      this.aIPpa += Ppa * dt
      if (Ppa > this.aPAS) this.aPAS = Ppa
      if (Ppa < this.aPAD) this.aPAD = Ppa
      this.aIPpv += Ppv * dt
      if (this.Vrv < this.aRVmin) this.aRVmin = this.Vrv
      this.aIPmsf += this.pmsf() * dt
    }
    this.loopClock += dt
    if (this.loopClock >= LOOP_DT) {
      this.loopClock -= LOOP_DT
      this.loopBuf.push(this.Vlv, Plv - Ppl)
    }

    this.t += dt
    this.tb += dt
    if (this.tb >= this.T) {
      this.tb -= this.T
      this.endBeat()
      this.beginBeat()
    }
  }

  /**
   * Advance by `seconds`, optionally sampling instantaneous values every
   * `sampleEvery` seconds into `out`.
   */
  advance(seconds: number, dt = 0.00025, sampleEvery = 0, out?: (s: Sample) => void): void {
    const n = Math.max(1, Math.round(seconds / dt))
    let clock = 0
    for (let i = 0; i < n; i++) {
      this.step(dt)
      if (out && sampleEvery > 0) {
        clock += dt
        if (clock >= sampleEvery) {
          clock -= sampleEvery
          out({ ...this.now })
        }
      }
    }
  }

  /** Run until beat-to-beat change is negligible, then return the last beat. */
  settle(maxSeconds = 40, tol = 0.002, dt = 0.00025): Beat {
    let prev: Beat | null = null
    let stable = 0
    const start = this.t
    const save = this.onBeat
    let lastBeat: Beat | null = null
    this.onBeat = (b) => { lastBeat = b }
    while (this.t - start < maxSeconds) {
      this.advance(this.T, dt)
      const b = lastBeat as Beat | null
      if (b && prev) {
        const d = Math.abs(b.SV - prev.SV) / Math.max(prev.SV, 1) + Math.abs(b.MAP - prev.MAP) / Math.max(prev.MAP, 1)
        if (d < tol && Math.abs(b.HR - prev.HR) < 0.05) stable++
        else stable = 0
        if (stable >= 4 && this.t - start > 4) break
      }
      prev = b
    }
    this.onBeat = save
    return (this.last ?? lastBeat) as Beat
  }
}

function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x
}

/** Area of a closed polygon given interleaved x, y pairs. */
function shoelace(xy: Float32Array): number {
  const n = xy.length / 2
  if (n < 3) return 0
  let s = 0
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    s += xy[2 * i] * xy[2 * j + 1] - xy[2 * j] * xy[2 * i + 1]
  }
  return Math.abs(s) / 2
}
