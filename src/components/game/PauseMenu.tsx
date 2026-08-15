import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { t } from '../../i18n'
import { Button } from '../ui/Button'

export function PauseMenu() {
  const phase = useGameStore((s) => s.phase)
  const resume = useGameStore((s) => s.resume)
  const restartGame = useGameStore((s) => s.restartGame)
  const quitToMenu = useGameStore((s) => s.quitToMenu)
  const lang = useSettingsStore((s) => s.language)

  if (phase !== 'PAUSED') return null

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="panel animate-fade-up flex w-full max-w-xs flex-col gap-3 p-6">
        <h2 className="mb-2 text-center text-2xl font-bold tracking-widest text-amber-100">{t('paused', lang)}</h2>
        <Button variant="primary" onClick={resume}>
          {t('resume', lang)}
        </Button>
        <Button onClick={restartGame}>{t('restart', lang)}</Button>
        <Button onClick={quitToMenu}>{t('quit', lang)}</Button>
      </div>
    </div>
  )
}
