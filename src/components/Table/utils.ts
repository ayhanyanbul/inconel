export function getRowKey<T extends object>(
  row: T,
  index: number,
  rowKey?: keyof T | ((row: T, index: number) => string | number),
) {
  if (typeof rowKey === 'function') return rowKey(row, index)
  if (rowKey) return String(row[rowKey])
  return index
}
