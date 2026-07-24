import { HTMLAttributes, ReactNode } from 'react';
export interface SocketStatusProps extends HTMLAttributes<HTMLSpanElement> {
    connected: boolean;
    connectedLabel?: ReactNode;
    disconnectedLabel?: ReactNode;
}
export declare function SocketStatus({ connected, connectedLabel, disconnectedLabel, className, ...props }: SocketStatusProps): import("react").JSX.Element;
//# sourceMappingURL=SocketStatus.d.ts.map