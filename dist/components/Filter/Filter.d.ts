import { HTMLAttributes, ReactNode } from 'react';
export interface FilterProps extends HTMLAttributes<HTMLDivElement> {
    onClear?: () => void;
    clearLabel?: ReactNode;
}
export declare function Filter({ children, onClear, clearLabel, className, ...props }: FilterProps): import("react").JSX.Element;
//# sourceMappingURL=Filter.d.ts.map