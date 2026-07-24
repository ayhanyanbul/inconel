import { ReactNode } from 'react';
export interface FieldFeedbackContentProps {
    hint?: ReactNode;
    errorMessage?: ReactNode;
}
export interface FieldFeedbackProps extends FieldFeedbackContentProps {
    hintId: string;
    errorId: string;
    className?: string;
}
declare function FieldFeedback({ hint, errorMessage, hintId, errorId, className, }: FieldFeedbackProps): import("react").JSX.Element | null;
export default FieldFeedback;
//# sourceMappingURL=FieldFeedback.d.ts.map