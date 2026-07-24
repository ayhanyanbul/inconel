export function formatDateValue(value?: string | Date | null) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value ?? ''
}
