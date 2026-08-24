import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DatePicker } from './DatePicker'

vi.mock('react-svg', () => ({
  ReactSVG: ({ className, src }: { className?: string; src: string }) => (
    <span className={className} data-src={src}>
      SVG
    </span>
  ),
}))

afterEach(cleanup)

function getDayCell(day: number) {
  const cells = screen
    .getAllByRole('gridcell')
    .filter((cell) => cell.textContent === String(day))
  expect(cells).toHaveLength(1)
  return cells[0]
}

describe('DatePicker', () => {
  it('label ve input alanını ilişkilendirerek render eder', () => {
    render(<DatePicker id="birth-date" label="Doğum tarihi" />)

    expect(screen.getByLabelText('Doğum tarihi')).toBeInTheDocument()
  })

  it('takvimden bir gün seçildiğinde onChange (name, date) ile çağrılır', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker
        id="date"
        name="date"
        label="Tarih"
        value={new Date('2026-07-01')}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByLabelText('Tarih'))
    await user.click(getDayCell(15))

    expect(onChange).toHaveBeenCalledTimes(1)
    const [name, value] = onChange.mock.calls[0]
    expect(name).toBe('date')
    expect(value).toBeInstanceOf(Date)
    expect((value as Date).getDate()).toBe(15)
  })

  it('errorMessage verildiğinde inconel-is-invalid class ve alert mesajı gösterir', () => {
    render(
      <DatePicker id="date" label="Tarih" errorMessage="Zorunlu alan" />,
    )

    expect(screen.getByLabelText('Tarih')).toHaveClass('inconel-is-invalid')
    expect(screen.getByRole('alert')).toHaveTextContent('Zorunlu alan')
  })

  it('disabled olduğunda input devre dışı kalır ve container class alır', () => {
    const { container } = render(
      <DatePicker id="date" label="Tarih" disabled />,
    )

    expect(screen.getByLabelText('Tarih')).toBeDisabled()
    expect(container.firstElementChild).toHaveClass('inconel-is-disabled')
  })

  it('isClearable ve değer varken temizleme butonu değeri null yapar', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <DatePicker
        id="date"
        name="date"
        label="Tarih"
        value={new Date('2026-07-01')}
        isClearable
        onChange={onChange}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(onChange).toHaveBeenCalledWith('date', null)
  })

  it('icon bir string olarak verildiğinde Svg bileşenini render eder', () => {
    render(<DatePicker id="date" label="Tarih" icon="/calendar.svg" />)

    expect(screen.getByText('SVG')).toHaveAttribute(
      'data-src',
      '/calendar.svg',
    )
  })

  it('removeLabel true olduğunda label render edilmez', () => {
    render(<DatePicker id="date" label="Tarih" removeLabel />)

    expect(screen.queryByText('Tarih')).not.toBeInTheDocument()
  })
})
