import type { HTMLAttributes } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface LoaderMiniProps extends HTMLAttributes<HTMLDivElement> {
  show?: boolean
}

export function LoaderMini({
  show = false,
  className,
  ...props
}: LoaderMiniProps) {
  if (!show) return null

  return (
    <div
      {...props}
      className={classNames('inconel-loader-mini', className)}
      role="status"
    >
      <div className="inconel-loader-mini__donut" aria-hidden="true" />
    </div>
  )
}
