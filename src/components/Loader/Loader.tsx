import type { HTMLAttributes } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'
import { DEFAULT_LOADER_LABEL } from './constants'

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  fullscreen?: boolean
}

export function Loader({
  label = DEFAULT_LOADER_LABEL,
  fullscreen = false,
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      {...props}
      className={classNames(
        'inconel-loader',
        fullscreen && 'inconel-loader--fullscreen',
        className,
      )}
      role="status"
      aria-label={label}
    >
      <span className="inconel-loader__spinner" aria-hidden="true" />
    </div>
  )
}
