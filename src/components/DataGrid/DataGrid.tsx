import { useMemo, type CSSProperties, type ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'
import { formatGridValue } from './utils'

export interface DataGridItem {
  label: ReactNode
  value?: unknown
  key?: string
  valueClass?: string
  customValue?: ReactNode
}

export interface DataGridProps {
  data?: DataGridItem[]
  columns?: 2 | 4
  size?: 'default' | 'compact' | 'spacious'
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  loading?: boolean
  className?: string
  labelWidth?: string
  onItemClick?: (item: DataGridItem, index: number) => void
}

export function DataGrid({
  data = [],
  columns = 2,
  size = 'default',
  striped = false,
  hoverable = false,
  bordered = false,
  loading = false,
  className,
  labelWidth,
  onItemClick,
}: DataGridProps) {
  const style = useMemo(
    () =>
      labelWidth
        ? ({ '--inconel-data-grid-label-width': labelWidth } as CSSProperties)
        : undefined,
    [labelWidth],
  )

  return (
    <div
      className={classNames(
        'inconel-data-grid',
        `inconel-data-grid--${columns}-col`,
        size !== 'default' && `inconel-data-grid--${size}`,
        striped && 'inconel-data-grid--striped',
        hoverable && 'inconel-data-grid--hoverable',
        bordered && 'inconel-data-grid--bordered',
        loading && 'inconel-is-loading',
        className,
      )}
      style={style}
    >
      <div className="inconel-data-grid__container">
        {data.map((item, index) => (
          <div
            key={item.key ?? index}
            className="inconel-data-grid__item"
            onClick={() => onItemClick?.(item, index)}
            onKeyDown={(event) => {
              if (onItemClick && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                onItemClick(item, index)
              }
            }}
            role={onItemClick ? 'button' : undefined}
            tabIndex={onItemClick ? 0 : undefined}
          >
            <div className="inconel-data-grid__label">{item.label}</div>
            <div
              className={classNames(
                'inconel-data-grid__value',
                item.valueClass,
              )}
            >
              {item.customValue ?? formatGridValue(item.value)}
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="inconel-data-grid__loading" role="status">
          <div
            className="inconel-data-grid__loading-spinner"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}
