import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'

import FieldFeedback from '../FieldFeedback/FieldFeedback'
import type { FieldFeedbackContentProps } from '../FieldFeedback/FieldFeedback'
import '../shared/field.css'
import '../shared/field-controls.css'
import '../shared/sizes.css'
import type { ControlSize } from '../shared/types'
import './styles.css'
import {
  applyInputMask,
  formatInputValue,
  getInputSeparators,
  isFormattedInputType,
  isLengthValidatedInputType,
  parseInputNumber,
  roundInputNumber,
  validateInputValue,
} from './utils'

export type InputType =
  | 'text'
  | 'number'
  | 'currency'
  | 'percent'
  | 'phone'
  | 'email'
  | 'password'

export type InputRoundMode = 'ceil' | 'floor' | 'round'
export type InputValue = string | number | null
export type InputEventType =
  | 'change'
  | 'blur'
  | 'focus'
  | 'keydown'
  | 'mouseenter'
  | 'mouseleave'
  | 'clear'

export interface InputPayload {
  rawValue: InputValue
  formattedValue: string
  error: boolean
  char: string | null
  eventType: InputEventType
}

export interface InputValidationMessages {
  required?: string
  invalidNumber?: string
  minNumber?: string
  maxNumber?: string
  minLength?: string
  maxLength?: string
  invalidPhone?: string
  invalidEmail?: string
}

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'onFocus'
  | 'onKeyDown'
  | 'onMouseEnter'
  | 'onMouseLeave'
  | 'min'
  | 'max'
  | 'size'
  | 'readOnly'
>

export interface InputProps extends NativeInputProps, FieldFeedbackContentProps {
  label?: string
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  fullWidth?: boolean
  inputClassName?: string
  labelClassName?: string
  value?: InputValue
  defaultValue?: InputValue
  onChange?: (payload: InputPayload) => void
  onBlur?: (payload: InputPayload, event: FocusEvent<HTMLInputElement>) => void
  onFocus?: (payload: InputPayload, event: FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (
    payload: InputPayload,
    event: KeyboardEvent<HTMLInputElement>,
  ) => void
  onMouseEnter?: (
    payload: InputPayload,
    event: MouseEvent<HTMLInputElement>,
  ) => void
  onMouseLeave?: (
    payload: InputPayload,
    event: MouseEvent<HTMLInputElement>,
  ) => void
  type?: InputType
  locale?: string
  currency?: string
  decimalScale?: number
  roundMode?: InputRoundMode
  roundOnBlur?: boolean
  min?: number
  max?: number
  allowNegative?: boolean
  debounceMs?: number
  validateOnSubmit?: boolean
  validationMessages?: InputValidationMessages
  mask?: string
  limit?: number
  isClearable?: boolean
  readOnly?: boolean
  clearButtonLabel?: string
  readOnlyEmptyValue?: ReactNode
  size?: ControlSize
  variant?: 'outlined' | 'plain'
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    hint,
    errorMessage,
    startAdornment,
    endAdornment,
    fullWidth = false,
    inputClassName,
    labelClassName,
    className,
    required,
    disabled,
    value,
    defaultValue = '',
    onChange,
    onBlur,
    onFocus,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    type = 'text',
    locale = 'tr-TR',
    currency = 'TRY',
    decimalScale = 0,
    roundMode = 'floor',
    roundOnBlur = false,
    min,
    max,
    allowNegative = false,
    debounceMs = 0,
    validateOnSubmit = false,
    validationMessages,
    mask,
    limit,
    isClearable = false,
    readOnly = false,
    clearButtonLabel,
    readOnlyEmptyValue = null,
    size = 'md',
    variant = 'outlined',
    autoComplete = 'off',
    'aria-describedby': ariaDescribedBy,
    ...inputProps
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? `inconel-input-${generatedId.replace(/:/g, '')}`
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const controlled = value !== undefined
  const [localValue, setLocalValue] = useState<InputValue>(defaultValue)
  const currentValue = controlled ? value : localValue
  const [editingValue, setEditingValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messages = validationMessages ?? {}
  const visibleError = errorMessage ?? validationError

  const validate = (candidate: InputValue) =>
    validateInputValue(candidate, {
      required: Boolean(required),
      type,
      min,
      max,
      mask,
      messages,
    })

  const formattedValue = useMemo(
    () =>
      formatInputValue(
        currentValue,
        type,
        locale,
        decimalScale,
        currency,
        mask,
      ),
    [currentValue, currency, decimalScale, locale, mask, type],
  )

  const buildPayload = (
    rawValue: InputValue,
    eventType: InputEventType,
    char: string | null = null,
  ): InputPayload => ({
    rawValue,
    formattedValue: formatInputValue(
      rawValue,
      type,
      locale,
      decimalScale,
      currency,
      mask,
    ),
    error: Boolean(validate(rawValue)),
    char,
    eventType,
  })

  const emitChange = (payload: InputPayload, immediate = false) => {
    if (!controlled) setLocalValue(payload.rawValue)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!onChange) return
    if (immediate || debounceMs <= 0) onChange(payload)
    else debounceRef.current = setTimeout(() => onChange(payload), debounceMs)
  }

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  useEffect(() => {
    if (validateOnSubmit) setValidationError(validate(currentValue))
    // Validation intentionally runs when submit state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateOnSubmit])

  const normalize = (text: string): InputValue => {
    if (type === 'phone' && mask) return text.replace(/\D/g, '')
    if (isFormattedInputType(type)) {
      const parsed = parseInputNumber(text, locale)
      if (parsed === null) return text === '' ? null : text
      return allowNegative ? parsed : Math.abs(parsed)
    }
    return text
  }

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '')
    if (
      limit &&
      (isFormattedInputType(type) || type === 'phone') &&
      digits.length > limit
    ) return
    if (limit && isLengthValidatedInputType(type) && text.length > limit) return
    const rawValue = normalize(text)
    if (typeof rawValue === 'number') {
      if (typeof min === 'number' && rawValue < min) return
      if (typeof max === 'number' && rawValue > max) return
    }
    setEditingValue(
      type === 'phone' && mask ? applyInputMask(rawValue, mask) : text,
    )
    emitChange(buildPayload(rawValue, 'change', text.slice(-1) || null))
  }

  const describedBy = [
    ariaDescribedBy,
    hint && !visibleError ? hintId : undefined,
    visibleError ? errorId : undefined,
  ].filter(Boolean).join(' ') || undefined

  if (readOnly) {
    return (
      <div className={['inconel-field', `inconel-size-${size}`, fullWidth ? 'inconel-field--full-width' : '', className ?? ''].join(' ')}>
        {label && <span className={['inconel-field__label', labelClassName ?? ''].join(' ')}>{label}</span>}
        <div className="inconel-input-readonly" aria-label={label}>
          {formattedValue || readOnlyEmptyValue}
        </div>
      </div>
    )
  }

  return (
    <div className={['inconel-field', `inconel-size-${size}`, fullWidth ? 'inconel-field--full-width' : '', className ?? ''].join(' ')}>
      {label && (
        <label className={['inconel-field__label', labelClassName ?? ''].join(' ')} htmlFor={inputId}>
          {label}{required && <span className="inconel-field__required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={['inconel-input-control', variant === 'plain' ? 'inconel-input-control--plain' : '', visibleError ? 'inconel-is-invalid' : '', disabled ? 'inconel-is-disabled' : ''].join(' ')}>
        {startAdornment && <span className="inconel-input-adornment" aria-hidden="true">{startAdornment}</span>}
        <input
          {...inputProps}
          ref={ref}
          id={inputId}
          type={type === 'password' || type === 'email' ? type : 'text'}
          inputMode={isFormattedInputType(type) ? 'decimal' : type === 'phone' ? 'tel' : undefined}
          value={focused ? editingValue : formattedValue}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(visibleError)}
          aria-describedby={describedBy}
          className={['inconel-input', inputClassName ?? ''].join(' ')}
          onChange={(event) => handleChange(event.target.value)}
          onFocus={(event) => {
            if (disabled) return
            setFocused(true)
            const editValue = type === 'phone' && mask
              ? applyInputMask(currentValue, mask)
              : isFormattedInputType(type)
                ? String(currentValue ?? '').replace('.', getInputSeparators(locale).decimal)
                : String(currentValue ?? '')
            setEditingValue(editValue)
            onFocus?.(buildPayload(currentValue, 'focus'), event)
          }}
          onBlur={(event) => {
            setFocused(false)
            if (debounceRef.current) clearTimeout(debounceRef.current)
            let rawValue = normalize(editingValue)
            if (typeof rawValue === 'number') {
              rawValue = roundInputNumber(rawValue, decimalScale, roundOnBlur ? roundMode : 'floor')
            }
            setValidationError(validate(rawValue))
            const payload = buildPayload(rawValue, 'blur')
            emitChange(payload, true)
            onBlur?.(payload, event)
          }}
          onKeyDown={(event) => {
            if (!allowNegative && (event.key === '-' || event.key === 'Subtract')) event.preventDefault()
            onKeyDown?.(buildPayload(currentValue, 'keydown', event.key), event)
          }}
          onMouseEnter={(event) => onMouseEnter?.(buildPayload(currentValue, 'mouseenter'), event)}
          onMouseLeave={(event) => onMouseLeave?.(buildPayload(currentValue, 'mouseleave'), event)}
        />
        {isClearable && !disabled && formattedValue && clearButtonLabel && (
          <button
            type="button"
            className="inconel-input-clear"
            aria-label={clearButtonLabel}
            onClick={() => {
              setEditingValue('')
              setValidationError(validate(null))
              emitChange(buildPayload(null, 'clear'), true)
            }}
          >
            ×
          </button>
        )}
        {endAdornment && <span className="inconel-input-adornment" aria-hidden="true">{endAdornment}</span>}
      </div>
      <FieldFeedback
        hint={hint}
        errorMessage={visibleError}
        hintId={hintId}
        errorId={errorId}
      />
    </div>
  )
})

export default Input
