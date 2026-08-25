import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FloatingPanel } from './FloatingPanel'

describe('FloatingPanel', () => {
  it('render=false iken hiçbir şey render etmez', () => {
    render(
      <FloatingPanel onClosed={() => {}} render={false}>
        İçerik
      </FloatingPanel>,
    )

    expect(screen.queryByText('İçerik')).not.toBeInTheDocument()
  })

  it('document.body içine portal olarak render edilir', () => {
    render(<FloatingPanel onClosed={() => {}}>İçerik</FloatingPanel>)

    expect(screen.getByText('İçerik')).toBeInTheDocument()
    expect(document.body.querySelector('.inconel-floating-panel')).not.toBeNull()
  })

  it('triangleShow=false iken inconel-triangle-off class ekler', () => {
    render(
      <FloatingPanel onClosed={() => {}} triangleShow={false}>
        İçerik
      </FloatingPanel>,
    )

    expect(document.querySelector('.inconel-floating-panel')).toHaveClass(
      'inconel-triangle-off',
    )
  })

  it('kapat butonuna tıklanınca onClosed tetiklenir', () => {
    const onClosed = vi.fn()
    render(
      <FloatingPanel onClosed={onClosed} closeButtonShow>
        İçerik
      </FloatingPanel>,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onClosed).toHaveBeenCalledOnce()
  })

  it('closeButtonShow=false iken kapat butonu render edilmez', () => {
    render(
      <FloatingPanel onClosed={() => {}} closeButtonShow={false}>
        İçerik
      </FloatingPanel>,
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('dışarı tıklanınca onOutsideClick tetiklenir', () => {
    const onOutsideClick = vi.fn()
    render(
      <FloatingPanel onClosed={() => {}} onOutsideClick={onOutsideClick}>
        İçerik
      </FloatingPanel>,
    )

    fireEvent.mouseDown(document.body)

    expect(onOutsideClick).toHaveBeenCalledOnce()
  })

  it('closeOnScroll iken dışarıdaki scroll onClosed tetikler', () => {
    const onClosed = vi.fn()
    render(
      <FloatingPanel onClosed={onClosed} closeOnScroll>
        İçerik
      </FloatingPanel>,
    )

    fireEvent.scroll(document.body)

    expect(onClosed).toHaveBeenCalledOnce()
  })
})
