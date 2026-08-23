import type { Drug } from '../shared/types'
import { DRUG_CLASS_COLOR, STATUS, ISO_26825 } from '../shared/tokens'

interface DrugButtonProps {
  drug: Drug
  active: boolean
  onClick: () => void
}

/**
 * Drug selector. The colour bar on the left follows ISO 26825, the syringe
 * label standard, so the colour matches what a clinician reads on the syringe
 * rather than being decorative.
 */
export function DrugButton({ drug, active, onClick }: DrugButtonProps) {
  const swatch = DRUG_CLASS_COLOR[drug.class] ?? ISO_26825.localAnesthetic
  const delta = (v: number) => (v >= 0 ? STATUS.normal : STATUS.critical)

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex w-full flex-col gap-2 overflow-hidden rounded-md border pl-4 pr-3 py-3 text-left transition-colors
        ${active ? 'border-navy bg-panel' : 'border-rule bg-panel-alt hover:border-navy/50'}`}
    >
      <span className="absolute left-0 top-0 h-full w-[5px]" style={{ background: swatch }} aria-hidden="true" />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13.5px] font-semibold text-ink">{drug.name}</span>
        <span className="rounded-full border border-rule px-2 py-[1px] text-[9.5px] uppercase tracking-wider text-ink-soft">
          {drug.class}
        </span>
      </div>

      <p className="m-0 text-[11.5px] leading-relaxed text-ink-soft">{drug.mechanism}</p>

      <div className="flex flex-wrap items-center gap-2">
        <span className="tnum rounded border border-rule px-2 py-[1px] font-mono text-[11px]"
              style={{ color: delta(drug.effect.co) }}>
          CO {drug.effect.co >= 0 ? '+' : ''}{drug.effect.co}
        </span>
        <span className="tnum rounded border border-rule px-2 py-[1px] font-mono text-[11px]"
              style={{ color: delta(drug.effect.svr) }}>
          SVR {drug.effect.svr >= 0 ? '+' : ''}{drug.effect.svr}
        </span>
        <span className="ml-auto text-right text-[10.5px] italic text-ink-faint">{drug.indication}</span>
      </div>
    </button>
  )
}
