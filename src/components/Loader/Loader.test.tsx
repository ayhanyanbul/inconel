import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-svg', () => ({
  ReactSVG: ({ className, src }: { className?: string; src: string }) => (
    <span className={className} data-testid="loader-logo" data-src={src} />
  ),
}))

import { Loader } from './Loader'

describe('Loader', () => {
  it('varsayılan olarak status rolü ve varsayılan etiketle render edilir', () => {
    render(<Loader />)

    const status = screen.getByRole('status')
    expect(status).toHaveClass('inconel-loader')
    expect(status).toHaveAttribute('aria-label', 'Yükleniyor...')
    expect(status).not.toHaveClass('inconel-loader--fullscreen')
  })

  it('fullscreen prop’u ilgili sınıfı ekler', () => {
    render(<Loader fullscreen />)

    expect(screen.getByRole('status')).toHaveClass(
      'inconel-loader--fullscreen',
    )
  })

  it('render false verildiğinde hiçbir şey render edilmez', () => {
    const { container } = render(<Loader render={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('özel label aria-label olarak yansır', () => {
    render(<Loader label="Lütfen bekleyin" />)

    expect(screen.getByRole('status')).toHaveAttribute(
      'aria-label',
      'Lütfen bekleyin',
    )
  })

  it('logo verildiğinde logo render edilir', () => {
    render(<Loader logo="/logo.svg" />)

    const logo = screen.getByTestId('loader-logo')
    expect(logo).toHaveClass('inconel-loader__logo')
    expect(logo).toHaveAttribute('data-src', '/logo.svg')
  })

  it('logo verilmediğinde logo render edilmez', () => {
    render(<Loader />)

    expect(screen.queryByTestId('loader-logo')).not.toBeInTheDocument()
  })
})
