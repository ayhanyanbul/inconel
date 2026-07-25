import {
  useId,
  type ChangeEvent,
  type FocusEventHandler,
  type ReactNode,
} from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface SwitchProps {
  id?: string
  name?: string | null
  className?: string | null
  isChecked?: boolean
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  sizing?: 'small' | 'medium' | 'large' | string
  color?: string
  markerVals?: [ReactNode, ReactNode] | ReactNode[]
  label?: ReactNode
  onLabel?: ReactNode
  offLabel?: ReactNode
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onCheckedChange?: (
    checked: boolean,
    event: ChangeEvent<HTMLInputElement>,
  ) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  render?: boolean
}

export function Switch({
  id,
  name,
  className,
  isChecked,
  checked,
  defaultChecked,
  disabled = false,
  sizing = 'small',
  color = 'black',
  markerVals,
  label,
  onLabel,
  offLabel,
  onChange,
  onCheckedChange,
  onBlur,
  render = true,
}: SwitchProps) {
  const generatedId = useId()
  const inputId = id ?? `inconel-switch-${generatedId.replace(/:/g, '')}`
  const resolvedChecked = isChecked ?? checked

  if (!render) return null

  return (
    <div
      className={classNames(
        'inconel-switch',
        `inconel-switch--${sizing}`,
        `inconel-switch--${color}`,
        resolvedChecked && 'inconel-is-selected',
        disabled && 'inconel-is-disabled',
        className,
      )}
    >
      {label && <span className="inconel-switch__label">{label}</span>}
      <input
        type="checkbox"
        id={inputId}
        name={name ?? undefined}
        checked={resolvedChecked}
        defaultChecked={resolvedChecked === undefined ? defaultChecked : undefined}
        disabled={disabled}
        onChange={(event) => {
          onChange?.(event)
          onCheckedChange?.(event.target.checked, event)
        }}
        onBlur={onBlur}
      />
      <label className="inconel-switch__track" htmlFor={inputId}>
        <span className="inconel-switch__thumb" />
      </label>
      <span className="inconel-switch__state">
        {markerVals
          ? markerVals[resolvedChecked ? 1 : 0]
          : resolvedChecked
            ? onLabel
            : offLabel}
      </span>
    </div>
  )
}
