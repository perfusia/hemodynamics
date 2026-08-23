// Normal clinical ranges for all hemodynamic variables
// Used across all lessons for range state calculations and slider zones

export const NORMAL_RANGES = {
  co:            { low: 4,    high: 8    },  // L/min
  svr:           { low: 800,  high: 1200 },  // dynes·sec/cm⁵
  hr:            { low: 60,   high: 100  },  // bpm
  sv:            { low: 60,   high: 100  },  // mL/beat
  map:           { low: 70,   high: 100, critical: 65 },  // mmHg
  preload:       { low: 8,    high: 18   },  // mmHg (LVEDP surrogate)
  afterload:     { low: 0.7,  high: 1.3  },  // relative units
  contractility: { low: 0.6,  high: 1.4  },  // relative units
}
