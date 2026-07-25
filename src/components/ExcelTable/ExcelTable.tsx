import type { CSSProperties, ReactNode } from 'react'

import LegacyExcelTable from './legacy/index.jsx'

export interface ExcelTableColumn {
  id?: string
  key?: string
  name?: string
  label?: ReactNode
  [key: string]: unknown
}

export interface ExcelTableProps<T extends object = Record<string, unknown>> {
  id?: string
  className?: string
  data?: T[]
  columns?: ExcelTableColumn[]
  viewCount?: number
  rowHeight?: number
  copy?: boolean
  theme?: string
  dragStatus?: boolean
  bodyCellPositions?: CSSProperties
  [key: string]: unknown
}

export function ExcelTable<T extends object>(
  props: ExcelTableProps<T>,
) {
  const Component = LegacyExcelTable as unknown as (
    props: ExcelTableProps<T>,
  ) => ReactNode
  return <Component {...props} />
}
