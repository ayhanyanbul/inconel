import type { HTMLAttributes, ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface OptionProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean
  disabled?: boolean
  icon?: ReactNode
}

export function Option({
  selected,
  disabled,
  icon,
  children,
  className,
  ...props
}: OptionProps) {
  return (
    <div
      {...props}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      className={classNames(
        'inconel-option',
        selected && 'inconel-is-selected',
        disabled && 'inconel-is-disabled',
        className,
      )}
    >
      {icon && <span className="inconel-option__icon">{icon}</span>}
      {children}
    </div>
  )
}

