import { InputHTMLAttributes, ReactNode } from 'react';
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: ReactNode;
    indeterminate?: boolean;
}
export declare function Checkbox({ label, indeterminate, className, ...props }: CheckboxProps): import("react").JSX.Element;
//# sourceMappingURL=Checkbox.d.ts.map