import type { HTMLAttributes } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface HtmlEditorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
}

export function HtmlEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className,
  ...props
}: HtmlEditorProps) {
  return (
    <div
      {...props}
      className={classNames('inconel-editor', className)}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      data-placeholder={placeholder}
      dangerouslySetInnerHTML={{ __html: value ?? '' }}
      onInput={(event) => onChange?.(event.currentTarget.innerHTML)}
    />
  )
}
