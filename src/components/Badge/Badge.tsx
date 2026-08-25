import type { HTMLAttributes, ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import type { ControlSize } from '../shared/types'
import './styles.css'

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'dark'
  | 'warning'
  | 'danger'
  | 'success'
  | 'light'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  text?: ReactNode
  variant?: BadgeVariant
  size?: ControlSize
}

export function Badge({
  text,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={classNames(
        'inconel-badge',
        `inconel-badge--${variant}`,
        `inconel-badge--${size}`,
        className,
      )}
    >
      {text ?? children}
    </span>
  )
}
