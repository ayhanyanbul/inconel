import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Input from './Input'

afterEach(cleanup)

describe('Input', () => {
  it('locale göre sayıyı biçimlendirir ve payload üretir', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Input
        label="Tutar"
        type="currency"
        value={1234.5}
        locale="tr-TR"
        currency="TRY"
        decimalScale={2}
        onChange={onChange}
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Tutar' })
    expect(input).toHaveValue('₺1.234,50')
    await user.click(input)
    await user.clear(input)
    await user.type(input, '25,75')
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rawValue: 25.75, eventType: 'change' }),
    )
  })

  it('telefon maskesi ve limit uygular', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <Input
        label="Telefon"
        type="phone"
        mask="(XXX) XXX XX XX"
        limit={10}
        defaultValue=""
        onChange={onChange}
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Telefon' })
    await user.type(input, '55512345678')
    expect(input).toHaveValue('(555) 123 45 67')
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rawValue: '5551234567' }),
    )
  })

  it('blur sırasında doğrular ve sayıyı yuvarlar', () => {
    const onChange = vi.fn()
    render(
      <Input
        label="Oran"
        type="number"
        defaultValue={1.239}
        decimalScale={2}
        roundMode="round"
        roundOnBlur
        min={1}
        max={10}
        onChange={onChange}
      />,
    )
    const input = screen.getByRole('textbox', { name: 'Oran' })
    fireEvent.focus(input)
    fireEvent.blur(input)
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rawValue: 1.24, eventType: 'blur', error: false }),
    )
  })

  it('zorunlu ve e-posta doğrulama hatasını erişilebilir şekilde gösterir', () => {
    render(
      <Input
        label="E-posta"
        type="email"
        defaultValue="hatalı"
        required
        validationMessages={{
          invalidEmail: 'Lütfen geçerli bir e-posta adresi girin.',
        }}
      />,
    )
    const input = screen.getByRole('textbox', { name: 'E-posta' })
    fireEvent.focus(input)
    fireEvent.blur(input)
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Lütfen geçerli bir e-posta adresi girin.',
    )
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('temizleme ve salt-okunur görünümü destekler', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    const { rerender } = render(
      <Input
        label="Kod"
        value="ABC"
        isClearable
        clearButtonLabel="Kod değerini temizle"
        onChange={onChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Kod değerini temizle' }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ rawValue: null, eventType: 'clear' }),
    )

    rerender(<Input label="Kod" value="ABC" readOnly />)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Kod')).toHaveTextContent('ABC')
  })
})
