import { ReactNode } from 'react';
export interface DataGridItem {
    label: ReactNode;
    value?: unknown;
    key?: string;
    valueClass?: string;
    customValue?: ReactNode;
}
export interface DataGridProps {
    data?: DataGridItem[];
    columns?: 2 | 4;
    size?: 'default' | 'compact' | 'spacious';
    striped?: boolean;
    hoverable?: boolean;
    bordered?: boolean;
    loading?: boolean;
    className?: string;
    labelWidth?: string;
    onItemClick?: (item: DataGridItem, index: number) => void;
}
export declare function DataGrid({ data, columns, size, striped, hoverable, bordered, loading, className, labelWidth, onItemClick, }: DataGridProps): import("react").JSX.Element;
//# sourceMappingURL=DataGrid.d.ts.map