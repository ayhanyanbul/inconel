import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LoaderMini } from './LoaderMini'

describe('LoaderMini', () => {
  it('show olmadığında render edilmez', () => {
    const { container } = render(<LoaderMini />)

    expect(container).toBeEmptyDOMElement()
  })

  it('show true iken status rolüyle render edilir', () => {
    render(<LoaderMini show />)

    expect(screen.getByRole('status')).toHaveClass('inconel-loader-mini')
  })

  it('özel className mevcut sınıflarla birlikte uygulanır', () => {
    render(<LoaderMini show className="custom-mini" />)

    expect(screen.getByRole('status')).toHaveClass(
      'inconel-loader-mini',
      'custom-mini',
    )
  })
})
