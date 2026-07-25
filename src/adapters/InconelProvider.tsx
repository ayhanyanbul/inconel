import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'

export interface InconelSocketState {
  connected: boolean
  connecting?: boolean
  error?: ReactNode
  reconnect?: () => void
}

export interface InconelMediaAdapter {
  open?: (options?: Record<string, unknown>) => void | Promise<unknown>
}

export interface InconelAdapters {
  loading?: boolean
  locale?: string
  translate?: (
    key: string,
    fallback: string,
    values?: Record<string, unknown>,
  ) => ReactNode
  assets?: Record<string, string>
  socket?: InconelSocketState
  media?: InconelMediaAdapter
}

const defaultAdapters: Required<
  Pick<InconelAdapters, 'locale' | 'translate' | 'assets'>
> = {
  locale: 'tr-TR',
  translate: (_key, fallback) => fallback,
  assets: {},
}

const InconelContext = createContext<InconelAdapters>(defaultAdapters)

export interface InconelProviderProps {
  adapters?: InconelAdapters
  children: ReactNode
}

export function InconelProvider({
  adapters,
  children,
}: InconelProviderProps) {
  const value = useMemo(
    () => ({
      ...defaultAdapters,
      ...adapters,
      assets: { ...defaultAdapters.assets, ...adapters?.assets },
    }),
    [adapters],
  )

  return (
    <InconelContext.Provider value={value}>
      {children}
    </InconelContext.Provider>
  )
}

export function useInconelAdapters() {
  return useContext(InconelContext)
}
