import { forwardRef } from 'react'

import {
  FileUpload,
  type FileUploadProps,
} from '../FileUpload'

export type FileUploadTextProps = FileUploadProps

export const FileUploadText = forwardRef<
  HTMLInputElement,
  FileUploadTextProps
>(function FileUploadText(props, ref) {
  return <FileUpload {...props} ref={ref} />
})
