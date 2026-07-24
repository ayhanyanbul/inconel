import { ReactElement, ReactNode } from 'react';
export interface TooltipProps {
    content: ReactNode;
    children: ReactElement;
    placement?: 'top' | 'right' | 'bottom' | 'left';
    className?: string;
}
export declare function Tooltip({ content, children, placement, className, }: TooltipProps): import("react").JSX.Element;
//# sourceMappingURL=Tooltip.d.ts.map