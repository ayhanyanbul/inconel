import type { InputHTMLAttributes, ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'
import { DEFAULT_FILE_UPLOAD_LABEL } from './constants'

export interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: ReactNode
  files?: File[]
  onFilesChange?: (files: File[]) => void
}

export function FileUpload({
  label = DEFAULT_FILE_UPLOAD_LABEL,
  files,
  multiple,
  onFilesChange,
  className,
  ...props
}: FileUploadProps) {
  return (
    <label className={classNames('inconel-file-upload', className)}>
      <span className="inconel-file-upload__button">{label}</span>
      <input
        {...props}
        type="file"
        multiple={multiple}
        onChange={(event) => onFilesChange?.(Array.from(event.target.files ?? []))}
      />
      {files && files.length > 0 && (
        <span className="inconel-file-upload__text">
          {files.map((file) => file.name).join(', ')}
        </span>
      )}
    </label>
  )
}
