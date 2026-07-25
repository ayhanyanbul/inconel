import {
  useEffect,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface CustomizableSwitchProps {
  id?: string | null
  className?: string | null
  onClick?: (checked: boolean) => void
  isChecked?: boolean
  disabled?: boolean
  render?: boolean
  children?: ReactNode
}

export function CustomizableSwitch({
  id,
  className,
  onClick,
  isChecked = true,
  disabled = false,
  render = true,
  children,
}: CustomizableSwitchProps) {
  const [checked, setChecked] = useState(isChecked)
  const childList = Array.isArray(children) ? children : [children]

  useEffect(() => setChecked(isChecked), [isChecked])

  if (!render) return null

  const toggle = () => {
    if (disabled) return
    const next = !checked
    setChecked(next)
    onClick?.(next)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <div
      id={id ?? undefined}
      className={classNames(
        'inconel-customizable-switch',
        checked && 'inconel-is-checked',
        disabled && 'inconel-is-disabled',
        className,
      )}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      onKeyDown={handleKeyDown}
    >
      <div className="inconel-customizable-switch__background">
        {childList[1]}
      </div>
      <div className="inconel-customizable-switch__marker">
        {childList[0]}
        <div className="inconel-customizable-switch__button" />
      </div>
    </div>
  )
}
