import type { Drug } from '../shared/types'

interface DrugButtonProps {
  drug: Drug
  active: boolean
  onClick: () => void
}

export function DrugButton({ drug, active, onClick }: DrugButtonProps) {
  const coUp  = drug.effect.co  >= 0
  const svrUp = drug.effect.svr >= 0
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', gap: 7, textAlign: 'left',
      padding: '11px 13px', borderRadius: 10,
      border: active ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.07)',
      background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.025)',
      cursor: 'pointer', transition: 'all 0.15s', width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'white' }}>{drug.name}</span>
        <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{drug.class}</span>
      </div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', lineHeight: 1.55, margin: 0 }}>{drug.mechanism}</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontFamily: 'ui-monospace,monospace', padding: '2px 8px', borderRadius: 6, color: coUp  ? '#34d399' : '#f87171', background: coUp  ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)' }}>
          CO {drug.effect.co >= 0 ? '+' : ''}{drug.effect.co}
        </span>
        <span style={{ fontSize: 11, fontFamily: 'ui-monospace,monospace', padding: '2px 8px', borderRadius: 6, color: svrUp ? '#34d399' : '#f87171', background: svrUp ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)' }}>
          SVR {drug.effect.svr >= 0 ? '+' : ''}{drug.effect.svr}
        </span>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto', fontStyle: 'italic' }}>{drug.indication}</span>
      </div>
    </button>
  )
}
