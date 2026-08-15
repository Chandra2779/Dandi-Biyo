import { useGameStore } from '../../stores/gameStore'
import { useUiStore } from '../../stores/uiStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { t } from '../../i18n'
import { Button } from '../ui/Button'
import { audio } from '../../audio/AudioManager'

export function MainMenu() {
  const startGame = useGameStore((s) => s.startGame)
  const open = useUiStore((s) => s.open)
  const lang = useSettingsStore((s) => s.language)

  return (
    <div className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center gap-2 p-4">
      <div className="animate-fade-up flex flex-col items-center">
        <h1 className={`font-nepali text-glow text-6xl font-bold tracking-wide text-amber-100 md:text-8xl`}>
          डण्डी बियो
        </h1>
        <div className="mt-2 text-xl font-bold tracking-[0.35em] text-amber-300/90 text-glow md:text-2xl">
          DANDI BIYO
        </div>
        <div className="mt-2 text-sm text-amber-100/70 italic text-glow">{t('tagline', lang)}</div>
      </div>

      <div className="panel animate-fade-up mt-8 flex w-full max-w-xs flex-col gap-2.5 p-5" style={{ animationDelay: '0.1s' }}>
        <Button
          variant="primary"
          onClick={() => {
            open('modes')
          }}
        >
          {t('play', lang)}
        </Button>
        <Button
          onClick={() => {
            audio.play('button')
            startGame({ mode: 'practice', difficulty: 'easy', rounds: 3 })
          }}
        >
          {t('practice', lang)}
        </Button>
        <Button
          onClick={() => {
            open('modes')
          }}
        >
          {t('localMultiplayer', lang)}
        </Button>
        <Button onClick={() => open('leaderboard')}>{t('leaderboard', lang)}</Button>
        <Button onClick={() => open('howto')}>{t('howToPlay', lang)}</Button>
        <Button onClick={() => open('profile')}>{t('profile', lang)}</Button>
        <Button onClick={() => open('settings')}>{t('settings', lang)}</Button>
        <Button onClick={() => open('profile')}>{t('login', lang)}</Button>
      </div>

      <div className="absolute bottom-3 text-[11px] tracking-widest text-white/30">
        SUPABASE · VERCEL · REACT · THREE.JS · RAPIER
      </div>
    </div>
  )
}
