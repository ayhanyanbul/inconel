import { ReactNode } from 'react';
export interface SlideTab {
    key: string | number;
    label: ReactNode;
    count?: ReactNode;
    show?: boolean;
}
export interface SlideTabsProps {
    tabs?: SlideTab[];
    activeKey?: string | number | null;
    onChange?: (key: string | number) => void;
    className?: string | null;
}
export declare function SlideTabs({ tabs, activeKey, onChange, className, }: SlideTabsProps): import("react").JSX.Element | null;
//# sourceMappingURL=SlideTabs.d.ts.map