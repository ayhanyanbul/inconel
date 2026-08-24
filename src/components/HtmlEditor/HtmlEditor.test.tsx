import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HtmlEditor } from './HtmlEditor'

afterEach(cleanup)

describe('HtmlEditor', () => {
  it('verilen value değerini textarea içinde gösterir', () => {
    render(<HtmlEditor value="<p>Merhaba</p>" />)

    expect(screen.getByRole('textbox')).toHaveValue('<p>Merhaba</p>')
  })

  it('değer boşken varsayılan Türkçe placeholder metnini gösterir', () => {
    render(<HtmlEditor />)

    expect(screen.getByPlaceholderText('HTML girin')).toBeInTheDocument()
  })

  it('özel placeholder verildiğinde onu kullanır', () => {
    render(<HtmlEditor placeholder="Kod girin" />)

    expect(screen.getByPlaceholderText('Kod girin')).toBeInTheDocument()
  })

  it('kullanıcı yazdığında onChange textarea değeriyle çağrılır', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<HtmlEditor value="" onChange={onChange} />)

    await user.type(screen.getByRole('textbox'), 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('readOnly true olduğunda textarea salt okunur olur', () => {
    render(<HtmlEditor value="sabit" readOnly />)

    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  it('inconel-html-editor class ve özel className birlikte uygulanır', () => {
    const { container } = render(<HtmlEditor className="custom-editor" />)

    expect(container.querySelector('.w-tc-editor')).toHaveClass(
      'inconel-html-editor',
      'custom-editor',
    )
  })
})
