import { CSSProperties, ReactNode } from 'react';
export interface ExcelTableColumn {
    id?: string;
    key?: string;
    name?: string;
    label?: ReactNode;
    [key: string]: unknown;
}
export interface ExcelTableProps<T extends object = Record<string, unknown>> {
    id?: string;
    className?: string;
    data?: T[];
    columns?: ExcelTableColumn[];
    viewCount?: number;
    rowHeight?: number;
    copy?: boolean;
    theme?: string;
    dragStatus?: boolean;
    bodyCellPositions?: CSSProperties;
    [key: string]: unknown;
}
export declare function ExcelTable<T extends object>(props: ExcelTableProps<T>): import("react").JSX.Element;
//# sourceMappingURL=ExcelTable.d.ts.map