import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Option } from './Option'

afterEach(cleanup)

describe('Option', () => {
  it('varsayılan durumda option rolüyle ve seçili olmadan render edilir', () => {
    render(<Option>Elma</Option>)

    const option = screen.getByRole('option', { name: 'Elma' })
    expect(option).toHaveClass('inconel-option')
    expect(option).not.toHaveClass('inconel-is-selected')
    expect(option).not.toHaveAttribute('aria-selected')
  })

  it('selected prop ile seçili durumunu yansıtır', () => {
    render(<Option selected>Armut</Option>)

    const option = screen.getByRole('option', { name: 'Armut' })
    expect(option).toHaveClass('inconel-is-selected')
    expect(option).toHaveAttribute('aria-selected', 'true')
  })

  it('disabled prop ile devre dışı durumunu yansıtır', () => {
    render(<Option disabled>Kayısı</Option>)

    const option = screen.getByRole('option', { name: 'Kayısı' })
    expect(option).toHaveClass('inconel-is-disabled')
    expect(option).toHaveAttribute('aria-disabled', 'true')
  })

  it('icon verildiğinde ikon alanını render eder', () => {
    render(<Option icon={<span data-testid="icon">★</span>}>Vişne</Option>)

    const icon = screen.getByTestId('icon')
    expect(icon.parentElement).toHaveClass('inconel-option__icon')
  })

  it('ekstra div nitelikleri ve olay yöneticileri iletilir', () => {
    const onClick = vi.fn()
    render(
      <Option onClick={onClick} className="custom" title="ipucu">
        Muz
      </Option>,
    )

    const option = screen.getByRole('option', { name: 'Muz' })
    expect(option).toHaveClass('custom')
    expect(option).toHaveAttribute('title', 'ipucu')
    fireEvent.click(option)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
