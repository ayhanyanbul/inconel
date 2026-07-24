import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from 'react'

import FieldFeedback from '../FieldFeedback/FieldFeedback'
import type { FieldFeedbackContentProps } from '../FieldFeedback/FieldFeedback'
import '../shared/field.css'
import '../shared/field-controls.css'
import './styles.css'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldFeedbackContentProps {
  label?: string
  fullWidth?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      id,
      label,
      hint,
      errorMessage,
      fullWidth = false,
      resize = 'vertical',
      className,
      required,
      disabled,
      'aria-describedby': ariaDescribedBy,
      style,
      ...textareaProps
    },
    ref,
  ) {
    const generatedId = useId()
    const textareaId =
      id ?? `inconel-textarea-${generatedId.replace(/:/g, '')}`
    const hintId = `${textareaId}-hint`
    const errorId = `${textareaId}-error`
    const describedBy =
      [
        ariaDescribedBy,
        hint && !errorMessage ? hintId : undefined,
        errorMessage ? errorId : undefined,
      ]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <div
        className={[
          'inconel-field',
          fullWidth ? 'inconel-field--full-width' : '',
          className ?? '',
        ].join(' ')}
      >
        {label && (
          <label className="inconel-field__label" htmlFor={textareaId}>
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        )}
        <textarea
          {...textareaProps}
          ref={ref}
          id={textareaId}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={describedBy}
          className={[
            'inconel-textarea',
            errorMessage ? 'inconel-is-invalid' : '',
          ].join(' ')}
          style={{ ...style, resize }}
        />
        <FieldFeedback
          hint={hint}
          errorMessage={errorMessage}
          hintId={hintId}
          errorId={errorId}
        />
      </div>
    )
  },
)

export default Textarea
