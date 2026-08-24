import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import FieldFeedback from './FieldFeedback'

describe('FieldFeedback', () => {
  it('errorMessage varken alert rolüyle ve error sınıfıyla gösterilir', () => {
    render(
      <FieldFeedback
        errorMessage="Bu alan zorunludur"
        hintId="hint"
        errorId="error"
      />,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('inconel-field-feedback', 'inconel-is-error')
    expect(alert).toHaveAttribute('id', 'error')
    expect(alert).toHaveTextContent('Bu alan zorunludur')
  })

  it('errorMessage yokken hint gösterilir', () => {
    render(
      <FieldFeedback hint="Yardımcı bilgi" hintId="hint" errorId="error" />,
    )

    const hint = screen.getByText('Yardımcı bilgi')
    expect(hint).toHaveClass('inconel-field-feedback', 'inconel-is-hint')
    expect(hint).toHaveAttribute('id', 'hint')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('errorMessage öncelikli olarak hint yerine gösterilir', () => {
    render(
      <FieldFeedback
        hint="Yardımcı bilgi"
        errorMessage="Hata mesajı"
        hintId="hint"
        errorId="error"
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Hata mesajı')
    expect(screen.queryByText('Yardımcı bilgi')).not.toBeInTheDocument()
  })

  it('hint ve errorMessage yokken hiçbir şey render edilmez', () => {
    const { container } = render(
      <FieldFeedback hintId="hint" errorId="error" />,
    )

    expect(container).toBeEmptyDOMElement()
  })
})
