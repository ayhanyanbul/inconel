import { useState, type DragEvent, type ReactNode } from 'react'

import { FileUpload, type FileUploadProps } from '../FileUpload'

import { classNames } from '../shared/classNames'
import './styles.css'
import { DEFAULT_DROP_LABEL } from './constants'

export interface DragDropUploadProps extends FileUploadProps {
  onDropFiles?: (files: File[]) => void
  dropLabel?: ReactNode
}

export function DragDropUpload({
  onDropFiles,
  dropLabel = DEFAULT_DROP_LABEL,
  className,
  ...props
}: DragDropUploadProps) {
  const [dragging, setDragging] = useState(false)
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    onDropFiles?.(Array.from(event.dataTransfer.files))
  }

  return (
    <div
      className={classNames(
        'inconel-drag-drop-upload',
        dragging && 'inconel-is-dragging',
        className,
      )}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <span>{dropLabel}</span>
      <FileUpload {...props} />
    </div>
  )
}
