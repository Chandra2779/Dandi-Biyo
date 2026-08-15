import { useUiStore } from '../../stores/uiStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { t } from '../../i18n'
import type { Lang } from '../../i18n'
import type { GraphicsQuality } from '../../stores/types'
import type { ReactNode } from 'react'
import { Button } from '../ui/Button'

export function HowToPlay() {
  const close = useUiStore((s) => s.close)
  const lang = useSettingsStore((s) => s.language)

  const steps = [
    t('aim', lang),
    t('holdToCharge', lang),
    t('releaseToLift', lang),
    t('timingHint', lang),
    t('releaseToLift', lang),
    t('distanceResult', lang),
  ]

  return (
    <ModalShell>
      <h2 className="mb-4 text-center text-xl font-bold tracking-widest text-amber-100">{t('howToTitle', lang)}</h2>
      <ol className="mb-6 flex flex-col gap-2 text-sm text-white/80">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-xs font-bold text-amber-300">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <Button className="w-full" onClick={close}>
        {t('close', lang)}
      </Button>
    </ModalShell>
  )
}

export function ComingSoon({ title }: { title: string }) {
  const close = useUiStore((s) => s.close)
  const lang = useSettingsStore((s) => s.language)
  return (
    <ModalShell>
      <h2 className="mb-2 text-center text-xl font-bold tracking-widest text-amber-100">{title}</h2>
      <p className="mb-6 text-center text-sm text-white/50">{t('comingSoon', lang)}</p>
      <Button className="w-full" onClick={close}>
        {t('close', lang)}
      </Button>
    </ModalShell>
  )
}

export function SettingsModal() {
  const close = useUiStore((s) => s.close)
  const { musicVolume, sfxVolume, graphicsQuality, reducedMotion, language, set } = useSettingsStore()

  function slider(label: string, value: number, onChange: (v: number) => void) {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">{label}</span>
        <input
          data-ui
          type="range"
          min={0}
          max={100}
          value={Math.round(value * 100)}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          className="accent-amber-400"
        />
      </label>
    )
  }

  const qualityOptions: GraphicsQuality[] = ['low', 'medium', 'high']

  return (
    <ModalShell>
      <h2 className="mb-5 text-center text-xl font-bold tracking-widest text-amber-100">{t('settingsTitle', language)}</h2>
      <div className="mb-5 flex flex-col gap-4">
        {slider(t('musicVolume', language), musicVolume, (v) => set({ musicVolume: v }))}
        {slider(t('sfxVolume', language), sfxVolume, (v) => set({ sfxVolume: v }))}

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">{t('language', language)}</span>
          <div className="flex gap-2">
            {(['en', 'ne'] as Lang[]).map((l) => (
              <button
                key={l}
                data-ui
                onClick={() => set({ language: l })}
                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-xs font-bold uppercase transition ${
                  language === l
                    ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                    : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {l === 'en' ? t('english', language) : t('nepali', language)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">{t('graphicsQuality', language)}</span>
          <div className="flex gap-2">
            {qualityOptions.map((q) => (
              <button
                key={q}
                data-ui
                onClick={() => set({ graphicsQuality: q })}
                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-xs font-bold uppercase transition ${
                  graphicsQuality === q
                    ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                    : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {t(q === 'medium' ? 'mediumQuality' : q, language)}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
          <input
            data-ui
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => set({ reducedMotion: e.target.checked })}
            className="h-4 w-4 accent-amber-400"
          />
          Reduced Motion
        </label>
      </div>
      <Button className="w-full" onClick={close}>
        {t('close', language)}
      </Button>
    </ModalShell>
  )
}

function ModalShell({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="panel animate-fade-up w-full max-w-sm p-6">{children}</div>
    </div>
  )
}
