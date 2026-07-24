import { ReactNode, TableHTMLAttributes } from 'react';
export interface Column<T> {
    key: keyof T | string;
    header: ReactNode;
    render?: (row: T, index: number) => ReactNode;
    className?: string;
}
export interface TableProps<T extends object> extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
    columns: Column<T>[];
    data: T[];
    rowKey?: keyof T | ((row: T, index: number) => string | number);
    emptyMessage?: ReactNode;
    onRowClick?: (row: T, index: number) => void;
}
export declare function Table<T extends object>({ columns, data, rowKey, emptyMessage, onRowClick, className, ...props }: TableProps<T>): import("react").JSX.Element;
//# sourceMappingURL=Table.d.ts.map