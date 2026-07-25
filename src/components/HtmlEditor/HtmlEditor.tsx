import CodeEditor from '@uiw/react-textarea-code-editor'
import type { CSSProperties } from 'react'

import { useInconelAdapters } from '../../adapters'
import { classNames } from '../shared/classNames'
import './styles.css'

export interface HtmlEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  language?: string
  padding?: number
  className?: string
  style?: CSSProperties
  readOnly?: boolean
}

export function HtmlEditor({
  value = '',
  onChange,
  placeholder,
  language = 'html',
  padding = 15,
  className,
  style,
  readOnly = false,
}: HtmlEditorProps) {
  const adapters = useInconelAdapters()
  return (
    <CodeEditor
      value={value}
      language={language}
      placeholder={
        placeholder ??
        String(adapters.translate?.('enterHtml', 'HTML girin') ?? 'HTML girin')
      }
      readOnly={readOnly}
      onChange={(event) => onChange?.(event.target.value)}
      padding={padding}
      className={classNames('inconel-html-editor', className)}
      style={{
        backgroundColor: '#f5f5f5',
        minHeight: 180,
        fontFamily:
          'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
        ...style,
      }}
    />
  )
}
