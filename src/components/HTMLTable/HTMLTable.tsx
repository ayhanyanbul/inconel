import { Table, type TableProps } from '../Table'

export type HTMLTableProps<T extends object = Record<string, unknown>> = TableProps<T>
export const HTMLTable = Table
