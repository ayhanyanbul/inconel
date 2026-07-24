import type { ReactNode } from 'react'

import { CheckboxGroup } from '../CheckboxGroup'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface MultiSelectOption<T extends string | number = string> {
  label: ReactNode
  value: T
  disabled?: boolean
}

export interface MultiSelectProps<T extends string | number = string> {
  options: MultiSelectOption<T>[]
  value?: T[]
  onChange?: (value: T[]) => void
  label?: ReactNode
  className?: string
}

export function MultiSelect<T extends string | number = string>({
  options,
  value = [],
  onChange,
  label,
  className,
}: MultiSelectProps<T>) {
  return (
    <fieldset className={classNames('inconel-multi-select', className)}>
      {label && <legend>{label}</legend>}
      <CheckboxGroup options={options} value={value} onChange={onChange} />
    </fieldset>
  )
}
