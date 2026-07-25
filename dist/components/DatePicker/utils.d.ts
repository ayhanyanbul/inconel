export type DateInput = Date | string | number | null | undefined;
export declare function normalizeDate(value: DateInput): Date | null;
export interface ClearedDateOptions {
    isClearable: boolean;
    notNull: boolean;
    defaultDate: boolean;
    initialDate?: Date | null;
    fallbackDate?: Date | null;
}
export declare function resolveClearedDate(value: Date | null, options: ClearedDateOptions): Date | null;
//# sourceMappingURL=utils.d.ts.map