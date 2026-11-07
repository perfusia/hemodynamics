/**
 * The mark: a left ventricular pressure-volume loop as it is plotted, with
 * end-systole marked in arterial red.
 */
export function Mark({ size = 28, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ flex: 'none' }}>
      <rect x="0.5" y="0.5" width="23" height="23" rx="3"
        fill={inverted ? 'var(--color-paper)' : 'var(--color-ink)'}
        stroke={inverted ? 'var(--color-ink)' : 'none'} />
      <path d="M7.5 18.5 C 10.5 18.8, 14 18.4, 17.5 17.4 L 17.5 9.6 C 15.8 6.2, 11 5.3, 7.5 7.4 Z"
        fill="none" stroke={inverted ? 'var(--color-ink)' : 'var(--color-paper)'} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.4" r="1.9" fill="var(--color-art)" />
    </svg>
  )
}

export function Wordmark({ sub = true }: { sub?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Mark />
      <span className="flex flex-col leading-none font-sans">
        <span className="text-[18.5px] font-bold tracking-[-0.01em]">HemoLab</span>
        {sub && <span className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-3 cond">Perfusia</span>}
      </span>
    </span>
  )
}
