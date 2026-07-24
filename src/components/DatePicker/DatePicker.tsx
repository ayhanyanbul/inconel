import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'
import { formatDateValue } from './utils'

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: string | Date | null
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  label?: ReactNode
}

export function DatePicker({
  value,
  onChange,
  label,
  className,
  ...props
}: DatePickerProps) {
  const formatted = formatDateValue(value)
  return (
    <label className={classNames('inconel-date-picker', className)}>
      {label && <span className="inconel-field__label">{label}</span>}
      <input
        {...props}
        type="date"
        value={formatted}
        onChange={(event) => onChange?.(event.target.value, event)}
      />
    </label>
  )
}
