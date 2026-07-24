import { Table, type TableProps } from '../Table'

export type ExcelTableProps<T extends object = Record<string, unknown>> = TableProps<T>
export const ExcelTable = Table
