import { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react';
export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'id' | 'placeholder'> {
    id?: string | null;
    label?: ReactNode;
    placeholder?: ReactNode;
    labelClassName?: string;
    inputClassName?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    errorMessage?: ReactNode;
    render?: boolean;
    files?: File[];
    onFilesChange?: (files: File[]) => void;
}
export declare const FileUpload: import('react').ForwardRefExoticComponent<FileUploadProps & import('react').RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=FileUpload.d.ts.map