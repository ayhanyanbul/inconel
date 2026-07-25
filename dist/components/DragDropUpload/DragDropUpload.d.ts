import { ReactNode } from 'react';
export interface DragDropUploadProps {
    id?: string | null;
    name?: string | null;
    label?: ReactNode;
    value?: File[];
    files?: File[];
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    className?: string | null;
    helperText?: ReactNode;
    emptyText?: ReactNode;
    buttonText?: ReactNode;
    clearText?: ReactNode;
    onChange?: (files: File[]) => void;
    onFilesChange?: (files: File[]) => void;
    onDropFiles?: (files: File[]) => void;
    render?: boolean;
    uploadIcon?: string;
    clearIcon?: string;
}
export declare function DragDropUpload({ id, name, label, value, files, accept, multiple, disabled, className, helperText, emptyText, buttonText, clearText, onChange, onFilesChange, onDropFiles, render, uploadIcon, clearIcon, }: DragDropUploadProps): import("react").JSX.Element | null;
//# sourceMappingURL=DragDropUpload.d.ts.map