import { settingsSnapshot } from '../stores/settingsStore'

type SoundName =
  | 'swing'
  | 'wood-hit'
  | 'biyo-hit'
  | 'ground-hit'
  | 'success'
  | 'miss'
  | 'button'
  | 'perfect'

class AudioManager {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private musicTimer: number | null = null
  private musicStarted = false
  private enabled = true

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!Ctor) return null
        this.ctx = new Ctor()
        this.master = this.ctx.createGain()
        this.master.connect(this.ctx.destination)
        this.musicGain = this.ctx.createGain()
        this.musicGain.connect(this.master)
        this.sfxGain = this.ctx.createGain()
        this.sfxGain.connect(this.master)
        this.applyVolumes()
      } catch {
        this.ctx = null
      }
    }
    return this.ctx
  }

  private applyVolumes() {
    if (!this.ctx) return
    const s = settingsSnapshot()
    if (this.musicGain) this.musicGain.gain.value = s.musicVolume * 0.4
    if (this.sfxGain) this.sfxGain.gain.value = s.sfxVolume
  }

  unlock() {
    const ctx = this.ensure()
    if (ctx && ctx.state === 'suspended') void ctx.resume()
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  startMusic() {
    const ctx = this.ensure()
    if (!ctx || !this.musicGain || this.musicStarted) return
    this.musicStarted = true
    this.musicTimer = window.setInterval(() => this.playDrone(), 2400)
    this.playDrone()
  }

  stopMusic() {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer)
      this.musicTimer = null
    }
    this.musicStarted = false
  }

  private playDrone() {
    const ctx = this.ensure()
    if (!ctx || !this.musicGain || !this.enabled) return
    const s = settingsSnapshot()
    if (s.musicVolume <= 0) return
    const t = ctx.currentTime
    const freq = 98
    const osc = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    const gain2 = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 320
    osc.type = 'sine'
    osc.frequency.value = freq
    osc2.type = 'triangle'
    osc2.frequency.value = freq * 1.005
    osc.detune.value = -4
    osc2.detune.value = 4
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(0.22, t + 1.2)
    gain.gain.setValueAtTime(0.22, t + 1.6)
    gain.gain.linearRampToValueAtTime(0, t + 2.4)
    gain2.gain.setValueAtTime(0, t)
    gain2.gain.linearRampToValueAtTime(0.08, t + 1.0)
    gain2.gain.setValueAtTime(0.08, t + 1.8)
    gain2.gain.linearRampToValueAtTime(0, t + 2.4)
    osc.connect(gain)
    gain.connect(filter)
    osc2.connect(gain2)
    gain2.connect(filter)
    filter.connect(this.musicGain)
    osc.start(t)
    osc2.start(t)
    osc.stop(t + 2.5)
    osc2.stop(t + 2.5)
  }

  private tone(freq: number, duration: number, type: OscillatorType, gain: number, slideTo?: number) {
    const ctx = this.ensure()
    if (!ctx || !this.sfxGain || !this.enabled) return
    const s = settingsSnapshot()
    if (s.sfxVolume <= 0) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + duration)
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(t)
    osc.stop(t + duration + 0.02)
  }

  private noise(duration: number, gain: number, filterFreq: number) {
    const ctx = this.ensure()
    if (!ctx || !this.sfxGain || !this.enabled) return
    const s = settingsSnapshot()
    if (s.sfxVolume <= 0) return
    const t = ctx.currentTime
    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = filterFreq
    const g = ctx.createGain()
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    src.connect(filter)
    filter.connect(g)
    g.connect(this.sfxGain)
    src.start(t)
  }

  play(name: SoundName) {
    if (!this.enabled) return
    switch (name) {
      case 'swing':
        this.noise(0.22, 0.25, 900)
        break
      case 'wood-hit':
        this.tone(420, 0.12, 'square', 0.3, 160)
        this.noise(0.08, 0.25, 1600)
        break
      case 'biyo-hit':
        this.tone(620, 0.16, 'square', 0.35, 220)
        this.noise(0.1, 0.3, 2000)
        break
      case 'ground-hit':
        this.noise(0.18, 0.3, 500)
        break
      case 'success':
        this.tone(523, 0.12, 'sine', 0.25)
        window.setTimeout(() => this.tone(659, 0.14, 'sine', 0.25), 120)
        window.setTimeout(() => this.tone(784, 0.2, 'sine', 0.28), 240)
        break
      case 'perfect':
        this.tone(523, 0.1, 'sine', 0.28)
        window.setTimeout(() => this.tone(659, 0.1, 'sine', 0.28), 90)
        window.setTimeout(() => this.tone(880, 0.12, 'sine', 0.28), 180)
        window.setTimeout(() => this.tone(1046, 0.22, 'sine', 0.3), 270)
        break
      case 'miss':
        this.tone(300, 0.25, 'sawtooth', 0.15, 150)
        break
      case 'button':
        this.tone(760, 0.07, 'sine', 0.15)
        break
    }
  }
}

export const audio = new AudioManager()
