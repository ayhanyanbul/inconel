import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { DndFileUpload, type DndFileUploadProps } from './DndFileUpload'

function ControlledUpload(props: Omit<DndFileUploadProps, 'value'>) {
  const [files, setFiles] = useState<File[]>([])
  return (
    <DndFileUpload
      {...props}
      value={files}
      onChange={(next) => {
        setFiles(next)
        props.onChange?.(next)
      }}
    />
  )
}

describe('DndFileUpload', () => {
  it('emptyText ve helperText metinlerini gösterir', () => {
    render(
      <DndFileUpload emptyText="Dosya seçilmedi" helperText="Sürükle bırak" />,
    )

    expect(screen.getByText('Dosya seçilmedi')).toBeInTheDocument()
    expect(screen.getByText('Sürükle bırak')).toBeInTheDocument()
  })

  it('dosya bırakıldığında (drop) onChange çağrılır ve dosya adı gösterilir', () => {
    const onChange = vi.fn()
    render(<ControlledUpload onChange={onChange} />)
    const area = screen.getByRole('button')
    const file = new File(['içerik'], 'rapor.pdf', { type: 'application/pdf' })

    fireEvent.drop(area, { dataTransfer: { files: [file] } })

    expect(onChange).toHaveBeenCalledWith([file])
    expect(screen.getByText('rapor.pdf')).toBeInTheDocument()
  })

  it('input üzerinden dosya seçilince dosya adını gösterir', () => {
    const { container } = render(<ControlledUpload />)
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    const file = new File(['içerik'], 'not.txt', { type: 'text/plain' })

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('not.txt')).toBeInTheDocument()
  })
})
