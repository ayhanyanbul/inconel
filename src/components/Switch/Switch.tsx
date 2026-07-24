import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: ReactNode
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void
  onLabel?: ReactNode
  offLabel?: ReactNode
}

export function Switch({
  label,
  onLabel,
  offLabel,
  checked,
  defaultChecked,
  onChange,
  className,
  ...props
}: SwitchProps) {
  return (
    <label className={classNames('inconel-switch', className)}>
      {label && <span className="inconel-switch__label">{label}</span>}
      <input
        {...props}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(event) => onChange?.(event.target.checked, event)}
      />
      <span className="inconel-switch__track">
        <span className="inconel-switch__thumb" />
      </span>
      {(onLabel || offLabel) && (
        <span className="inconel-switch__state">
          {checked ? onLabel : offLabel}
        </span>
      )}
    </label>
  )
}
