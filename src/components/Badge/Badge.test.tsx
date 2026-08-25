import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './Badge'

describe('Badge', () => {
  it('text prop üzerinden içerik render eder', () => {
    render(<Badge text="Yeni" />)
    expect(screen.getByText('Yeni')).toBeInTheDocument()
  })

  it('text verilmediğinde children render eder', () => {
    render(<Badge>Taslak</Badge>)
    expect(screen.getByText('Taslak')).toBeInTheDocument()
  })

  it('text ve children birlikte verildiğinde text önceliklidir', () => {
    render(<Badge text="Yeni">Taslak</Badge>)
    expect(screen.getByText('Yeni')).toBeInTheDocument()
    expect(screen.queryByText('Taslak')).not.toBeInTheDocument()
  })

  it('varsayılan variant ve size class’larını uygular', () => {
    render(<Badge text="Varsayılan" />)
    expect(screen.getByText('Varsayılan')).toHaveClass(
      'inconel-badge',
      'inconel-badge--primary',
      'inconel-badge--md',
    )
  })

  it('verilen variant ve size class’larını uygular', () => {
    render(<Badge text="Tehlike" variant="danger" size="lg" />)
    expect(screen.getByText('Tehlike')).toHaveClass(
      'inconel-badge--danger',
      'inconel-badge--lg',
    )
  })

  it('özel className’i korur', () => {
    render(<Badge text="Özel" className="custom-badge" />)
    expect(screen.getByText('Özel')).toHaveClass('custom-badge')
  })
})
