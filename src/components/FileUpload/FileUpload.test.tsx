import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  it('label ile ilişkilendirilmiş dosya inputu render eder', () => {
    render(<FileUpload label="Belge" />)

    const input = screen.getByLabelText('Belge')
    expect(input).toHaveAttribute('type', 'file')
  })

  it('varsayılan olarak "Dosya seç" placeholder metnini gösterir', () => {
    render(<FileUpload label="Belge" />)

    expect(screen.getByText('Dosya seç')).toBeInTheDocument()
  })

  it('özel placeholder metnini gösterir', () => {
    render(<FileUpload label="Belge" placeholder="Yükle" />)

    expect(screen.getByText('Yükle')).toBeInTheDocument()
    expect(screen.queryByText('Dosya seç')).not.toBeInTheDocument()
  })

  it('dosya seçilince onChange ve onFilesChange çağrılır', () => {
    const onChange = vi.fn()
    const onFilesChange = vi.fn()
    render(
      <FileUpload
        label="Belge"
        onChange={onChange}
        onFilesChange={onFilesChange}
      />,
    )
    const file = new File(['içerik'], 'dosya.pdf', { type: 'application/pdf' })

    fireEvent.change(screen.getByLabelText('Belge'), {
      target: { files: [file] },
    })

    expect(onChange).toHaveBeenCalled()
    expect(onFilesChange).toHaveBeenCalledWith([file])
  })

  it('errorMessage verildiğinde alert olarak gösterir ve invalid classları ekler', () => {
    render(<FileUpload label="Belge" errorMessage="Zorunlu alan" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Zorunlu alan')
    expect(screen.getByLabelText('Belge')).toHaveClass('inconel-is-invalid')
  })

  it('disabled iken input disabled olur ve buton is-disabled classı alır', () => {
    render(<FileUpload label="Belge" disabled />)

    expect(screen.getByLabelText('Belge')).toBeDisabled()
    expect(screen.getByText('Dosya seç')).toHaveClass('inconel-is-disabled')
  })

  it('render false iken hiçbir şey render etmez', () => {
    const { container } = render(<FileUpload label="Belge" render={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('verilen id inputa uygulanır', () => {
    render(<FileUpload label="Belge" id="belge-input" />)

    expect(screen.getByLabelText('Belge')).toHaveAttribute(
      'id',
      'belge-input',
    )
  })

  it('multiple niteliğini inputa iletir', () => {
    render(<FileUpload label="Belge" multiple />)

    expect(screen.getByLabelText('Belge')).toHaveAttribute('multiple')
  })
})
