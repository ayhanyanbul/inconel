import { ReactNode } from 'react';
export interface TabsItem {
    id: string;
    label: ReactNode;
    content?: ReactNode;
    disabled?: boolean;
}
export interface TabsProps {
    items?: TabsItem[];
    tabData?: Array<{
        label?: ReactNode;
        content?: ReactNode;
    }>;
    initialTab?: string | number | null;
    value?: string;
    defaultValue?: string;
    onChange?: (id: string) => void;
    className?: string;
}
export declare function Tabs({ items, tabData, initialTab, value, defaultValue, onChange, className, }: TabsProps): import("react").JSX.Element;
//# sourceMappingURL=Tabs.d.ts.map