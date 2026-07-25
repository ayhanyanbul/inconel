import {
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from 'react'

import { useInconelAdapters } from '../../adapters'
import { classNames } from '../shared/classNames'
import { Svg } from '../Svg'
import './styles.css'
import {
  filterAcceptedFiles,
  getSelectedFileText,
} from './utils'

export interface DragDropUploadProps {
  id?: string | null
  name?: string | null
  label?: ReactNode
  value?: File[]
  files?: File[]
  accept?: string
  multiple?: boolean
  disabled?: boolean
  className?: string | null
  helperText?: ReactNode
  emptyText?: ReactNode
  buttonText?: ReactNode
  clearText?: ReactNode
  onChange?: (files: File[]) => void
  onFilesChange?: (files: File[]) => void
  onDropFiles?: (files: File[]) => void
  render?: boolean
  uploadIcon?: string
  clearIcon?: string
}

export function DragDropUpload({
  id,
  name,
  label,
  value,
  files,
  accept = '*',
  multiple = false,
  disabled = false,
  className,
  helperText = 'Dosyayı buraya sürükle veya seç',
  emptyText = 'Henüz dosya seçilmedi',
  buttonText = 'Dosya Seç',
  clearText = 'Sil',
  onChange,
  onFilesChange,
  onDropFiles,
  render = true,
  uploadIcon,
  clearIcon,
}: DragDropUploadProps) {
  const adapters = useInconelAdapters()
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepthRef = useRef(0)
  const [isDragActive, setIsDragActive] = useState(false)
  const [errorText, setErrorText] = useState<ReactNode>(null)
  const selectedFiles = value ?? files ?? []
  const resolvedUploadIcon = uploadIcon ?? adapters.assets?.upload
  const resolvedClearIcon = clearIcon ?? adapters.assets?.close

  if (!render) return null

  const notify = (nextFiles: File[]) => {
    onChange?.(nextFiles)
    onFilesChange?.(nextFiles)
    onDropFiles?.(nextFiles)
  }
  const syncFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList)
    const accepted = filterAcceptedFiles(incoming, accept)
    const nextFiles = multiple ? accepted : accepted.slice(0, 1)
    setErrorText(
      incoming.length > 0 && nextFiles.length === 0
        ? adapters.translate?.(
            'unsupportedFileType',
            'Bu dosya tipi desteklenmiyor.',
          )
        : null,
    )
    notify(nextFiles)
    if (inputRef.current) inputRef.current.value = ''
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDragActive(false)
    if (!disabled) syncFiles(event.dataTransfer.files)
  }

  return (
    <div
      className={classNames(
        'inconel-drag-drop-upload',
        isDragActive && !disabled && 'inconel-is-dragging',
        disabled && 'inconel-is-disabled',
        className,
      )}
    >
      {label && (
        <label className="inconel-drag-drop-upload__label" htmlFor={id ?? undefined}>
          {label}
        </label>
      )}
      <div
        className="inconel-drag-drop-upload__area"
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            if (!disabled) inputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault()
          dragDepthRef.current += 1
          setIsDragActive(true)
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault()
          dragDepthRef.current -= 1
          if (dragDepthRef.current <= 0) {
            dragDepthRef.current = 0
            setIsDragActive(false)
          }
        }}
        onDrop={handleDrop}
      >
        <input
          id={id ?? undefined}
          ref={inputRef}
          className="inconel-drag-drop-upload__input"
          type="file"
          name={name ?? undefined}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => syncFiles(event.target.files ?? [])}
        />
        {resolvedUploadIcon && (
          <Svg
            src={resolvedUploadIcon}
            className="inconel-drag-drop-upload__icon"
          />
        )}
        <span className="inconel-drag-drop-upload__content">
          <strong>{getSelectedFileText(selectedFiles, emptyText)}</strong>
          <span>{helperText}</span>
          {errorText && (
            <span className="inconel-drag-drop-upload__error">{errorText}</span>
          )}
        </span>
        {selectedFiles.length > 0 ? (
          <button
            className="inconel-drag-drop-upload__clear"
            type="button"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation()
              setErrorText(null)
              notify([])
            }}
          >
            {resolvedClearIcon && <Svg src={resolvedClearIcon} />}
            <span>{clearText}</span>
          </button>
        ) : (
          <span className="inconel-drag-drop-upload__pick">{buttonText}</span>
        )}
      </div>
    </div>
  )
}
