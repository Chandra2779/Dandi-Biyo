import { useEffect, useRef } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { t } from '../../i18n'
import { runtime } from '../../game/runtime'
import { biyoApi } from '../../game/biyoApi'

function useRaf(fn: () => void) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    let raf = 0
    const loop = () => {
      fnRef.current()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
}

function PowerMeter() {
  const fillRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  useRaf(() => {
    const fill = fillRef.current
    if (!fill) return
    const pct = runtime.power * 100
    fill.style.width = `${pct}%`
    if (labelRef.current) labelRef.current.textContent = `${Math.round(pct)}%`
  })
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex w-64 items-center gap-2">
        <span className="text-xs font-bold tracking-widest text-white/60">{t('power')}</span>
        <div className="h-4 flex-1 overflow-hidden rounded-full border border-white/25 bg-black/40">
          <div ref={fillRef} className="h-full w-0 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300" />
        </div>
        <span ref={labelRef} className="w-10 text-right text-xs font-bold text-amber-200">
          0%
        </span>
      </div>
      <span className="text-xs tracking-wide text-white/50">{t('holdToCharge')}</span>
    </div>
  )
}

function TimingMeter() {
  const fillRef = useRef<HTMLDivElement>(null)
  const zoneRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  useRaf(() => {
    const fill = fillRef.current
    const zone = zoneRef.current
    const marker = markerRef.current
    if (!fill || !zone || !marker) return
    const t = runtime.timing
    fill.style.width = `${t * 100}%`
    zone.style.left = `${(0.5 - 0.06) * 100}%`
    zone.style.right = `${(1 - (0.5 + 0.06)) * 100}%`
    marker.style.left = `${t * 100}%`
    if (labelRef.current) {
      const d = Math.abs(t - 0.5)
      let txt = 'GOOD'
      let color = 'text-amber-300'
      if (d <= 0.06) {
        txt = 'PERFECT'
        color = 'text-yellow-300'
      } else if (d <= 0.15) {
        txt = 'GREAT'
        color = 'text-green-300'
      }
      labelRef.current.textContent = txt
      labelRef.current.className = `text-xs font-bold tracking-widest ${color}`
    }
  })
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div ref={labelRef} className="text-xs font-bold tracking-widest text-amber-300" />
      <div className="relative h-4 w-72 overflow-hidden rounded-full border border-white/25 bg-black/40">
        <div
          ref={zoneRef}
          className="absolute top-0 h-full bg-green-400/30"
          style={{ left: '44%', right: '44%' }}
        />
        <div ref={fillRef} className="h-full w-0 bg-amber-400/80" />
        <div
          ref={markerRef}
          className="absolute top-0 h-full w-1 -translate-x-1/2 bg-white"
          style={{ left: '0%' }}
        />
      </div>
      <span className="text-xs tracking-wide text-white/60">{t('strikeNow')}</span>
    </div>
  )
}

function LiveDistance() {
  const distRef = useRef<HTMLSpanElement>(null)
  const phase = useGameStore((s) => s.phase)
  useRaf(() => {
    const el = distRef.current
    if (!el || !biyoApi.body) return
    const pos = biyoApi.position()
    const dist = Math.hypot(pos.x - runtime.biyoStart.x, pos.z - runtime.biyoStart.z)
    el.textContent = `${dist.toFixed(1)}`
  })
  if (phase !== 'STRIKING' && phase !== 'FLIGHT' && phase !== 'TIMING') return null
  return (
    <div className="flex flex-col items-center text-glow">
      <span className="text-xs font-bold tracking-[0.3em] text-white/60">{t('distance')}</span>
      <span className="text-4xl font-bold text-amber-100">
        <span ref={distRef}>0.0</span>
        <span className="ml-1 text-lg text-amber-300/70">{t('distanceResult')}</span>
      </span>
    </div>
  )
}

export function HUD() {
  const phase = useGameStore((s) => s.phase)
  const mode = useGameStore((s) => s.mode)
  const players = useGameStore((s) => s.players)
  const currentPlayer = useGameStore((s) => s.currentPlayer)
  const currentRound = useGameStore((s) => s.currentRound)
  const rounds = useGameStore((s) => s.rounds)
  const lang = useSettingsStore((s) => s.language)
  const player = players[currentPlayer]

  const showMeters = phase === 'AIMING' || phase === 'TIMING'
  const isAiTurn = mode === 'single' && currentPlayer === 1

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="panel px-4 py-2.5 text-glow">
          <div className="text-[10px] font-bold tracking-[0.3em] text-white/50">
            {t('player', lang)} · {t('round', lang)} {currentRound}/{rounds}
          </div>
          <div className="text-lg font-bold text-amber-100">
            {player?.name ?? 'PLAYER'}
            {mode === 'practice' && <span className="ml-2 text-xs text-white/40">· {t('practice', lang)}</span>}
          </div>
        </div>

        <div className="panel flex gap-6 px-5 py-2.5 text-glow">
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-white/50">{t('score', lang)}</div>
            <div className="text-lg font-bold text-amber-100">{player?.totalScore.toFixed(1) ?? '0.0'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-white/50">{t('best', lang)}</div>
            <div className="text-lg font-bold text-amber-100">{player?.bestDistance.toFixed(1) ?? '0.0'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-white/50">WINS</div>
            <div className="text-lg font-bold text-amber-100">{player?.wins ?? 0}</div>
          </div>
        </div>

        <button
          data-ui
          onClick={() => useGameStore.getState().togglePause()}
          className="pointer-events-auto cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10"
        >
          ⏸
        </button>
      </div>

      <div className="flex flex-col items-center gap-3">
        {isAiTurn && (
          <div className="panel animate-fade-up px-5 py-2 text-sm font-semibold text-amber-200">
            {t('aiTurn', lang)}
          </div>
        )}
        {phase === 'SETUP' && (
          <div className="panel animate-fade-up px-5 py-2 text-sm font-semibold text-white/80">
            {t('ready', lang)}
          </div>
        )}
        {showMeters && (
          <div className="animate-fade-up">{phase === 'AIMING' ? <PowerMeter /> : <TimingMeter />}</div>
        )}
        <LiveDistance />
      </div>
    </div>
  )
}
