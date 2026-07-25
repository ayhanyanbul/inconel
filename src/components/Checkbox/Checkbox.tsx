import {
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'name'> {
  id?: string | number | null
  name?: string | number | null
  label?: ReactNode
  labelClassName?: string
  readOnly?: boolean
  errorMessage?: ReactNode
  labelTitle?: string
  indeterminate?: boolean
}

export function Checkbox({
  label,
  id,
  name,
  labelClassName,
  readOnly = false,
  errorMessage,
  labelTitle,
  indeterminate = false,
  className,
  disabled,
  onChange,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const inputId = String(id ?? `inconel-checkbox-${generatedId.replace(/:/g, '')}`)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <div
      className={classNames(
        'inconel-checkbox',
        disabled && 'inconel-is-disabled',
        className,
      )}
    >
      <label className="inconel-checkbox__container" htmlFor={inputId}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          name={name === null || name === undefined ? undefined : String(name)}
          type="checkbox"
          disabled={disabled}
          title={labelTitle}
          onChange={readOnly ? undefined : onChange}
        />
        <span className="inconel-checkbox__control" aria-hidden="true" />
        {label && (
          <span
            className={classNames(
              'inconel-checkbox__label',
              labelClassName,
            )}
            title={labelTitle}
          >
            {label}
          </span>
        )}
      </label>
      {errorMessage && (
        <span className="inconel-checkbox__error" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  )
}
