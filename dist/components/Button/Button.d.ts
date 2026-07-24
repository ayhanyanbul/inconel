import { ButtonHTMLAttributes } from 'react';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}
export declare function Button({ loading, fullWidth, variant, disabled, className, children, ...props }: ButtonProps): import("react").JSX.Element;
//# sourceMappingURL=Button.d.ts.map