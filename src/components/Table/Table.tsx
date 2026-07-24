import type { ReactNode, TableHTMLAttributes } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'
import { DEFAULT_TABLE_EMPTY_MESSAGE } from './constants'
import { getRowKey } from './utils'

export interface Column<T> {
  key: keyof T | string
  header: ReactNode
  render?: (row: T, index: number) => ReactNode
  className?: string
}

export interface TableProps<T extends object>
  extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: Column<T>[]
  data: T[]
  rowKey?: keyof T | ((row: T, index: number) => string | number)
  emptyMessage?: ReactNode
  onRowClick?: (row: T, index: number) => void
}

export function Table<T extends object>({
  columns,
  data,
  rowKey,
  emptyMessage = DEFAULT_TABLE_EMPTY_MESSAGE,
  onRowClick,
  className,
  ...props
}: TableProps<T>) {
  return (
    <div className="inconel-table-wrapper">
      <table {...props} className={classNames('inconel-table', className)}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={getRowKey(row, index, rowKey)}
              onClick={() => onRowClick?.(row, index)}
            >
              {columns.map((column) => (
                <td key={String(column.key)} className={column.className}>
                  {column.render
                    ? column.render(row, index)
                    : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td className="inconel-table__empty" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
