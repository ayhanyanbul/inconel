import type { ReactNode } from 'react'

import { Checkbox } from '../Checkbox'

import { classNames } from '../shared/classNames'
import './styles.css'
import { toggleArrayValue } from './utils'

export interface CheckboxOption<T extends string | number = string> {
  label: ReactNode
  value: T
  disabled?: boolean
}

export interface CheckboxGroupProps<T extends string | number = string> {
  options: CheckboxOption<T>[]
  value?: T[]
  onChange?: (value: T[]) => void
  name?: string
  className?: string
}

export function CheckboxGroup<T extends string | number = string>({
  options,
  value = [],
  onChange,
  name,
  className,
}: CheckboxGroupProps<T>) {
  const toggle = (optionValue: T) =>
    onChange?.(toggleArrayValue(value, optionValue))

  return (
    <div className={classNames('inconel-checkbox-group', className)}>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          name={name}
          label={option.label}
          value={option.value}
          checked={value.includes(option.value)}
          disabled={option.disabled}
          onChange={() => toggle(option.value)}
        />
      ))}
    </div>
  )
}
