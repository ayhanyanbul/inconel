import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DropDownBox } from './DropDownBox'

describe('DropDownBox', () => {
  it('varsayılan olarak menü kapalıdır', () => {
    render(
      <DropDownBox label="Ayarlar">
        <div>İçerik</div>
      </DropDownBox>,
    )
    expect(screen.queryByText('İçerik')).not.toBeInTheDocument()
  })

  it('tetikleyiciye tıklayınca menüyü açar ve children render eder', async () => {
    render(
      <DropDownBox label="Ayarlar">
        <div>İçerik</div>
      </DropDownBox>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ayarlar' }))
    await waitFor(() => {
      expect(screen.getByText('İçerik')).toBeInTheDocument()
    })
  })

  it('dışarı tıklayınca menüyü kapatır ve onWindowClose çağırır', async () => {
    const onWindowClose = vi.fn()
    render(
      <DropDownBox label="Ayarlar" onWindowClose={onWindowClose}>
        <div>İçerik</div>
      </DropDownBox>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ayarlar' }))
    await waitFor(() => {
      expect(screen.getByText('İçerik')).toBeInTheDocument()
    })

    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('İçerik')).not.toBeInTheDocument()
    expect(onWindowClose).toHaveBeenCalledOnce()
  })

  it('notificationCount verildiğinde bildirim rozeti gösterir', () => {
    render(<DropDownBox label="Ayarlar" notificationCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('disabled iken tetikleyici buton disabled olur', () => {
    render(<DropDownBox label="Ayarlar" disabled />)
    expect(screen.getByRole('button', { name: 'Ayarlar' })).toBeDisabled()
  })

  it('closeOnAction true iken içerik tıklaması menüyü kapatır', async () => {
    render(
      <DropDownBox label="Ayarlar" closeOnAction>
        <button type="button">Uygula</button>
      </DropDownBox>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ayarlar' }))
    const applyButton = await screen.findByRole('button', { name: 'Uygula' })
    fireEvent.click(applyButton)
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: 'Uygula' }),
      ).not.toBeInTheDocument()
    })
  })

  it('trigger prop’u verildiğinde özel tetikleyiciyi render eder', async () => {
    render(
      <DropDownBox trigger={<span>Özel Tetikleyici</span>}>
        <div>İçerik</div>
      </DropDownBox>,
    )
    expect(screen.getByText('Özel Tetikleyici')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Özel Tetikleyici'))
    await waitFor(() => {
      expect(screen.getByText('İçerik')).toBeInTheDocument()
    })
  })
})
