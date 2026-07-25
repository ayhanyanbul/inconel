import { ReactNode } from 'react';
export interface CustomizableSwitchProps {
    id?: string | null;
    className?: string | null;
    onClick?: (checked: boolean) => void;
    isChecked?: boolean;
    disabled?: boolean;
    render?: boolean;
    children?: ReactNode;
}
export declare function CustomizableSwitch({ id, className, onClick, isChecked, disabled, render, children, }: CustomizableSwitchProps): import("react").JSX.Element | null;
//# sourceMappingURL=CustomizableSwitch.d.ts.map