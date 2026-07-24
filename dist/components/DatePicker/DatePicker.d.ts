import { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
    value?: string | Date | null;
    onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
    label?: ReactNode;
}
export declare function DatePicker({ value, onChange, label, className, ...props }: DatePickerProps): import("react").JSX.Element;
//# sourceMappingURL=DatePicker.d.ts.map