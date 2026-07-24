import { ReactNode } from 'react';
export interface ModalProps {
    open: boolean;
    title?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    closeLabel?: string;
    closeOnBackdrop?: boolean;
    onClose?: () => void;
    className?: string;
}
export declare function Modal({ open, title, children, footer, closeLabel, closeOnBackdrop, onClose, className, }: ModalProps): import("react").JSX.Element | null;
//# sourceMappingURL=Modal.d.ts.map