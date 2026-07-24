import type { ButtonHTMLAttributes } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  fullWidth?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export function Button({
  loading = false,
  fullWidth = false,
  variant = 'primary',
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={classNames(
        'inconel-button',
        `inconel-button--${variant}`,
        fullWidth && 'inconel-button--full-width',
        loading && 'inconel-is-loading',
        className,
      )}
    >
      {loading && <span className="inconel-button__spinner" aria-hidden="true" />}
      {children}
    </button>
  )
}
