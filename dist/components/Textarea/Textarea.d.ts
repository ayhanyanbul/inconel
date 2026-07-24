import { TextareaHTMLAttributes } from 'react';
import { FieldFeedbackContentProps } from '../FieldFeedback/FieldFeedback';
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldFeedbackContentProps {
    label?: string;
    fullWidth?: boolean;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}
declare const Textarea: import('react').ForwardRefExoticComponent<TextareaProps & import('react').RefAttributes<HTMLTextAreaElement>>;
export default Textarea;
//# sourceMappingURL=Textarea.d.ts.map