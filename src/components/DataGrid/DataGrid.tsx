import { Table, type TableProps } from '../Table'

export type DataGridProps<T extends object = Record<string, unknown>> = TableProps<T>
export const DataGrid = Table
