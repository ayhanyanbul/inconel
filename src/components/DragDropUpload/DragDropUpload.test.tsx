import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { DragDropUpload, type DragDropUploadProps } from './DragDropUpload'

function createFile(name: string, type = 'text/plain') {
  return new File(['dosya içeriği'], name, { type })
}

function ControlledUpload(props: Omit<DragDropUploadProps, 'value'>) {
  const [files, setFiles] = useState<File[]>([])
  return (
    <DragDropUpload
      {...props}
      value={files}
      onChange={(next) => {
        setFiles(next)
        props.onChange?.(next)
      }}
    />
  )
}

describe('DragDropUpload', () => {
  it('dosya seçilmediğinde emptyText metnini gösterir', () => {
    render(<DragDropUpload emptyText="Henüz dosya yok" />)

    expect(screen.getByText('Henüz dosya yok')).toBeInTheDocument()
  })

  it('input üzerinden dosya seçilince onChange, onFilesChange ve onDropFiles çağrılır ve dosya adı gösterilir', () => {
    const onChange = vi.fn()
    const onFilesChange = vi.fn()
    const onDropFiles = vi.fn()
    const { container } = render(
      <ControlledUpload
        onChange={onChange}
        onFilesChange={onFilesChange}
        onDropFiles={onDropFiles}
      />,
    )
    const file = createFile('belge.txt')
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    expect(onChange).toHaveBeenCalledWith([file])
    expect(onFilesChange).toHaveBeenCalledWith([file])
    expect(onDropFiles).toHaveBeenCalledWith([file])
    expect(screen.getByText('belge.txt')).toBeInTheDocument()
  })

  it('multiple false iken sadece ilk dosyayı tutar', () => {
    const onChange = vi.fn()
    const { container } = render(<DragDropUpload onChange={onChange} />)
    const first = createFile('birinci.txt')
    const second = createFile('ikinci.txt')
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    fireEvent.change(input, { target: { files: [first, second] } })

    expect(onChange).toHaveBeenCalledWith([first])
  })

  it('multiple true iken tüm dosyaları tutar ve sayaç metnini gösterir', () => {
    const onChange = vi.fn()
    const { container } = render(
      <ControlledUpload multiple onChange={onChange} />,
    )
    const first = createFile('birinci.txt')
    const second = createFile('ikinci.txt')
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    fireEvent.change(input, { target: { files: [first, second] } })

    expect(onChange).toHaveBeenCalledWith([first, second])
    expect(screen.getByText('2 tane dosya seçildi')).toBeInTheDocument()
  })

  it('accept ile eşleşmeyen dosya reddedilir ve hata metni gösterilir', () => {
    const onChange = vi.fn()
    const { container } = render(
      <DragDropUpload accept="image/*" onChange={onChange} />,
    )
    const file = createFile('belge.txt', 'text/plain')
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    fireEvent.change(input, { target: { files: [file] } })

    expect(onChange).toHaveBeenCalledWith([])
    expect(
      screen.getByText('Bu dosya tipi desteklenmiyor.'),
    ).toBeInTheDocument()
  })

  it('sürükleme alana girdiğinde inconel-is-dragging classı eklenir, bırakınca kaldırılır', () => {
    const { container } = render(<DragDropUpload />)
    const area = screen.getByRole('button')
    const wrapper = container.firstChild as HTMLElement

    fireEvent.dragEnter(area)
    expect(wrapper).toHaveClass('inconel-is-dragging')

    fireEvent.dragLeave(area)
    expect(wrapper).not.toHaveClass('inconel-is-dragging')
  })

  it('dosya bırakıldığında (drop) dosyalar kabul edilir', () => {
    const onChange = vi.fn()
    const { container } = render(<DragDropUpload onChange={onChange} />)
    const area = screen.getByRole('button')
    const wrapper = container.firstChild as HTMLElement
    const file = createFile('dropped.txt')

    fireEvent.drop(area, { dataTransfer: { files: [file] } })

    expect(onChange).toHaveBeenCalledWith([file])
    expect(wrapper).not.toHaveClass('inconel-is-dragging')
  })

  it('dosya seçiliyken temizle butonu görünür ve tıklanınca listeyi boşaltır', () => {
    const onChange = vi.fn()
    render(<DragDropUpload value={[createFile('a.txt')]} onChange={onChange} />)

    const clearButton = screen.getByRole('button', { name: 'Sil' })
    fireEvent.click(clearButton)

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('disabled iken alan tıklanamaz duruma gelir ve input disabled olur', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
    const { container } = render(<DragDropUpload disabled />)
    const area = screen.getByRole('button')
    const wrapper = container.firstChild as HTMLElement
    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    expect(wrapper).toHaveClass('inconel-is-disabled')
    expect(input).toBeDisabled()

    fireEvent.click(area)
    expect(clickSpy).not.toHaveBeenCalled()

    clickSpy.mockRestore()
  })

  it('alana tıklanınca gizli input tetiklenir', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click')
    render(<DragDropUpload />)
    const area = screen.getByRole('button')

    fireEvent.click(area)

    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })

  it('render false iken hiçbir şey render etmez', () => {
    const { container } = render(<DragDropUpload render={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('label verildiğinde etiketi gösterir', () => {
    render(<DragDropUpload id="dosya" label="Belge Yükle" />)

    expect(screen.getByText('Belge Yükle')).toHaveClass(
      'inconel-drag-drop-upload__label',
    )
  })
})
