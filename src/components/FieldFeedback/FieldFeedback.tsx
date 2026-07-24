import type { ReactNode } from 'react'
import '../shared/field.css'

export interface FieldFeedbackContentProps {
  hint?: ReactNode
  errorMessage?: ReactNode
}

export interface FieldFeedbackProps extends FieldFeedbackContentProps {
  hintId: string
  errorId: string
  className?: string
}

function FieldFeedback({
  hint,
  errorMessage,
  hintId,
  errorId,
  className,
}: FieldFeedbackProps) {
  if (errorMessage) {
    return (
      <p
        id={errorId}
        className={[
          'inconel-field-feedback',
          'inconel-is-error',
          className ?? '',
        ].join(' ')}
        role="alert"
      >
        {errorMessage}
      </p>
    )
  }

  if (hint) {
    return (
      <p
        id={hintId}
        className={[
          'inconel-field-feedback',
          'inconel-is-hint',
          className ?? '',
        ].join(' ')}
      >
        {hint}
      </p>
    )
  }

  return null
}

export default FieldFeedback
