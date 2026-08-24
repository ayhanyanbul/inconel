import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { OptionWithIcon } from './OptionWithIcon'

afterEach(cleanup)

describe('OptionWithIcon', () => {
  it('ikon ile birlikte option rolünde render edilir', () => {
    render(
      <OptionWithIcon icon={<span data-testid="flag-icon">🚩</span>}>
        Türkiye
      </OptionWithIcon>,
    )

    const option = screen.getByRole('option', { name: /Türkiye/ })
    expect(option).toHaveClass('inconel-option')
    expect(screen.getByTestId('flag-icon').parentElement).toHaveClass(
      'inconel-option__icon',
    )
  })

  it('icon verilmediğinde ikon alanı render edilmez', () => {
    render(<OptionWithIcon>Almanya</OptionWithIcon>)

    const option = screen.getByRole('option', { name: 'Almanya' })
    expect(option.querySelector('.inconel-option__icon')).toBeNull()
  })

  it('selected ve disabled durumlarını class ve aria nitelikleriyle yansıtır', () => {
    render(
      <OptionWithIcon
        icon={<span>★</span>}
        selected
        disabled
      >
        Fransa
      </OptionWithIcon>,
    )

    const option = screen.getByRole('option', { name: /Fransa/ })
    expect(option).toHaveClass('inconel-is-selected', 'inconel-is-disabled')
    expect(option).toHaveAttribute('aria-selected', 'true')
    expect(option).toHaveAttribute('aria-disabled', 'true')
  })
})
