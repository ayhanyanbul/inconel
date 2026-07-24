import type { HTMLAttributes, ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'
import { DEFAULT_READ_ONLY_EMPTY_VALUE } from './constants'

export interface ReadOnlyProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  value?: ReactNode
  emptyValue?: ReactNode
}

export function ReadOnly({
  label,
  value,
  emptyValue = DEFAULT_READ_ONLY_EMPTY_VALUE,
  className,
  ...props
}: ReadOnlyProps) {
  return (
    <div {...props} className={classNames('inconel-read-only', className)}>
      {label && <span className="inconel-read-only__label">{label}</span>}
      <span className="inconel-read-only__value">
        {value === null || value === undefined || value === '' ? emptyValue : value}
      </span>
    </div>
  )
}
