import type { ReactNode } from 'react'
import { audio } from '../../audio/AudioManager'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
}

export function Button({ children, onClick, variant = 'secondary', className = '', disabled }: ButtonProps) {
  return (
    <button
      data-ui
      disabled={disabled}
      onClick={() => {
        audio.play('button')
        onClick?.()
      }}
      className={`${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} cursor-pointer rounded-xl px-6 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
