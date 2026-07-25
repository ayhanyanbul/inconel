import { MouseEventHandler } from 'react';
export interface DebouncedCallback extends MouseEventHandler<HTMLButtonElement> {
    cancel: () => void;
}
export declare function createDebouncedCallback(callback?: MouseEventHandler<HTMLButtonElement>, wait?: number): DebouncedCallback;
//# sourceMappingURL=utils.d.ts.map