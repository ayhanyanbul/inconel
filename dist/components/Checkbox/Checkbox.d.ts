import { InputHTMLAttributes, ReactNode } from 'react';
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'name'> {
    id?: string | number | null;
    name?: string | number | null;
    label?: ReactNode;
    labelClassName?: string;
    readOnly?: boolean;
    errorMessage?: ReactNode;
    labelTitle?: string;
    indeterminate?: boolean;
}
export declare function Checkbox({ label, id, name, labelClassName, readOnly, errorMessage, labelTitle, indeterminate, className, disabled, onChange, ...props }: CheckboxProps): import("react").JSX.Element;
//# sourceMappingURL=Checkbox.d.ts.map