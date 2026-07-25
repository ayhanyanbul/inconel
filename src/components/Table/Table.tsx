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
  title?: ReactNode
  dataKey?: keyof T | string
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
  const columns = props.columns?.map((column, index) => {
    const key = column.key ?? column.accessor ?? column.id ?? String(index)
    return {
      ...column,
      id: column.id ?? String(key),
      title: column.title ?? column.header ?? column.label ?? '',
      dataKey: column.dataKey ?? key,
    }
  })
  return (
    <Component
      {...props}
      id={props.id ?? 'inconel-table'}
      columns={columns}
      ref={ref}
    />
  )
}

export const Table = forwardRef(TableInner) as <T extends object>(
  props: TableProps<T> & { ref?: ForwardedRef<unknown> },
) => ReactNode
