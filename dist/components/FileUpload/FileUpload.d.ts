import { InputHTMLAttributes, ReactNode } from 'react';
export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    label?: ReactNode;
    files?: File[];
    onFilesChange?: (files: File[]) => void;
}
export declare function FileUpload({ label, files, multiple, onFilesChange, className, ...props }: FileUploadProps): import("react").JSX.Element;
//# sourceMappingURL=FileUpload.d.ts.map