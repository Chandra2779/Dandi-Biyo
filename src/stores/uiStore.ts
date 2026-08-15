import { create } from 'zustand'

export type MenuTab =
  | 'main'
  | 'modes'
  | 'howto'
  | 'settings'
  | 'leaderboard'
  | 'profile'

interface UiStore {
  tab: MenuTab
  open: (tab: MenuTab) => void
  close: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  tab: 'main',
  open: (tab) => set({ tab }),
  close: () => set({ tab: 'main' }),
}))
