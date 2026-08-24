import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TextInput } from './TextInput'

afterEach(cleanup)

describe('TextInput', () => {
  it('zorunlu alanı yıldız ile işaretler ve boş bırakılınca hata gösterir', () => {
    render(
      <TextInput
        label="Kullanıcı adı"
        required
        defaultValue=""
        validationMessages={{ required: 'Kullanıcı adı gereklidir.' }}
      />,
    )

    const input = screen.getByRole('textbox', { name: 'Kullanıcı adı' })
    fireEvent.focus(input)
    fireEvent.blur(input)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Kullanıcı adı gereklidir.',
    )
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('isClearable ile temizle butonuna basınca null rawValue ile onChange tetiklenir', () => {
    const onChange = vi.fn()
    render(
      <TextInput
        label="Arama"
        value="deneme"
        isClearable
        clearButtonLabel="Aramayı temizle"
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Aramayı temizle' }))
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ rawValue: null, eventType: 'clear' }),
    )
  })

  it('readOnly modda düz metin olarak gösterir', () => {
    render(<TextInput label="Kod" value="XYZ" readOnly />)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Kod')).toHaveTextContent('XYZ')
  })
})
