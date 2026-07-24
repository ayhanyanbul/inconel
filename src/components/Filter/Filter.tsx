import type { HTMLAttributes, ReactNode } from 'react'

import { Button } from '../Button'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface FilterProps extends HTMLAttributes<HTMLDivElement> {
  onClear?: () => void
  clearLabel?: ReactNode
}

export function Filter({
  children,
  onClear,
  clearLabel = 'Temizle',
  className,
  ...props
}: FilterProps) {
  return (
    <div {...props} className={classNames('inconel-filter', className)}>
      <div className="inconel-filter__content">{children}</div>
      {onClear && (
        <Button type="button" variant="ghost" onClick={onClear}>
          {clearLabel}
        </Button>
      )}
    </div>
  )
}
