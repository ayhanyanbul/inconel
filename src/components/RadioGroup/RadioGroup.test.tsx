import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RadioGroup } from './RadioGroup'

afterEach(cleanup)

describe('RadioGroup', () => {
  const options = [
    { label: 'Kredi Kartı', value: 'credit-card' },
    { label: 'Havale', value: 'wire-transfer' },
    { label: 'Kapıda Ödeme', value: 'cash-on-delivery', disabled: true },
  ]

  it('seçili değeri işaretli gösterir', () => {
    render(
      <RadioGroup name="payment" options={options} value="wire-transfer" />,
    )

    expect(screen.getByRole('radio', { name: 'Havale' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Kredi Kartı' })).not.toBeChecked()
  })

  it('bir seçenek tıklandığında onChange değeriyle çağrılır', () => {
    const onChange = vi.fn()
    render(
      <RadioGroup
        name="payment"
        options={options}
        value="credit-card"
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Havale' }))
    expect(onChange).toHaveBeenCalledWith('wire-transfer')
  })

  it('disabled seçenek etkileşime kapalıdır', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(
      <RadioGroup
        name="payment"
        options={options}
        value="credit-card"
        onChange={onChange}
      />,
    )

    const disabledOption = screen.getByRole('radio', { name: 'Kapıda Ödeme' })
    expect(disabledOption).toBeDisabled()
    await user.click(disabledOption)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('tüm radio girdileri aynı name özniteliğini paylaşır', () => {
    render(
      <RadioGroup name="payment" options={options} value="credit-card" />,
    )

    for (const option of options) {
      expect(
        screen.getByRole('radio', {
          name: typeof option.label === 'string' ? option.label : undefined,
        }),
      ).toHaveAttribute('name', 'payment')
    }
  })

  it('className prop dış sarmalayıcıya eklenir', () => {
    const { container } = render(
      <RadioGroup
        name="payment"
        options={options}
        className="custom-class"
      />,
    )

    expect(container.firstChild).toHaveClass(
      'inconel-radio-group',
      'custom-class',
    )
  })
})
