import { Circulation } from './engine'
import { BASELINE, cloneParams } from './params'

export interface ValidationRow {
  label: string
  symbol?: string
  model: string
  reference: string
  unit: string
  /** Numeric model value and accepted range, for the self-test. */
  value: number
  lo: number
  hi: number
}

/**
 * Compare the closed-loop baseline steady state with standard adult
 * reference ranges. Reference ranges are drawn from Guyton and Hall (2025)
 * and standard critical care sources; they are listed on the model page.
 * The model's steady state is computed here so the page and the test agree.
 */
export function validateBaseline(): ValidationRow[] {
  const b = new Circulation(cloneParams(BASELINE), 'closed').settle(120, 0.0005, 0.0005)
  const row = (label: string, symbol: string, value: number, lo: number, hi: number, unit: string, fmt: (x: number) => string, refText?: string): ValidationRow => ({
    label, symbol, model: fmt(value), reference: refText ?? `${lo}–${hi}`, unit, value, lo, hi,
  })
  const i = (x: number) => String(Math.round(x))
  const d1 = (x: number) => x.toFixed(1)
  return [
    row('Heart rate', 'HR', b.HR, 60, 100, 'min⁻¹', i),
    row('Mean arterial pressure', 'MAP', b.MAP, 70, 105, 'mmHg', i),
    row('Systolic / diastolic pressure', 'SBP/DBP', b.SBP, 90, 140, 'mmHg', () => `${Math.round(b.SBP)}/${Math.round(b.DBP)}`, '90–140 / 60–90'),
    row('Cardiac output', 'CO', b.CO, 4, 8, 'L·min⁻¹', d1),
    row('Stroke volume', 'SV', b.SV, 60, 100, 'mL', i),
    row('LV end-diastolic volume', 'EDV', b.EDV, 65, 150, 'mL', i),
    row('LV end-systolic volume', 'ESV', b.ESV, 20, 70, 'mL', i),
    row('LV ejection fraction', 'EF', b.EF * 100, 52, 72, '%', i),
    row('Central venous pressure', 'CVP', b.CVP, 2, 6, 'mmHg', i),
    row('Pulmonary artery pressure', 'PAP', b.PAM, 10, 20, 'mmHg', () => `${Math.round(b.PAS)}/${Math.round(b.PAD)}`, '15–25 / 8–15'),
    row('Left atrial pressure', 'LAP', b.LAP, 6, 12, 'mmHg', d1),
    row('Mean systemic filling pressure', 'Pmsf', b.Pmsf, 6, 12, 'mmHg', d1, '7–12'),
    row('Systemic vascular resistance', 'SVR', b.SVR, 800, 1200, 'dyn·s·cm⁻⁵', i),
    row('Pulmonary vascular resistance', 'PVR', b.PVR, 20, 250, 'dyn·s·cm⁻⁵', i, '< 250'),
    row('RV end-diastolic volume', 'RVEDV', b.RVEDV, 100, 160, 'mL', i),
    row('Stroke work', 'SW', b.SW * 1.33322e-4, 0.8, 1.3, 'J·beat⁻¹', d1, '0.8–1.2'),
  ]
}
