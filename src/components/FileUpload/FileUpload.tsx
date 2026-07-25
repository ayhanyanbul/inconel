import {
  forwardRef,
  useId,
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

import { useInconelAdapters } from '../../adapters'
import { classNames } from '../shared/classNames'
import './styles.css'

export interface FileUploadProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange' | 'id'
  > {
  id?: string | null
  label?: ReactNode
  placeholder?: ReactNode
  labelClassName?: string
  inputClassName?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  errorMessage?: ReactNode
  render?: boolean
  files?: File[]
  onFilesChange?: (files: File[]) => void
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  function FileUpload(
    {
      id,
      label,
      placeholder,
      labelClassName,
      inputClassName,
      onChange,
      onFilesChange,
      errorMessage,
      render = true,
      className,
      disabled,
      accept = '*',
      multiple = false,
      ...props
    },
    ref,
  ) {
    const generatedId = useId()
    const adapters = useInconelAdapters()
    const inputId = id ?? `inconel-file-upload-${generatedId.replace(/:/g, '')}`

    if (!render) return null

    return (
      <div className={classNames('inconel-file-upload', className)}>
        {label !== null && label !== undefined && (
          <label
            className={classNames(
              'inconel-file-upload__label',
              labelClassName,
            )}
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          type="file"
          className={classNames(
            'inconel-file-upload__input',
            Boolean(errorMessage) && 'inconel-is-invalid',
            inputClassName,
          )}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            onChange?.(event)
            onFilesChange?.(Array.from(event.target.files ?? []))
          }}
        />
        <label
          className={classNames(
            'inconel-file-upload__button',
            disabled && 'inconel-is-disabled',
            Boolean(errorMessage) && 'inconel-is-error',
          )}
          htmlFor={inputId}
        >
          {placeholder ??
            adapters.translate?.('selectFile', 'Dosya seç') ??
            'Dosya seç'}
        </label>
        {errorMessage !== null && errorMessage !== undefined && (
          <span className="inconel-file-upload__error" role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    )
  },
)
