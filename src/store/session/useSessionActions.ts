import { useInconelAdapters } from '../../adapters'

export default function useSessionActions() {
  const adapters = useInconelAdapters()
  return {
    selectedLocale: adapters.locale ?? 'tr-TR',
    selectedTheme: 'light',
  }
}
