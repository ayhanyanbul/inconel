import { HTMLAttributes, ReactNode } from 'react';
export interface OptionProps extends HTMLAttributes<HTMLDivElement> {
    selected?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
}
export declare function Option({ selected, disabled, icon, children, className, ...props }: OptionProps): import("react").JSX.Element;
//# sourceMappingURL=Option.d.ts.map