import {
  FORMATTED_INPUT_TYPES,
  LENGTH_VALIDATED_INPUT_TYPES,
} from './constants'
import type {
  InputRoundMode,
  InputType,
  InputValidationMessages,
  InputValue,
} from './Input'

export interface InputValidationOptions {
  required: boolean
  type: InputType
  min?: number
  max?: number
  mask?: string
  messages: InputValidationMessages
}

export function isFormattedInputType(type: InputType) {
  return FORMATTED_INPUT_TYPES.some((candidate) => candidate === type)
}

export function isLengthValidatedInputType(type: InputType) {
  return LENGTH_VALIDATED_INPUT_TYPES.some((candidate) => candidate === type)
}

export function getInputSeparators(locale: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(1000.1)
  return {
    group: parts.find((part) => part.type === 'group')?.value ?? '.',
    decimal: parts.find((part) => part.type === 'decimal')?.value ?? ',',
  }
}

export function parseInputNumber(value: string, locale: string): number | null {
  if (!value || value === '-') return null
  const { group, decimal } = getInputSeparators(locale)
  const normalized = value.split(group).join('').replace(decimal, '.')
  const result = Number(normalized)
  return Number.isNaN(result) ? null : result
}

export function roundInputNumber(
  value: number,
  scale: number,
  mode: InputRoundMode,
) {
  const factor = 10 ** scale
  if (mode === 'ceil') return Math.ceil(value * factor) / factor
  if (mode === 'round') return Math.round(value * factor) / factor
  return value >= 0
    ? Math.floor(value * factor) / factor
    : Math.ceil(value * factor) / factor
}

export function applyInputMask(value: InputValue, mask: string) {
  const digits = String(value ?? '').replace(/\D/g, '')
  let index = 0
  let result = ''

  for (const character of mask) {
    if (character === 'X') {
      if (index >= digits.length) break
      result += digits[index++]
    } else if (index < digits.length) {
      result += character
    }
  }

  return result
}

export function formatInputValue(
  value: InputValue,
  type: InputType,
  locale: string,
  decimalScale: number,
  currency: string,
  mask?: string,
) {
  if (value === null || value === undefined || value === '') return ''
  if (type === 'phone' && mask) return applyInputMask(value, mask)
  if (!isFormattedInputType(type)) return String(value)
  if (typeof value !== 'number' || Number.isNaN(value)) return String(value)

  return new Intl.NumberFormat(locale, {
    style:
      type === 'currency'
        ? 'currency'
        : type === 'percent'
          ? 'percent'
          : 'decimal',
    currency: type === 'currency' ? currency : undefined,
    minimumFractionDigits: decimalScale,
    maximumFractionDigits: decimalScale,
  }).format(value)
}

export function validateInputValue(
  candidate: InputValue,
  {
    required,
    type,
    min,
    max,
    mask,
    messages,
  }: InputValidationOptions,
) {
  if (
    required &&
    (candidate === null || candidate === undefined || candidate === '')
  ) {
    return messages.required ?? null
  }
  if (candidate === null || candidate === undefined || candidate === '') {
    return null
  }
  if (
    type === 'email' &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(candidate))
  ) {
    return messages.invalidEmail ?? null
  }
  if (type === 'phone') {
    const digits = String(candidate).replace(/\D/g, '')
    const expected = mask
      ? (mask.match(/X/g) ?? []).length
      : digits.startsWith('0')
        ? 11
        : 10
    if (digits.length !== expected) return messages.invalidPhone ?? null
  }
  if (isLengthValidatedInputType(type)) {
    if (typeof min === 'number' && String(candidate).length < min) {
      return messages.minLength?.replace('{min}', String(min)) ?? null
    }
    if (typeof max === 'number' && String(candidate).length > max) {
      return messages.maxLength?.replace('{max}', String(max)) ?? null
    }
  }
  if (isFormattedInputType(type)) {
    if (typeof candidate !== 'number' || Number.isNaN(candidate)) {
      return messages.invalidNumber ?? null
    }
    if (typeof min === 'number' && candidate < min) {
      return messages.minNumber?.replace('{min}', String(min)) ?? null
    }
    if (typeof max === 'number' && candidate > max) {
      return messages.maxNumber?.replace('{max}', String(max)) ?? null
    }
  }
  return null
}
