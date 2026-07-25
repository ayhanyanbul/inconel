import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

import { useInconelAdapters } from '../../adapters'
import { getMediaContent, type MediaSelection } from './utils'
import './styles.css'

interface EditorSelection {
  getBookmark: (type: number, normalized: boolean) => unknown
  moveToBookmark: (bookmark: unknown) => void
}

interface EditorApi {
  focus: () => void
  insertContent: (content: string) => void
  getContent: () => string
  selection: EditorSelection
  ui: {
    registry: {
      addButton: (
        name: string,
        options: { text: string; tooltip: string; onAction: () => void },
      ) => void
    }
  }
}

export interface TextEditorProps {
  value?: string
  onChange?: (value: string) => void
  apiKey?: string
  language?: string
  languageUrl?: string
  height?: number
}

export function TextEditor({
  value = '',
  onChange,
  apiKey,
  language,
  languageUrl,
  height = 500,
}: TextEditorProps) {
  const adapters = useInconelAdapters()
  const editorRef = useRef<EditorApi | null>(null)
  const bookmarkRef = useRef<unknown>(null)

  const selectMedia = async () => {
    const editor = editorRef.current
    editor?.focus()
    bookmarkRef.current = editor?.selection.getBookmark(2, true) ?? null
    const selection = (await adapters.media?.open?.({
      type: 'editor',
    })) as MediaSelection | undefined
    const content = getMediaContent(selection)
    if (!content) return
    if (editor) {
      if (bookmarkRef.current) {
        editor.selection.moveToBookmark(bookmarkRef.current)
      }
      editor.insertContent(content)
      onChange?.(editor.getContent())
    } else {
      onChange?.(`${value} ${content}`.trim())
    }
    bookmarkRef.current = null
  }

  const locale = language ?? (adapters.locale ?? 'tr-TR').split('-')[0]

  return (
    <div className="inconel-text-editor">
      <Editor
        apiKey={apiKey}
        value={value}
        onInit={(_event, editor) => {
          editorRef.current = editor as unknown as EditorApi
        }}
        onEditorChange={(content) => onChange?.(content)}
        init={{
          height,
          language: locale,
          language_url: languageUrl,
          entity_encoding: 'raw',
          plugins: [
            'anchor',
            'autolink',
            'charmap',
            'codesample',
            'emoticons',
            'link',
            'lists',
            'searchreplace',
            'table',
            'visualblocks',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link table inconelGallery | align lineheight | numlist bullist indent outdent | removeformat',
          menubar: false,
          setup: (editor: unknown) => {
            if (!adapters.media?.open) return
            const api = editor as unknown as EditorApi
            api.ui.registry.addButton('inconelGallery', {
              text: 'Galeri',
              tooltip: String(
                adapters.translate?.('mediaGallery', 'Medya galerisi') ??
                  'Medya galerisi',
              ),
              onAction: () => {
                void selectMedia()
              },
            })
          },
        }}
      />
    </div>
  )
}
