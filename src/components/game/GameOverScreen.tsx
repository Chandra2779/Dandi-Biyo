import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useUiStore } from '../../stores/uiStore'
import { t } from '../../i18n'
import { Button } from '../ui/Button'

export function GameOverScreen() {
  const phase = useGameStore((s) => s.phase)
  const mode = useGameStore((s) => s.mode)
  const players = useGameStore((s) => s.players)
  const gameWinner = useGameStore((s) => s.gameWinner)
  const restartGame = useGameStore((s) => s.restartGame)
  const quitToMenu = useGameStore((s) => s.quitToMenu)
  const open = useUiStore((s) => s.open)
  const lang = useSettingsStore((s) => s.language)

  if (phase !== 'GAME_OVER') return null

  const winner =
    gameWinner === -1
      ? '—'
      : gameWinner !== null
        ? players[gameWinner]?.name
        : mode === 'practice'
          ? players[0]?.name
          : null

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="panel animate-fade-up flex w-full max-w-md flex-col gap-4 p-6 text-glow">
        <h2 className="text-center text-4xl font-black tracking-widest text-amber-100">{t('gameOver', lang)}</h2>

        {winner && (
          <div className="text-center">
            <div className="text-xs font-bold tracking-[0.3em] text-white/50">{t('winner', lang)}</div>
            <div className="mt-1 text-2xl font-bold text-amber-300">{winner}</div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {players.map((p, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${
                gameWinner === i ? 'border-amber-400/50 bg-amber-400/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <div>
                <div className="text-sm font-bold text-amber-100">{p.name}</div>
                <div className="text-[10px] tracking-widest text-white/40">
                  {t('score', lang)} {p.totalScore.toFixed(1)} · {t('best', lang)} {p.bestDistance.toFixed(1)} m ·{' '}
                  {t('perfectHits', lang)} {p.perfectHits}
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-200">{p.wins > 0 ? `${p.wins} W` : '—'}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="primary" className="flex-1" onClick={restartGame}>
            {t('playAgain', lang)}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              open('leaderboard')
            }}
          >
            {t('leaderboard', lang)}
          </Button>
          <Button className="flex-1" onClick={quitToMenu}>
            {t('mainMenu', lang)}
          </Button>
        </div>
      </div>
    </div>
  )
}
