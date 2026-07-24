import type { HTMLAttributes } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'
import { DEFAULT_DOT_LOADER_LABEL } from './constants'

export interface DotLoaderProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string
}

export function DotLoader({
  label = DEFAULT_DOT_LOADER_LABEL,
  className,
  ...props
}: DotLoaderProps) {
  return (
    <span
      {...props}
      className={classNames('inconel-dot-loader', className)}
      role="status"
      aria-label={label}
    >
      <i />
      <i />
      <i />
    </span>
  )
}
