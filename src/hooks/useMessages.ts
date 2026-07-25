import { useInconelAdapters } from '../adapters'

export default function useMessages() {
  const adapters = useInconelAdapters()
  return {
    getGlobalText: (key: string, fallback = key) =>
      adapters.translate?.(key, fallback) ?? fallback,
  }
}
