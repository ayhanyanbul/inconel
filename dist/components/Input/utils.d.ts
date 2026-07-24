import { InputRoundMode, InputType, InputValidationMessages, InputValue } from './Input';
export interface InputValidationOptions {
    required: boolean;
    type: InputType;
    min?: number;
    max?: number;
    mask?: string;
    messages: InputValidationMessages;
}
export declare function isFormattedInputType(type: InputType): boolean;
export declare function isLengthValidatedInputType(type: InputType): boolean;
export declare function getInputSeparators(locale: string): {
    group: string;
    decimal: string;
};
export declare function parseInputNumber(value: string, locale: string): number | null;
export declare function roundInputNumber(value: number, scale: number, mode: InputRoundMode): number;
export declare function applyInputMask(value: InputValue, mask: string): string;
export declare function formatInputValue(value: InputValue, type: InputType, locale: string, decimalScale: number, currency: string, mask?: string): string;
export declare function validateInputValue(candidate: InputValue, { required, type, min, max, mask, messages, }: InputValidationOptions): string | null;
//# sourceMappingURL=utils.d.ts.map