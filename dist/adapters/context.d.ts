import { ReactNode } from 'react';
export interface InconelSocketState {
    connected: boolean;
    connecting?: boolean;
    error?: ReactNode;
    reconnect?: () => void;
}
export interface InconelMediaAdapter {
    open?: (options?: Record<string, unknown>) => void | Promise<unknown>;
}
export interface InconelAdapters {
    loading?: boolean;
    locale?: string;
    translate?: (key: string, fallback: string, values?: Record<string, unknown>) => ReactNode;
    assets?: Record<string, string>;
    socket?: InconelSocketState;
    media?: InconelMediaAdapter;
}
export declare const defaultAdapters: Required<Pick<InconelAdapters, 'locale' | 'translate' | 'assets'>>;
export declare const InconelContext: import('react').Context<InconelAdapters>;
export declare function useInconelAdapters(): InconelAdapters;
//# sourceMappingURL=context.d.ts.map