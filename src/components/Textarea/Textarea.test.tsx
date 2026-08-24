import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Textarea from './Textarea'

afterEach(cleanup)

describe('Textarea', () => {
  it('label ve zorunlu işaretini gösterir', () => {
    render(<Textarea label="Açıklama" required />)

    const textarea = screen.getByRole('textbox', { name: 'Açıklama' })
    expect(textarea).toBeRequired()
    expect(screen.getByText('*', { exact: false })).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })

  it('errorMessage varsa hatayı erişilebilir şekilde gösterir ve hint yerine geçer', () => {
    render(
      <Textarea
        label="Not"
        hint="En fazla 200 karakter"
        errorMessage="Bu alan zorunludur."
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Bu alan zorunludur.',
    )
    expect(screen.queryByText('En fazla 200 karakter')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Not' })).toHaveAttribute(
      'aria-invalid',
      'true',
    )
  })

  it('hint mesajını errorMessage yokken gösterir', () => {
    render(<Textarea label="Not" hint="En fazla 200 karakter" />)

    expect(screen.getByText('En fazla 200 karakter')).toHaveClass(
      'inconel-field-feedback',
      'inconel-is-hint',
    )
  })

  it('fullWidth prop ile ilgili class eklenir', () => {
    const { container } = render(<Textarea label="Not" fullWidth />)

    expect(container.firstChild).toHaveClass(
      'inconel-field',
      'inconel-field--full-width',
    )
  })

  it('resize prop stil olarak uygulanır', () => {
    render(<Textarea label="Not" resize="none" />)

    expect(screen.getByRole('textbox', { name: 'Not' })).toHaveStyle({
      resize: 'none',
    })
  })

  it('değişiklikleri native onChange ile bildirir', () => {
    const onChange = vi.fn()
    render(<Textarea label="Mesaj" onChange={onChange} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Mesaj' }), {
      target: { value: 'Merhaba' },
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('textbox', { name: 'Mesaj' })).toHaveValue(
      'Merhaba',
    )
  })

  it('disabled durumunda düzenlenemez', () => {
    render(<Textarea label="Not" disabled />)

    expect(screen.getByRole('textbox', { name: 'Not' })).toBeDisabled()
  })
})
