import {
  useEffect,
  useMemo,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'

import { classNames } from '../shared/classNames'
import '../shared/sizes.css'
import type { ControlSize } from '../shared/types'
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
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning' | 'dark'
  size?: ControlSize
  pill?: boolean
  count?: ReactNode
  progress?: number | null
  progressColor?: string | null
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
  size = 'md',
  pill = false,
  count,
  progress,
  progressColor,
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
  const progressWidth =
    typeof progress === 'number' ? Math.max(0, Math.min(100, progress)) : null
  const iconNode = typeof icon === 'string' && icon ? (
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
        renumerateIRIElements={false}
        loading={() => null}
        fallback={() => null}
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
        `inconel-size-${size}`,
        BUTTON_TYPE_CLASS_NAMES[resolvedType],
        fullWidth && 'inconel-button--full-width',
        progressWidth !== null && 'inconel-button--has-progress',
        pill && 'inconel-button--pill',
        loading && 'inconel-is-loading',
        disabled && 'inconel-is-disabled',
        isActive && 'inconel-is-active',
        className,
      )}
    >
      {progressWidth !== null && (
        <span
          className="inconel-button__progress"
          style={{
            width: `${progressWidth}%`,
            background: progressColor ?? undefined,
          }}
        />
      )}
      {loading && <span className="inconel-button__spinner" aria-hidden="true" />}
      {!iconRight && iconNode}
      {content !== undefined && (
        <span className="inconel-button__title">{content}</span>
      )}
      {iconRight && iconNode}
      {count != null && <span className="inconel-button__count">{count}</span>}
    </button>
  )
}
