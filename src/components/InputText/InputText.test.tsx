import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { InputText } from './InputText'

afterEach(cleanup)

describe('InputText', () => {
  it('metin girişini olduğu gibi değiştirir ve onChange payload üretir', () => {
    const onChange = vi.fn()
    render(<InputText label="Ad" defaultValue="" onChange={onChange} />)

    const input = screen.getByRole('textbox', { name: 'Ad' })
    fireEvent.change(input, { target: { value: 'Ayhan' } })

    expect(input).toHaveValue('Ayhan')
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rawValue: 'Ayhan', eventType: 'change' }),
    )
  })

  it('disabled durumunda giriş devre dışı kalır', () => {
    render(<InputText label="Ad" disabled defaultValue="" />)

    expect(screen.getByRole('textbox', { name: 'Ad' })).toBeDisabled()
  })

  it('fullWidth prop verildiğinde ilgili class eklenir', () => {
    const { container } = render(
      <InputText label="Ad" fullWidth defaultValue="" />,
    )

    expect(container.firstChild).toHaveClass(
      'inconel-field',
      'inconel-field--full-width',
    )
  })
})
