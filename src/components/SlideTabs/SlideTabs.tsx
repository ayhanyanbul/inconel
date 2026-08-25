import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface SlideTab {
  key: string | number
  label: ReactNode
  count?: ReactNode
  show?: boolean
}

export interface SlideTabsProps {
  tabs?: SlideTab[]
  activeKey?: string | number | null
  onChange?: (key: string | number) => void
  className?: string | null
  fullWidth?: boolean
}

export function SlideTabs({
  tabs = [],
  activeKey,
  onChange,
  className,
  fullWidth = false,
}: SlideTabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const visibleTabs = useMemo(
    () => tabs.filter((tab) => tab.show !== false),
    [tabs],
  )
  const active =
    visibleTabs.find((tab) => tab.key === activeKey) ?? visibleTabs[0]

  useEffect(() => {
    if (!active) return
    const element = refs.current[String(active.key)]
    if (element) {
      setIndicator({ left: element.offsetLeft, width: element.offsetWidth })
    }
  }, [active, visibleTabs])

  if (!visibleTabs.length) return null

  return (
    <div
      className={classNames(
        'inconel-slide-tabs',
        fullWidth && 'inconel-slide-tabs--full-width',
        className,
      )}
    >
      <div
        className="inconel-slide-tabs__indicator"
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.left}px)`,
        }}
      />
      {visibleTabs.map((tab) => (
        <button
          key={tab.key}
          ref={(element) => {
            refs.current[String(tab.key)] = element
          }}
          type="button"
          className={classNames(
            'inconel-slide-tabs__item',
            active.key === tab.key && 'inconel-is-active',
          )}
          onClick={() => onChange?.(tab.key)}
        >
          {tab.label}
          {typeof tab.count === 'number' && tab.count > 0 && (
            <span className="inconel-slide-tabs__count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
