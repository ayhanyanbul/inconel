import {
  useMemo,
  type ReactNode,
} from 'react'
import {
  defaultAdapters,
  InconelContext,
  type InconelAdapters,
} from './context'

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
