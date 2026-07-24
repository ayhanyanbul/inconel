import { ReactNode } from 'react';
export interface TabsItem {
    id: string;
    label: ReactNode;
    content?: ReactNode;
    disabled?: boolean;
}
export interface TabsProps {
    items: TabsItem[];
    value?: string;
    defaultValue?: string;
    onChange?: (id: string) => void;
    className?: string;
}
export declare function Tabs({ items, value, defaultValue, onChange, className, }: TabsProps): import("react").JSX.Element;
//# sourceMappingURL=Tabs.d.ts.map