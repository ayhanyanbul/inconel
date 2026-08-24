import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CurrencyInput } from './CurrencyInput'

afterEach(cleanup)

describe('CurrencyInput', () => {
  it('varsayılan olarak TRY para birimiyle biçimlendirir', () => {
    render(<CurrencyInput label="Tutar" value={1000} decimalScale={0} />)

    expect(screen.getByRole('textbox', { name: 'Tutar' })).toHaveValue(
      '₺1.000',
    )
  })

  it('currency prop ile farklı bir para birimi uygular', () => {
    render(
      <CurrencyInput
        label="Fiyat"
        value={10}
        locale="en-US"
        currency="USD"
        decimalScale={2}
      />,
    )

    expect(screen.getByRole('textbox', { name: 'Fiyat' })).toHaveValue(
      '$10.00',
    )
  })

  it('type prop dışarıdan verilse bile currency olarak sabit kalır', () => {
    const onChange = vi.fn()
    render(
      <CurrencyInput
        label="Bakiye"
        defaultValue={0}
        decimalScale={2}
        onChange={onChange}
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Bakiye' })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '25' } })
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rawValue: 25, eventType: 'change' }),
    )
  })

  it('required alanı işaretler ve boş değerde hata mesajını gösterir', () => {
    render(
      <CurrencyInput
        label="Tutar"
        required
        defaultValue={null}
        validationMessages={{ required: 'Bu alan zorunludur.' }}
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Tutar' })
    fireEvent.focus(input)
    fireEvent.blur(input)
    expect(screen.getByRole('alert')).toHaveTextContent('Bu alan zorunludur.')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
