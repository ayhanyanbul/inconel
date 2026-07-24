import { useState, type ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface TabsItem {
  id: string
  label: ReactNode
  content?: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  items: TabsItem[]
  value?: string
  defaultValue?: string
  onChange?: (id: string) => void
  className?: string
}

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items[0]?.id,
  )
  const activeValue = value ?? internalValue
  const active = items.find((item) => item.id === activeValue)

  return (
    <div className={classNames('inconel-tabs', className)}>
      <div className="inconel-tabs__list" role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            disabled={item.disabled}
            aria-selected={item.id === activeValue}
            className={classNames(
              'inconel-tabs__tab',
              item.id === activeValue && 'inconel-is-active',
            )}
            onClick={() => {
              setInternalValue(item.id)
              onChange?.(item.id)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {active?.content !== undefined && (
        <div className="inconel-tabs__panel" role="tabpanel">
          {active.content}
        </div>
      )}
    </div>
  )
}
