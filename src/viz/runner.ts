import { Circulation, type Beat, type Topology } from '../model/engine'
import type { Params } from '../model/params'

/** Channels recorded into the ring buffer. */
export const CHANNELS = ['Pao', 'Plv', 'Vlv', 'Pra', 'Ppa', 'Ppv', 'Ppl', 'Qav'] as const
export type ChannelName = (typeof CHANNELS)[number]

/**
 * Owns one model instance and advances it in real time with
 * requestAnimationFrame while its figure is visible. Samples go into a ring
 * buffer that canvas strips read directly, so drawing never passes through
 * React state.
 */
export class SimRunner {
  sim: Circulation
  readonly sampleEvery: number
  readonly capacity: number
  readonly t: Float64Array
  readonly data: Record<ChannelName, Float32Array>
  head = 0
  count = 0
  speed = 1
  paused = false
  visible = true
  beats: Beat[] = []
  readonly maxBeats: number

  private raf = 0
  private lastWall = 0
  private clock = 0
  private frameFns = new Set<() => void>()
  private beatFns = new Set<(b: Beat) => void>()
  private storeFns = new Set<() => void>()
  private latest: Beat | null = null
  private notifyQueued = false
  private io: IntersectionObserver | null = null
  private readonly warm: number

  constructor(params: Params, topology: Topology, opts: { sampleEvery?: number; seconds?: number; warm?: number; maxBeats?: number } = {}) {
    this.sampleEvery = opts.sampleEvery ?? 0.004
    this.capacity = Math.ceil((opts.seconds ?? 6) / this.sampleEvery)
    this.maxBeats = opts.maxBeats ?? 400
    this.warm = opts.warm ?? 0
    this.t = new Float64Array(this.capacity)
    this.data = Object.fromEntries(CHANNELS.map((c) => [c, new Float32Array(this.capacity)])) as Record<ChannelName, Float32Array>
    this.sim = new Circulation(params, topology)
    if (this.warm > 0) this.sim.settle(this.warm, 0.002, 0.0005)
    this.latest = this.sim.last
    this.sim.onBeat = (b) => {
      this.beats.push(b)
      if (this.beats.length > this.maxBeats) this.beats.splice(0, this.beats.length - this.maxBeats)
      this.latest = b
      this.beatFns.forEach((fn) => fn(b))
      this.queueNotify()
    }
  }

  /**
   * Return to the settled state of a (possibly new) parameter set, as a
   * figure's Reset button does, without replacing the runner object.
   */
  restart(params: Params): void {
    this.sim.setParams(params)
    this.sim.reset()
    if (this.warm > 0) this.sim.settle(this.warm, 0.002, 0.0005)
    this.beats.length = 0
    this.head = 0
    this.count = 0
    this.clock = 0
    this.latest = this.sim.last
    this.queueNotify()
  }

  /** External-store interface for React (useSyncExternalStore). */
  subscribe = (fn: () => void): (() => void) => {
    this.storeFns.add(fn)
    return () => { this.storeFns.delete(fn) }
  }
  getBeat = (): Beat | null => this.latest

  private queueNotify(): void {
    if (this.notifyQueued) return
    this.notifyQueued = true
    queueMicrotask(() => {
      this.notifyQueued = false
      this.storeFns.forEach((fn) => fn())
    })
  }

  setSpeed(x: number): void { this.speed = x }
  setPaused(p: boolean): void { this.paused = p; this.queueNotify() }

  /** Pause drawing and stepping while `el` is off screen. */
  watch(el: Element | null): void {
    this.io?.disconnect()
    this.io = null
    if (!el || typeof IntersectionObserver === 'undefined') { this.visible = true; return }
    this.io = new IntersectionObserver((es) => { this.visible = es.some((e) => e.isIntersecting) }, { rootMargin: '120px' })
    this.io.observe(el)
  }

  setParams(p: Params): void { this.sim.setParams(p) }

  /** Fast-forward without drawing, e.g. to reach a new steady state. */
  fastForward(seconds: number): void {
    this.sim.advance(seconds, 0.0005)
  }

  onFrame(fn: () => void): () => void { this.frameFns.add(fn); return () => this.frameFns.delete(fn) }
  onBeat(fn: (b: Beat) => void): () => void { this.beatFns.add(fn); return () => this.beatFns.delete(fn) }

  start(): void {
    if (this.raf) return
    this.lastWall = performance.now()
    const tick = (now: number) => {
      this.raf = requestAnimationFrame(tick)
      const wall = Math.min((now - this.lastWall) / 1000, 0.05)
      this.lastWall = now
      if (this.paused || !this.visible) return
      this.step(wall * this.speed)
      this.frameFns.forEach((fn) => fn())
    }
    this.raf = requestAnimationFrame(tick)
  }

  stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  dispose(): void {
    this.stop()
    this.io?.disconnect()
    this.io = null
  }

  /** Advance by `seconds` of model time, sampling into the ring buffer. */
  step(seconds: number): void {
    const dt = 0.00025
    const n = Math.max(1, Math.round(seconds / dt))
    const s = this.sim
    for (let i = 0; i < n; i++) {
      s.step(dt)
      this.clock += dt
      if (this.clock >= this.sampleEvery) {
        this.clock -= this.sampleEvery
        const h = this.head
        const now = s.now
        this.t[h] = now.t
        this.data.Pao[h] = now.Pao
        this.data.Plv[h] = now.Plv
        this.data.Vlv[h] = now.Vlv
        this.data.Pra[h] = now.Pra
        this.data.Ppa[h] = now.Ppa
        this.data.Ppv[h] = now.Ppv
        this.data.Ppl[h] = now.Ppl
        this.data.Qav[h] = now.Qav
        this.head = (h + 1) % this.capacity
        if (this.count < this.capacity) this.count++
      }
    }
  }

  /** Iterate samples newer than `since` seconds before now, oldest first. */
  forEach(since: number, fn: (t: number, i: number) => void): void {
    const n = this.count
    if (!n) return
    const newest = this.t[(this.head - 1 + this.capacity) % this.capacity]
    const t0 = newest - since
    for (let k = n; k >= 1; k--) {
      const i = (this.head - k + this.capacity) % this.capacity
      if (this.t[i] >= t0) fn(this.t[i], i)
    }
  }

  latestTime(): number {
    if (!this.count) return 0
    return this.t[(this.head - 1 + this.capacity) % this.capacity]
  }
}
