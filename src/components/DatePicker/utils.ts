export type DateInput = Date | string | number | null | undefined

export function normalizeDate(value: DateInput) {
  if (value === null || value === undefined || value === '') return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export interface ClearedDateOptions {
  isClearable: boolean
  notNull: boolean
  defaultDate: boolean
  initialDate?: Date | null
  fallbackDate?: Date | null
}

export function resolveClearedDate(
  value: Date | null,
  options: ClearedDateOptions,
) {
  if (value !== null) return value
  if (options.isClearable) return null
  if (!options.notNull) return null
  if (options.defaultDate && options.fallbackDate) return options.fallbackDate
  if (options.initialDate) return options.initialDate
  return new Date()
}
