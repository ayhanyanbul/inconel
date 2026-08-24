import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Filter } from './Filter'

describe('Filter', () => {
  it('içeriği inconel-filter__content içinde render eder', () => {
    render(
      <Filter>
        <span>Filtre alanı</span>
      </Filter>,
    )

    expect(screen.getByText('Filtre alanı').parentElement).toHaveClass(
      'inconel-filter__content',
    )
  })

  it('onClear verilmediğinde temizle butonu render edilmez', () => {
    render(<Filter>İçerik</Filter>)

    expect(
      screen.queryByRole('button', { name: 'Temizle' }),
    ).not.toBeInTheDocument()
  })

  it('onClear verildiğinde temizle butonu render edilir ve tıklanınca çağırılır', async () => {
    const onClear = vi.fn()
    render(<Filter onClear={onClear}>İçerik</Filter>)

    const button = screen.getByRole('button', { name: 'Temizle' })
    fireEvent.click(button)

    // Button bileşeni tıklamayı debounce ettiği için çağrı asenkron gelir
    await waitFor(() => expect(onClear).toHaveBeenCalledTimes(1))
  })

  it('özel clearLabel metnini gösterir', () => {
    render(<Filter onClear={vi.fn()} clearLabel="Sıfırla" />)

    expect(screen.getByRole('button', { name: 'Sıfırla' })).toBeInTheDocument()
  })

  it('dışarıdan verilen className ile inconel-filter classını birleştirir', () => {
    const { container } = render(<Filter className="custom-filter" />)

    expect(container.firstChild).toHaveClass('inconel-filter', 'custom-filter')
  })
})
