import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonType } from './constants';
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    label?: ReactNode;
    buttonType?: ButtonType;
    icon?: string | null;
    iconClassName?: string;
    iconWidth?: number | null;
    iconHeight?: number | null;
    iconRight?: boolean;
    render?: boolean;
    debounceTime?: number | null;
    isActive?: boolean | null;
    onChange?: ButtonHTMLAttributes<HTMLButtonElement>['onChange'];
    loading?: boolean;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}
export declare function Button({ loading, fullWidth, variant, label, buttonType, icon, iconClassName, iconWidth, iconHeight, iconRight, render, debounceTime, isActive, onClick, disabled, className, children, ...props }: ButtonProps): import("react").JSX.Element | null;
//# sourceMappingURL=Button.d.ts.map