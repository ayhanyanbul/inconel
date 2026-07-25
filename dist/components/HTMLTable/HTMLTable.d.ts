import { ReactNode } from 'react';
export interface HTMLTableColumn<T extends object = Record<string, unknown>> {
    key?: keyof T | string;
    dataIndex?: keyof T | string;
    title?: ReactNode;
    render?: (value: unknown, row: T, index: number) => ReactNode;
    [key: string]: unknown;
}
export interface HTMLTableProps<T extends object = Record<string, unknown>> {
    columns?: HTMLTableColumn<T>[];
    data?: T[];
    rowKey?: keyof T | ((row: T) => string | number);
    selectable?: boolean;
    pagination?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    total?: number;
    currentPage?: number;
    className?: string;
    rowClassName?: string | ((row: T, index: number) => string);
    onRowClick?: (row: T, index: number) => void;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    onSelectionChange?: (rows: T[]) => void;
}
export declare function HTMLTable<T extends object>(props: HTMLTableProps<T>): import("react").JSX.Element;
//# sourceMappingURL=HTMLTable.d.ts.map