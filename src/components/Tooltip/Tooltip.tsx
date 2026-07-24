import type { ReactElement, ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface TooltipProps {
  content: ReactNode
  children: ReactElement
  placement?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  className,
}: TooltipProps) {
  return (
    <span
      className={classNames(
        'inconel-tooltip',
        `inconel-tooltip--${placement}`,
        className,
      )}
    >
      {children}
      <span className="inconel-tooltip__content" role="tooltip">
        {content}
      </span>
    </span>
  )
}
