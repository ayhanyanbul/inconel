import { HTMLAttributes } from 'react';
export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
    label?: string;
    fullscreen?: boolean;
    render?: boolean | null;
    logo?: string;
}
export declare function Loader({ label, fullscreen, render, logo, className, ...props }: LoaderProps): import("react").JSX.Element | null;
//# sourceMappingURL=Loader.d.ts.map