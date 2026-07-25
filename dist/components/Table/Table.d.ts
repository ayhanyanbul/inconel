import { ForwardedRef, ReactNode } from 'react';
export interface Column<T extends object = Record<string, unknown>> {
    id?: string;
    key?: keyof T | string;
    accessor?: keyof T | string;
    header?: ReactNode;
    label?: ReactNode;
    title?: ReactNode;
    dataKey?: keyof T | string;
    render?: (row: T, index: number) => ReactNode;
    [key: string]: unknown;
}
export interface TableProps<T extends object = Record<string, unknown>> {
    id?: string;
    data?: T[];
    columns?: Column<T>[];
    className?: string;
    rowKey?: keyof T | ((row: T, index: number) => string | number);
    emptyMessage?: ReactNode;
    onRowClick?: (row: T, index: number) => void;
    lang?: string;
    theme?: string;
    loading?: boolean;
    [key: string]: unknown;
}
export declare const Table: <T extends object>(props: TableProps<T> & {
    ref?: ForwardedRef<unknown>;
}) => ReactNode;
//# sourceMappingURL=Table.d.ts.map