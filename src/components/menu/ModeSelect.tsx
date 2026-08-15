import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useUiStore } from '../../stores/uiStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { t } from '../../i18n'
import type { Difficulty } from '../../stores/types'
import { Button } from '../ui/Button'

type Selection = 'single' | 'local'

export function ModeSelect() {
  const startGame = useGameStore((s) => s.startGame)
  const close = useUiStore((s) => s.close)
  const lang = useSettingsStore((s) => s.language)
  const [mode, setMode] = useState<Selection>('single')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [rounds, setRounds] = useState(5)

  const modes: { key: Selection; label: string }[] = [
    { key: 'single', label: t('singlePlayer', lang) },
    { key: 'local', label: t('localMultiplayer', lang) },
  ]

  const roundOptions = [3, 5, 10]

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="panel animate-fade-up flex w-full max-w-sm flex-col gap-4 p-6">
        <h2 className="text-center text-xl font-bold tracking-widest text-amber-100">{t('selectMode', lang)}</h2>

        <div className="flex gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              data-ui
              onClick={() => setMode(m.key)}
              className={`flex-1 cursor-pointer rounded-lg border px-3 py-3 text-xs font-bold tracking-wider uppercase transition ${
                mode === m.key
                  ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                  : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'single' && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">{t('difficulty', lang)}</span>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  data-ui
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-xs font-bold uppercase transition ${
                    difficulty === d
                      ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                      : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {t(d, lang)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-widest text-white/60 uppercase">{t('rounds', lang)}</span>
          <div className="flex gap-2">
            {roundOptions.map((r) => (
              <button
                key={r}
                data-ui
                onClick={() => setRounds(r)}
                className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-sm font-bold transition ${
                  rounds === r
                    ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                    : 'border-white/15 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" onClick={close}>
            {t('close', lang)}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => startGame({ mode, difficulty, rounds })}
          >
            {t('play', lang)}
          </Button>
        </div>
      </div>
    </div>
  )
}
