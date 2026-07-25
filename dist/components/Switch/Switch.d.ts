import { ChangeEvent, FocusEventHandler, ReactNode } from 'react';
export interface SwitchProps {
    id?: string;
    name?: string | null;
    className?: string | null;
    isChecked?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    sizing?: 'small' | 'medium' | 'large' | string;
    color?: string;
    markerVals?: [ReactNode, ReactNode] | ReactNode[];
    label?: ReactNode;
    onLabel?: ReactNode;
    offLabel?: ReactNode;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onCheckedChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    render?: boolean;
}
export declare function Switch({ id, name, className, isChecked, checked, defaultChecked, disabled, sizing, color, markerVals, label, onLabel, offLabel, onChange, onCheckedChange, onBlur, render, }: SwitchProps): import("react").JSX.Element | null;
//# sourceMappingURL=Switch.d.ts.map