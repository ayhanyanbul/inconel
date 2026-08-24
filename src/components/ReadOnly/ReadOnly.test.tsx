import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ReadOnly } from './ReadOnly'

describe('ReadOnly', () => {
  it('label ve value birlikte gösterilir', () => {
    render(<ReadOnly label="Ad Soyad" value="Ayhan Yanbul" />)

    expect(screen.getByText('Ad Soyad')).toHaveClass(
      'inconel-read-only__label',
    )
    expect(screen.getByText('Ayhan Yanbul')).toHaveClass(
      'inconel-read-only__value',
    )
  })

  it('value boş olduğunda varsayılan emptyValue gösterilir', () => {
    render(<ReadOnly label="Ad Soyad" />)

    expect(screen.getByText('—')).toHaveClass('inconel-read-only__value')
  })

  it('özel emptyValue value boşken kullanılır', () => {
    render(<ReadOnly label="Ad Soyad" value="" emptyValue="Belirtilmemiş" />)

    expect(screen.getByText('Belirtilmemiş')).toBeInTheDocument()
  })

  it('label verilmediğinde label alanı render edilmez', () => {
    render(<ReadOnly value="Değer" />)

    expect(
      screen.queryByText('', { selector: '.inconel-read-only__label' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Değer')).toBeInTheDocument()
  })

  it('özel className mevcut sınıflarla birlikte uygulanır', () => {
    const { container } = render(
      <ReadOnly label="Ad" value="Değer" className="custom-read-only" />,
    )

    expect(container.firstChild).toHaveClass(
      'inconel-read-only',
      'custom-read-only',
    )
  })
})
