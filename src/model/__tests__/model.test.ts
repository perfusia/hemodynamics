import { describe, it, expect } from 'vitest'
import { Circulation, type Beat } from '../engine'
import { BASELINE, cloneParams, type Params } from '../params'
import { combine, applyEffect } from '../drugs'
import { STATE_BY_ID } from '../states'
import { rvrEffective, starlingCurve } from '../curves'

const steady = (p: Params, topo: 'closed' | 'lvOpen' = 'closed'): Beat =>
  new Circulation(p, topo).settle(120, 0.0005, 0.0005)

const withReflex = (): Params => {
  const p = cloneParams(BASELINE)
  p.reflex.gain = 1
  p.reflex.Pset = steady(p).MAP
  return p
}

describe('baseline steady state', () => {
  const b = steady(cloneParams(BASELINE))
  it('falls inside adult reference ranges', () => {
    expect(b.HR).toBeCloseTo(72, 0)
    expect(b.MAP).toBeGreaterThan(70); expect(b.MAP).toBeLessThan(105)
    expect(b.CO).toBeGreaterThan(4); expect(b.CO).toBeLessThan(8)
    expect(b.SV).toBeGreaterThan(60); expect(b.SV).toBeLessThan(100)
    expect(b.EF).toBeGreaterThan(0.52); expect(b.EF).toBeLessThan(0.72)
    expect(b.CVP).toBeGreaterThan(2); expect(b.CVP).toBeLessThan(6)
    expect(b.LAP).toBeGreaterThan(6); expect(b.LAP).toBeLessThan(12)
    expect(b.SVR).toBeGreaterThan(800); expect(b.SVR).toBeLessThan(1200)
    expect(b.PVR).toBeLessThan(250)
    expect(b.RVEDV).toBeGreaterThan(100); expect(b.RVEDV).toBeLessThan(160)
  })
  it('conserves blood volume', () => {
    const c = new Circulation(cloneParams(BASELINE)); c.advance(20)
    expect(c.volume()).toBeCloseTo(BASELINE.Vtot, 3)
  })
  it('obeys the venous return relation (Pmsf − PRA) / RVR = CO', () => {
    const predicted = ((b.Pmsf - b.CVP) / rvrEffective(BASELINE)) * 0.06
    expect(Math.abs(predicted - b.CO) / b.CO).toBeLessThan(0.02)
  })
})

describe('ventricular mechanics', () => {
  it('Frank-Starling: SV rises with preload with diminishing returns', () => {
    const pts = starlingCurve(cloneParams(BASELINE), [4, 8, 16, 24])
    expect(pts[1].SV).toBeGreaterThan(pts[0].SV)
    expect(pts[3].SV).toBeGreaterThan(pts[2].SV)
    expect(pts[3].SV - pts[2].SV).toBeLessThan(pts[1].SV - pts[0].SV)
  })
  it('the failing ventricle is more afterload-sensitive than the normal one', () => {
    const drop = (Ees: number) => {
      const lo = cloneParams(BASELINE); lo.lv.Ees = Ees; lo.Rs = 0.6
      const hi = cloneParams(BASELINE); hi.lv.Ees = Ees; hi.Rs = 1.2
      const a = steady(lo, 'lvOpen'), b = steady(hi, 'lvOpen')
      return (a.SV - b.SV) / a.SV
    }
    expect(drop(1.0)).toBeGreaterThan(drop(2.6))
  })
  it('isolated-heart CO falls at very high heart rates as filling time shortens', () => {
    const co = (HR: number) => { const p = cloneParams(BASELINE); p.HR = HR; return steady(p, 'lvOpen').CO }
    expect(co(150)).toBeGreaterThan(co(72))
    expect(co(190)).toBeLessThan(co(150))
  })
})

describe('baroreflex', () => {
  it('compensates graded hemorrhage with rising HR and SVR', () => {
    const run = (loss: number) => {
      const c = new Circulation(withReflex()); c.settle(20)
      c.infuse(-loss, 20); c.advance(120)
      return c.last as Beat
    }
    const b10 = run(500), b20 = run(1000), b30 = run(1500)
    expect(b10.HR).toBeLessThan(95)
    expect(b20.HR).toBeGreaterThan(b10.HR)
    expect(b30.HR).toBeGreaterThan(110)
    expect(b30.MAP).toBeLessThan(b10.MAP)
    expect(b20.SVR).toBeGreaterThan(1300)
  })
})

describe('pharmacology', () => {
  const base = withReflex()
  const b0 = steady(base)
  const give = (doses: Record<string, number>, p = base) => steady(applyEffect(p, combine(doses)))
  it('phenylephrine raises MAP and slows HR by reflex', () => {
    const b = give({ phenylephrine: 80 })
    expect(b.MAP).toBeGreaterThan(b0.MAP); expect(b.HR).toBeLessThan(b0.HR)
  })
  it('nitroprusside lowers MAP and produces reflex tachycardia', () => {
    const b = give({ nitroprusside: 1.5 })
    expect(b.MAP).toBeLessThan(b0.MAP); expect(b.HR).toBeGreaterThan(b0.HR)
  })
  it('dobutamine raises CO in cardiogenic shock and lowers LAP', () => {
    const st = STATE_BY_ID.cardiogenic
    const p = st.apply(base)
    const before = steady(p)
    const after = steady(applyEffect(p, combine({ dobutamine: 5 }, st.sensitivity)))
    expect(after.CO).toBeGreaterThan(before.CO * 1.15)
    expect(after.LAP).toBeLessThan(before.LAP)
  })
  it('norepinephrine restores MAP above 65 mmHg in vasodilatory shock', () => {
    const st = STATE_BY_ID.septic
    const p = st.apply(base)
    expect(steady(p).MAP).toBeLessThan(66)
    const after = steady(applyEffect(p, combine({ norepinephrine: 0.15 }, st.sensitivity)))
    expect(after.MAP).toBeGreaterThan(65)
  })
  it('propofol lowers MAP more in hypovolemia than in health', () => {
    const hv = STATE_BY_ID.hypovolemic.apply(base)
    const dHealthy = b0.MAP - give({ propofol: 3.5 }).MAP
    const dHypo = steady(hv).MAP - give({ propofol: 3.5 }, hv).MAP
    expect(dHypo).toBeGreaterThan(dHealthy)
  })
})

describe('heart-lung interaction', () => {
  const ppv = (dV: number) => {
    const p = cloneParams(BASELINE); p.Vtot += dV; p.vent.on = true
    const c = new Circulation(p); c.advance(40)
    const pp: number[] = []
    c.onBeat = (b) => pp.push(b.SBP - b.DBP)
    c.advance(15)
    const mx = Math.max(...pp), mn = Math.min(...pp)
    return (100 * (mx - mn)) / ((mx + mn) / 2)
  }
  it('pulse pressure variation is larger when hypovolemic', () => {
    expect(ppv(-500)).toBeGreaterThan(ppv(0))
    expect(ppv(0)).toBeGreaterThan(ppv(1000))
  })
})
