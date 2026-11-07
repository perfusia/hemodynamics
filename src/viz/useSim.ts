import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useState } from 'react'
import type { Topology } from '../model/engine'
import type { Params } from '../model/params'
import { SimRunner } from './runner'

interface Options {
  topology?: Topology
  /** Model seconds to settle before the first frame. */
  warm?: number
  /** Ring buffer length (s). */
  seconds?: number
  speed?: number
  maxBeats?: number
}

/**
 * React binding for a SimRunner.
 *
 * The runner lives in component state, built once by the lazy initializer, so
 * it already exists during the first render and before any child figure runs
 * its mount effect and subscribes to it (child effects run before the
 * parent's). Parameter changes are pushed in as perturbations; the latest
 * completed beat is read through useSyncExternalStore, so a component
 * re-renders at most once per beat regardless of frame rate, and the runner
 * stops stepping when its figure scrolls out of view. Reset re-settles the
 * same runner rather than replacing it.
 */
export function useSim(params: Params, opts: Options = {}) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const paramsRef = useRef(params)

  const [runner] = useState(() => {
    const r = new SimRunner(params, opts.topology ?? 'closed', { warm: opts.warm ?? 20, seconds: opts.seconds ?? 6, maxBeats: opts.maxBeats })
    r.setSpeed(opts.speed ?? 1)
    return r
  })

  useEffect(() => { paramsRef.current = params }, [params])

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { runner.setPaused(true); runner.step(3) }
    runner.watch(boxRef.current)
    runner.start()
    const vis = () => { if (document.hidden) runner.visible = false }
    document.addEventListener('visibilitychange', vis)
    return () => { document.removeEventListener('visibilitychange', vis); runner.dispose() }
  }, [runner])

  useEffect(() => { runner.setParams(params) }, [runner, params])
  useEffect(() => { runner.setSpeed(opts.speed ?? 1) }, [runner, opts.speed])

  const beat = useSyncExternalStore(runner.subscribe, runner.getBeat, runner.getBeat)
  const paused = useSyncExternalStore(runner.subscribe, () => runner.paused, () => false)

  return {
    runner,
    box: boxRef,
    beat,
    paused,
    setPaused: (p: boolean) => runner.setPaused(p),
    reset: () => runner.restart(paramsRef.current),
  }
}
