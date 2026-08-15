import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setLanguage, type Lang } from '../i18n'
import type { GraphicsQuality } from './types'

export interface Settings {
  musicVolume: number
  sfxVolume: number
  cameraSensitivity: number
  controlSensitivity: number
  graphicsQuality: GraphicsQuality
  reducedMotion: boolean
  language: Lang
}

interface SettingsStore extends Settings {
  set: (patch: Partial<Settings>) => void
}

const defaults: Settings = {
  musicVolume: 0.6,
  sfxVolume: 0.8,
  cameraSensitivity: 1,
  controlSensitivity: 1,
  graphicsQuality: 'high',
  reducedMotion: false,
  language: 'en',
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      set: (patch) => {
        if (patch.language !== undefined) setLanguage(patch.language)
        set(patch)
      },
    }),
    {
      name: 'dandi-biyo-settings',
      onRehydrateStorage: () => (state) => {
        if (state) setLanguage(state.language)
      },
    },
  ),
)

export function settingsSnapshot(): Settings {
  return {
    musicVolume: useSettingsStore.getState().musicVolume,
    sfxVolume: useSettingsStore.getState().sfxVolume,
    cameraSensitivity: useSettingsStore.getState().cameraSensitivity,
    controlSensitivity: useSettingsStore.getState().controlSensitivity,
    graphicsQuality: useSettingsStore.getState().graphicsQuality,
    reducedMotion: useSettingsStore.getState().reducedMotion,
    language: useSettingsStore.getState().language,
  }
}
