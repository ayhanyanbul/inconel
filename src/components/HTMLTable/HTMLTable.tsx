import type { ReactNode } from 'react'

import LegacyHTMLTable from './legacy/index.jsx'

export interface HTMLTableColumn<T extends object = Record<string, unknown>> {
  key?: keyof T | string
  dataIndex?: keyof T | string
  title?: ReactNode
  render?: (value: unknown, row: T, index: number) => ReactNode
  [key: string]: unknown
}

export interface HTMLTableProps<T extends object = Record<string, unknown>> {
  columns?: HTMLTableColumn<T>[]
  data?: T[]
  rowKey?: keyof T | ((row: T) => string | number)
  selectable?: boolean
  pagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  total?: number
  currentPage?: number
  className?: string
  rowClassName?: string | ((row: T, index: number) => string)
  onRowClick?: (row: T, index: number) => void
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onSelectionChange?: (rows: T[]) => void
}

export function HTMLTable<T extends object>(
  props: HTMLTableProps<T>,
) {
  const Component = LegacyHTMLTable as unknown as (
    props: HTMLTableProps<T>,
  ) => ReactNode
  return <Component {...props} />
}
