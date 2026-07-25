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
  items?: TabsItem[]
  tabData?: Array<{ label?: ReactNode; content?: ReactNode }>
  initialTab?: string | number | null
  value?: string
  defaultValue?: string
  onChange?: (id: string) => void
  className?: string
}

export function Tabs({
  items,
  tabData,
  initialTab,
  value,
  defaultValue,
  onChange,
  className,
}: TabsProps) {
  const resolvedItems =
    items ??
    tabData?.map((item, index) => ({
      id: String(index),
      label: item.label,
      content: item.content,
      disabled: false,
    })) ??
    []
  const initialValue =
    defaultValue ??
    (initialTab !== null && initialTab !== undefined
      ? String(initialTab)
      : resolvedItems[0]?.id)
  const [internalValue, setInternalValue] = useState(initialValue)
  const activeValue = value ?? internalValue
  const active = resolvedItems.find((item) => item.id === activeValue)

  return (
    <div className={classNames('inconel-tabs', className)}>
      <div className="inconel-tabs__list" role="tablist">
        {resolvedItems.map((item) => (
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
