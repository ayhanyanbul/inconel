import { useInconelAdapters } from '../adapters'

export function defineMessages<T extends Record<string, unknown>>(messages: T) {
  return messages
}

export function useIntl() {
  const adapters = useInconelAdapters()
  return {
    formatMessage: (
      descriptor: { id?: string; defaultMessage?: string } | string,
      values?: Record<string, unknown>,
    ) => {
      const id = typeof descriptor === 'string' ? descriptor : descriptor.id
      const fallback =
        typeof descriptor === 'string'
          ? descriptor
          : descriptor.defaultMessage ?? descriptor.id ?? ''
      return String(
        adapters.translate?.(id ?? fallback, fallback, values) ?? fallback,
      )
    },
  }
}
