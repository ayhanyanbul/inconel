import {
  useEffect,
  useMemo,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'

import { classNames } from '../shared/classNames'
import { Svg } from '../Svg'
import {
  BUTTON_TYPE_CLASS_NAMES,
  type ButtonType,
} from './constants'
import './styles.css'
import { createDebouncedCallback } from './utils'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  label?: ReactNode
  buttonType?: ButtonType
  icon?: string | null
  iconClassName?: string
  iconWidth?: number | null
  iconHeight?: number | null
  iconRight?: boolean
  render?: boolean
  debounceTime?: number | null
  isActive?: boolean | null
  onChange?: ButtonHTMLAttributes<HTMLButtonElement>['onChange']
  loading?: boolean
  fullWidth?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export function Button({
  loading = false,
  fullWidth = false,
  variant = 'primary',
  label,
  buttonType,
  icon,
  iconClassName,
  iconWidth,
  iconHeight,
  iconRight = false,
  render = true,
  debounceTime,
  isActive,
  onClick,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const resolvedType = buttonType ?? variant
  const debouncedClick = useMemo(
    () => createDebouncedCallback(onClick, debounceTime ?? 0),
    [onClick, debounceTime],
  )

  useEffect(() => () => debouncedClick.cancel(), [debouncedClick])

  if (!render) return null

  const content = label ?? children
  const iconNode = icon ? (
    <span
      className={classNames(
        'inconel-button__icon',
        iconRight
          ? 'inconel-button__icon--right'
          : 'inconel-button__icon--left',
        iconClassName,
      )}
      style={{ width: iconWidth ?? undefined, height: iconHeight ?? undefined }}
      aria-hidden="true"
    >
      <Svg
        src={icon}
        beforeInjection={(svg) => {
          if (iconWidth) svg.setAttribute('width', String(iconWidth))
          if (iconHeight) svg.setAttribute('height', String(iconHeight))
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        }}
      />
    </span>
  ) : null

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-pressed={
        typeof isActive === 'boolean' ? isActive : props['aria-pressed']
      }
      onClick={disabled || loading ? undefined : debouncedClick}
      className={classNames(
        'inconel-button',
        BUTTON_TYPE_CLASS_NAMES[resolvedType],
        fullWidth && 'inconel-button--full-width',
        loading && 'inconel-is-loading',
        disabled && 'inconel-is-disabled',
        isActive && 'inconel-is-active',
        className,
      )}
    >
      {loading && <span className="inconel-button__spinner" aria-hidden="true" />}
      {!iconRight && iconNode}
      {content !== undefined && (
        <span className="inconel-button__title">{content}</span>
      )}
      {iconRight && iconNode}
    </button>
  )
}
