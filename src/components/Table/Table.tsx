import {
  forwardRef,
  type ForwardedRef,
  type ReactNode,
} from 'react'

import LegacyTable from './legacy/index.jsx'

export interface Column<T extends object = Record<string, unknown>> {
  id?: string
  key?: keyof T | string
  accessor?: keyof T | string
  header?: ReactNode
  label?: ReactNode
  render?: (row: T, index: number) => ReactNode
  [key: string]: unknown
}

export interface TableProps<T extends object = Record<string, unknown>> {
  id?: string
  data?: T[]
  columns?: Column<T>[]
  className?: string
  rowKey?: keyof T | ((row: T, index: number) => string | number)
  emptyMessage?: ReactNode
  onRowClick?: (row: T, index: number) => void
  lang?: string
  theme?: string
  loading?: boolean
  [key: string]: unknown
}

function TableInner<T extends object>(
  props: TableProps<T>,
  ref: ForwardedRef<unknown>,
) {
  const Component = LegacyTable as unknown as (
    props: TableProps<T> & { ref?: ForwardedRef<unknown> },
  ) => ReactNode
  return <Component {...props} ref={ref} />
}

export const Table = forwardRef(TableInner) as <T extends object>(
  props: TableProps<T> & { ref?: ForwardedRef<unknown> },
) => ReactNode
