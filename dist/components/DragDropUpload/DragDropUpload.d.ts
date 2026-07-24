import { ReactNode } from 'react';
import { FileUploadProps } from '../FileUpload';
export interface DragDropUploadProps extends FileUploadProps {
    onDropFiles?: (files: File[]) => void;
    dropLabel?: ReactNode;
}
export declare function DragDropUpload({ onDropFiles, dropLabel, className, ...props }: DragDropUploadProps): import("react").JSX.Element;
//# sourceMappingURL=DragDropUpload.d.ts.map