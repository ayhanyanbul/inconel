import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './Modal'

describe('Modal', () => {
  it('open false iken hiçbir şey render etmez', () => {
    const { container } = render(<Modal open={false}>İçerik</Modal>)

    expect(container).toBeEmptyDOMElement()
  })

  it('open true iken başlığı ve içeriği gösterir', () => {
    render(
      <Modal open title="Kullanıcı Bilgileri">
        Modal içeriği
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Kullanıcı Bilgileri')).toBeInTheDocument()
    expect(screen.getByText('Modal içeriği')).toBeInTheDocument()
  })

  it('modalType için varsayılan başlığı gösterir', () => {
    render(<Modal open modalType="success" />)

    expect(screen.getByText('Başarılı')).toBeInTheDocument()
  })

  it('kapat butonuna tıklanınca onClose ve onHide çağrılır', () => {
    const onClose = vi.fn()
    const onHide = vi.fn()
    render(
      <Modal open onClose={onClose} onHide={onHide}>
        İçerik
      </Modal>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Kapat' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onHide).toHaveBeenCalledTimes(1)
  })

  it('closeButton false iken kapat butonu render edilmez', () => {
    render(
      <Modal open closeButton={false}>
        İçerik
      </Modal>,
    )

    expect(
      screen.queryByRole('button', { name: 'Kapat' }),
    ).not.toBeInTheDocument()
  })

  it('backdrop üzerine tıklanınca closeOnBackdrop true iken kapanır', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal open onClose={onClose}>
        İçerik
      </Modal>,
    )

    const backdrop = container.querySelector('.inconel-modal-backdrop')
    expect(backdrop).not.toBeNull()
    fireEvent.mouseDown(backdrop as Element)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('backdrop static iken backdrop tıklaması kapatmaz', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal open backdrop="static" onClose={onClose}>
        İçerik
      </Modal>,
    )

    const backdrop = container.querySelector('.inconel-modal-backdrop')
    fireEvent.mouseDown(backdrop as Element)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('closeOnBackdrop false iken backdrop tıklaması kapatmaz', () => {
    const onClose = vi.fn()
    const { container } = render(
      <Modal open closeOnBackdrop={false} onClose={onClose}>
        İçerik
      </Modal>,
    )

    const backdrop = container.querySelector('.inconel-modal-backdrop')
    fireEvent.mouseDown(backdrop as Element)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('keyboard true iken Escape tuşu kapatır', () => {
    const onClose = vi.fn()
    const onEscapeKeyDown = vi.fn()
    render(
      <Modal open onClose={onClose} onEscapeKeyDown={onEscapeKeyDown}>
        İçerik
      </Modal>,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onEscapeKeyDown).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keyboard false iken Escape tuşu kapatmaz', () => {
    const onClose = vi.fn()
    render(
      <Modal open keyboard={false} onClose={onClose}>
        İçerik
      </Modal>,
    )

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
  })

  it('okText/okAction ve cancelText/cancelAction butonlarını render eder ve tıklanınca çağırır', async () => {
    const okAction = vi.fn()
    const cancelAction = vi.fn()
    render(
      <Modal
        open
        okText="Kaydet"
        okAction={okAction}
        cancelText="Vazgeç"
        cancelAction={cancelAction}
      >
        İçerik
      </Modal>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Kaydet' }))
    fireEvent.click(screen.getByRole('button', { name: 'Vazgeç' }))

    // Button bileşeni tıklamayı debounce ettiği için çağrılar asenkron gelir
    await waitFor(() => expect(okAction).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(cancelAction).toHaveBeenCalledTimes(1))
  })

  it('hideFooter true iken footer render edilmez', () => {
    const okAction = vi.fn()
    render(
      <Modal open hideFooter okText="Kaydet" okAction={okAction}>
        İçerik
      </Modal>,
    )

    expect(
      screen.queryByRole('button', { name: 'Kaydet' }),
    ).not.toBeInTheDocument()
  })

  it('customButtons verildiğinde varsayılan footer yerine onu render eder', () => {
    render(
      <Modal
        open
        okText="Kaydet"
        okAction={vi.fn()}
        customButtons={<button type="button">Özel Buton</button>}
      >
        İçerik
      </Modal>,
    )

    expect(
      screen.getByRole('button', { name: 'Özel Buton' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Kaydet' }),
    ).not.toBeInTheDocument()
  })

  it('maximize butonuna tıklanınca inconel-is-maximized classı eklenir', () => {
    render(
      <Modal open maximize>
        İçerik
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).not.toHaveClass('inconel-is-maximized')

    fireEvent.click(screen.getByRole('button', { name: 'Büyüt' }))

    expect(dialog).toHaveClass('inconel-is-maximized')
  })

  it('show prop ile de açılabilir', () => {
    render(<Modal show>İçerik</Modal>)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
