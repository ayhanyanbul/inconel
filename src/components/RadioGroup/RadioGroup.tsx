import type { ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface RadioOption<T extends string | number = string> {
  label: ReactNode
  value: T
  disabled?: boolean
}

export interface RadioGroupProps<T extends string | number = string> {
  options: RadioOption<T>[]
  value?: T
  onChange?: (value: T) => void
  name: string
  className?: string
}

export function RadioGroup<T extends string | number = string>({
  options,
  value,
  onChange,
  name,
  className,
}: RadioGroupProps<T>) {
  return (
    <div className={classNames('inconel-radio-group', className)}>
      {options.map((option) => (
        <label className="inconel-radio" key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            disabled={option.disabled}
            onChange={() => onChange?.(option.value)}
          />
          <span className="inconel-radio__control" aria-hidden="true" />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}
