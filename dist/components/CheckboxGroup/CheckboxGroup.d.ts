import { ReactNode } from 'react';
export interface CheckboxOption<T extends string | number = string> {
    label: ReactNode;
    value: T;
    disabled?: boolean;
}
export interface CheckboxGroupProps<T extends string | number = string> {
    options: CheckboxOption<T>[];
    value?: T[];
    onChange?: (value: T[]) => void;
    name?: string;
    className?: string;
}
export declare function CheckboxGroup<T extends string | number = string>({ options, value, onChange, name, className, }: CheckboxGroupProps<T>): import("react").JSX.Element;
//# sourceMappingURL=CheckboxGroup.d.ts.map