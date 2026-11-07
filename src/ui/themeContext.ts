import { createContext, useContext } from 'react'

/** 'auto' follows the operating system; 'light' and 'dark' are stored per browser. */
export type ThemeChoice = 'auto' | 'light' | 'dark'

export interface ThemeState {
  choice: ThemeChoice
  resolved: 'light' | 'dark'
  setChoice: (c: ThemeChoice) => void
}

export const ThemeCtx = createContext<ThemeState>({ choice: 'auto', resolved: 'light', setChoice: () => {} })

export function useTheme(): ThemeState {
  return useContext(ThemeCtx)
}
