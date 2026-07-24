import { FocusEvent, InputHTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { FieldFeedbackContentProps } from '../FieldFeedback/FieldFeedback';
export type InputType = 'text' | 'number' | 'currency' | 'percent' | 'phone' | 'email' | 'password';
export type InputRoundMode = 'ceil' | 'floor' | 'round';
export type InputValue = string | number | null;
export type InputEventType = 'change' | 'blur' | 'focus' | 'keydown' | 'mouseenter' | 'mouseleave' | 'clear';
export interface InputPayload {
    rawValue: InputValue;
    formattedValue: string;
    error: boolean;
    char: string | null;
    eventType: InputEventType;
}
export interface InputValidationMessages {
    required?: string;
    invalidNumber?: string;
    minNumber?: string;
    maxNumber?: string;
    minLength?: string;
    maxLength?: string;
    invalidPhone?: string;
    invalidEmail?: string;
}
type NativeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'onFocus' | 'onKeyDown' | 'onMouseEnter' | 'onMouseLeave' | 'min' | 'max' | 'size' | 'readOnly'>;
export interface InputProps extends NativeInputProps, FieldFeedbackContentProps {
    label?: string;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    fullWidth?: boolean;
    inputClassName?: string;
    labelClassName?: string;
    value?: InputValue;
    defaultValue?: InputValue;
    onChange?: (payload: InputPayload) => void;
    onBlur?: (payload: InputPayload, event: FocusEvent<HTMLInputElement>) => void;
    onFocus?: (payload: InputPayload, event: FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (payload: InputPayload, event: KeyboardEvent<HTMLInputElement>) => void;
    onMouseEnter?: (payload: InputPayload, event: MouseEvent<HTMLInputElement>) => void;
    onMouseLeave?: (payload: InputPayload, event: MouseEvent<HTMLInputElement>) => void;
    type?: InputType;
    locale?: string;
    currency?: string;
    decimalScale?: number;
    roundMode?: InputRoundMode;
    roundOnBlur?: boolean;
    min?: number;
    max?: number;
    allowNegative?: boolean;
    debounceMs?: number;
    validateOnSubmit?: boolean;
    validationMessages?: InputValidationMessages;
    mask?: string;
    limit?: number;
    isClearable?: boolean;
    readOnly?: boolean;
    clearButtonLabel?: string;
    readOnlyEmptyValue?: ReactNode;
}
declare const Input: import('react').ForwardRefExoticComponent<InputProps & import('react').RefAttributes<HTMLInputElement>>;
export default Input;
//# sourceMappingURL=Input.d.ts.map