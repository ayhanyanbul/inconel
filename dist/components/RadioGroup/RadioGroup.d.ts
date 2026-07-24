import { ReactNode } from 'react';
export interface RadioOption<T extends string | number = string> {
    label: ReactNode;
    value: T;
    disabled?: boolean;
}
export interface RadioGroupProps<T extends string | number = string> {
    options: RadioOption<T>[];
    value?: T;
    onChange?: (value: T) => void;
    name: string;
    className?: string;
}
export declare function RadioGroup<T extends string | number = string>({ options, value, onChange, name, className, }: RadioGroupProps<T>): import("react").JSX.Element;
//# sourceMappingURL=RadioGroup.d.ts.map