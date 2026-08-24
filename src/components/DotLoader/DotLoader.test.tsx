import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DotLoader } from './DotLoader'

describe('DotLoader', () => {
  it('varsayılan olarak status rolü ve varsayılan etiketle render edilir', () => {
    render(<DotLoader />)

    const status = screen.getByRole('status')
    expect(status).toHaveClass('inconel-dot-loader')
    expect(status).toHaveAttribute('aria-label', 'Yükleniyor...')
  })

  it('özel label aria-label olarak yansır', () => {
    render(<DotLoader label="Kaydediliyor..." />)

    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Kaydediliyor...',
    )
  })

  it('özel className mevcut sınıflarla birlikte uygulanır', () => {
    render(<DotLoader className="custom-loader" />)

    expect(screen.getByRole('status')).toHaveClass(
      'inconel-dot-loader',
      'custom-loader',
    )
  })
})
