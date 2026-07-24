import { useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  indeterminate?: boolean
}

export function Checkbox({
  label,
  indeterminate = false,
  className,
  ...props
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className={classNames('inconel-checkbox', className)}>
      <input {...props} ref={ref} type="checkbox" />
      <span className="inconel-checkbox__control" aria-hidden="true" />
      {label && <span className="inconel-checkbox__label">{label}</span>}
    </label>
  )
}
