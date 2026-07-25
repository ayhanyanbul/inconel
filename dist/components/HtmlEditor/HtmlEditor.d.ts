import { CSSProperties } from 'react';
export interface HtmlEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    language?: string;
    padding?: number;
    className?: string;
    style?: CSSProperties;
    readOnly?: boolean;
}
export declare function HtmlEditor({ value, onChange, placeholder, language, padding, className, style, readOnly, }: HtmlEditorProps): import("react").JSX.Element;
//# sourceMappingURL=HtmlEditor.d.ts.map