/**
 * Derived relations computed from the model rather than drawn by hand.
 */

import type { Params } from './params'
import { cloneParams } from './params'
import { Circulation, type Beat } from './engine'

export interface StarlingPoint { LAP: number; EDP: number; EDV: number; SV: number; CO: number; MAP: number }

/**
 * Ventricular function curve of the isolated left ventricle: stroke volume
 * as a function of filling pressure at fixed contractility, load and rate.
 */
export function starlingCurve(p: Params, laps: number[]): StarlingPoint[] {
  return laps.map((LAP) => {
    const q = cloneParams(p)
    q.Pla = LAP
    const c = new Circulation(q, 'lvOpen')
    const b = c.settle(20, 0.002, 0.0005)
    return { LAP, EDP: b.EDP, EDV: b.EDV, SV: b.SV, CO: b.CO, MAP: b.MAP }
  })
}

export interface OperatingPoint { Pra: number; CO: number; Pmsf: number; beat: Beat }

/** Steady state of the closed loop (reflex as configured in p). */
export function steadyState(p: Params, maxSeconds = 60): OperatingPoint {
  const c = new Circulation(p, 'closed')
  const b = c.settle(maxSeconds, 0.001, 0.0005)
  return { Pra: b.CVP, CO: b.CO, Pmsf: b.Pmsf, beat: b }
}

/**
 * Effective resistance to venous return in Guyton's sense, the slope of the
 * venous return curve: (Pmsf − PRA) / CO for the linear systemic circuit.
 * Derived from the compartment structure; exact for time-averaged flow.
 */
export function rvrEffective(p: Params, RsEff = p.Rs): number {
  const Ct = p.Csa + p.Csv + p.Cra
  return (p.Rvr * (p.Csa + p.Csv)) / Ct + (RsEff * p.Csa) / Ct
}

export interface VRPoint { Pra: number; VR: number }

/**
 * Venous return curve VR = (Pmsf − PRA)/RVR, flattened below PRA = 0 where
 * the great veins collapse. Returns L·min⁻¹.
 */
export function venousReturnCurve(Pmsf: number, rvr: number, pras: number[]): VRPoint[] {
  return pras.map((Pra) => ({ Pra, VR: (Math.max(0, Pmsf - Math.max(Pra, 0)) / rvr) * 0.06 }))
}

/**
 * Cardiac function curve traced by the closed loop itself: holding the heart,
 * lungs and arterial load fixed and varying total blood volume moves the
 * venous return curve, and the series of intersections is the cardiac
 * function curve (cardiac output against right atrial pressure).
 */
export function cardiacFunctionCurve(p: Params, volumeOffsets: number[]): { Pra: number; CO: number }[] {
  const q0 = cloneParams(p)
  q0.reflex.gain = 0
  return volumeOffsets.map((dV) => {
    const q = cloneParams(q0)
    q.Vtot = p.Vtot + dV
    const c = new Circulation(q, 'closed')
    const b = c.settle(40, 0.001, 0.0005)
    return { Pra: b.CVP, CO: b.CO }
  })
}
