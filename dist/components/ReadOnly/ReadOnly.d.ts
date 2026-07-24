import { HTMLAttributes, ReactNode } from 'react';
export interface ReadOnlyProps extends HTMLAttributes<HTMLDivElement> {
    label?: ReactNode;
    value?: ReactNode;
    emptyValue?: ReactNode;
}
export declare function ReadOnly({ label, value, emptyValue, className, ...props }: ReadOnlyProps): import("react").JSX.Element;
//# sourceMappingURL=ReadOnly.d.ts.map