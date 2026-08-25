import {
  useId,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
} from 'react'

import { classNames } from '../shared/classNames'
import { ReadOnly } from '../ReadOnly'
import './styles.css'

export interface InputRadioProps {
  id?: string | number | null
  name?: string | number | null
  value?: string | number | null
  className?: string | null
  labelClassName?: string | null
  inputClassName?: string | null
  placeholder?: string
  isSelected?: boolean
  label?: ReactNode
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  disabled?: boolean
  readOnly?: boolean
  render?: boolean
}

export function InputRadio({
  id,
  name,
  value,
  className,
  labelClassName,
  inputClassName,
  placeholder,
  isSelected = false,
  label,
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  render = true,
}: InputRadioProps) {
  const generatedId = useId()
  const inputId = String(id ?? `inconel-input-radio-${generatedId.replace(/:/g, '')}`)

  if (!render) return null

  return (
    <div
      className={classNames(
        'inconel-input-radio',
        isSelected && 'inconel-is-selected',
        disabled && 'inconel-is-disabled',
        className,
      )}
    >
      {readOnly ? (
        <ReadOnly value={value} />
      ) : (
        <>
          <input
            id={inputId}
            className={classNames('inconel-input-radio__input', inputClassName)}
            type="radio"
            name={name === null || name === undefined ? undefined : String(name)}
            value={value ?? ''}
            placeholder={placeholder}
            checked={isSelected}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
          />
          <span className="inconel-input-radio__control" aria-hidden="true" />
        </>
      )}
      {label && (
        <label
          className={classNames('inconel-input-radio__label', labelClassName)}
          htmlFor={readOnly ? undefined : inputId}
        >
          {label}
        </label>
      )}
    </div>
  )
}
