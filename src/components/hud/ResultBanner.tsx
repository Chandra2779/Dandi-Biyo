import { useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { t } from '../../i18n'

const QUALITY_STYLES: Record<string, string> = {
  PERFECT: 'text-yellow-300',
  GREAT: 'text-green-300',
  GOOD: 'text-amber-300',
  MISS: 'text-red-400',
}

export function ResultController() {
  const phase = useGameStore((s) => s.phase)
  const advanceTurn = useGameStore((s) => s.advanceTurn)

  useEffect(() => {
    if (phase !== 'RESULT') return
    const id = window.setTimeout(() => advanceTurn(), 2000)
    return () => window.clearTimeout(id)
  }, [phase, advanceTurn])

  return null
}

export function ResultBanner() {
  const phase = useGameStore((s) => s.phase)
  const lastResult = useGameStore((s) => s.lastResult)
  const lang = useSettingsStore((s) => s.language)

  if (phase !== 'RESULT' || !lastResult) return null

  const qualityKey =
    lastResult.quality === 'PERFECT'
      ? 'perfect'
      : lastResult.quality === 'GREAT'
        ? 'great'
        : lastResult.quality === 'GOOD'
          ? 'good'
          : 'miss'

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <div className="animate-banner-pop panel flex flex-col items-center gap-1 px-10 py-6 text-glow">
        <div className={`text-4xl font-black tracking-widest ${QUALITY_STYLES[lastResult.quality]}`}>
          {t(qualityKey, lang)}
        </div>
        {lastResult.caught && (
          <div className="mt-1 text-sm font-semibold text-orange-300">{t('catchSuccessful', lang)}</div>
        )}
        <div className="mt-2 text-5xl font-bold text-amber-100">
          {lastResult.distance.toFixed(1)}
          <span className="ml-1 text-xl text-amber-300/70">{t('distanceResult', lang)}</span>
        </div>
        <div className="mt-1 text-sm font-semibold tracking-widest text-white/60">
          {t('score', lang)} · {lastResult.score.toFixed(1)}
        </div>
      </div>
      <div className="absolute bottom-6 text-xs tracking-widest text-white/30">{t('nextTurn', lang)}…</div>
    </div>
  )
}
