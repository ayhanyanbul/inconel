import { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    label?: ReactNode;
    onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
    onLabel?: ReactNode;
    offLabel?: ReactNode;
}
export declare function Switch({ label, onLabel, offLabel, checked, defaultChecked, onChange, className, ...props }: SwitchProps): import("react").JSX.Element;
//# sourceMappingURL=Switch.d.ts.map