import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('içerik tooltip rolüyle ve children ile birlikte render edilir', () => {
    render(
      <Tooltip content="İpucu metni">
        <button type="button">Hedef</button>
      </Tooltip>,
    )

    expect(screen.getByRole('button', { name: 'Hedef' })).toBeInTheDocument()
    expect(screen.getByRole('tooltip')).toHaveTextContent('İpucu metni')
  })

  it('varsayılan placement top olarak uygulanır', () => {
    render(
      <Tooltip content="İpucu">
        <span>Hedef</span>
      </Tooltip>,
    )

    expect(screen.getByRole('tooltip').parentElement).toHaveClass(
      'inconel-tooltip--top',
    )
  })

  it('placement prop’u ilgili sınıfa yansır', () => {
    render(
      <Tooltip content="İpucu" placement="right">
        <span>Hedef</span>
      </Tooltip>,
    )

    expect(screen.getByRole('tooltip').parentElement).toHaveClass(
      'inconel-tooltip--right',
    )
  })

  it('özel className mevcut sınıflarla birlikte uygulanır', () => {
    render(
      <Tooltip content="İpucu" className="custom-tooltip">
        <span>Hedef</span>
      </Tooltip>,
    )

    expect(screen.getByRole('tooltip').parentElement).toHaveClass(
      'inconel-tooltip',
      'custom-tooltip',
    )
  })
})
