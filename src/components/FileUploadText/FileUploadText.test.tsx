import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FileUploadText } from './FileUploadText'

describe('FileUploadText', () => {
  it('FileUpload davranışını miras alarak label ile inputu render eder', () => {
    render(<FileUploadText label="Belge" />)

    expect(screen.getByLabelText('Belge')).toHaveAttribute('type', 'file')
    expect(screen.getByText('Dosya seç')).toBeInTheDocument()
  })

  it('dosya seçilince onFilesChange çağrılır', () => {
    const onFilesChange = vi.fn()
    render(<FileUploadText label="Belge" onFilesChange={onFilesChange} />)
    const file = new File(['içerik'], 'metin.txt', { type: 'text/plain' })

    fireEvent.change(screen.getByLabelText('Belge'), {
      target: { files: [file] },
    })

    expect(onFilesChange).toHaveBeenCalledWith([file])
  })

  it('ref üzerinden input elemanına erişim sağlar', () => {
    const ref = createRef<HTMLInputElement>()
    render(<FileUploadText label="Belge" ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current).toBe(screen.getByLabelText('Belge'))
  })
})
