import { HTMLAttributes } from 'react';
export interface HtmlEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}
export declare function HtmlEditor({ value, onChange, placeholder, readOnly, className, ...props }: HtmlEditorProps): import("react").JSX.Element;
//# sourceMappingURL=HtmlEditor.d.ts.map