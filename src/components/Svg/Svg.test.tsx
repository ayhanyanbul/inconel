import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Svg from './Svg'

vi.mock('react-svg', () => ({
  ReactSVG: ({
    className,
    src,
    title,
  }: {
    className?: string
    src: string
    title?: string
  }) => (
    <span className={className} data-src={src} title={title}>
      SVG
    </span>
  ),
}))

afterEach(cleanup)

describe('Svg', () => {
  it('inconel prefixi ve özel className ile render edilir', () => {
    render(<Svg src="/icons/check.svg" title="Onay" className="custom-icon" />)

    expect(screen.getByTitle('Onay')).toHaveClass('inconel-svg', 'custom-icon')
    expect(screen.getByTitle('Onay')).toHaveAttribute(
      'data-src',
      '/icons/check.svg',
    )
  })

  it('render false veya src eksikken render edilmez', () => {
    const { container, rerender } = render(
      <Svg src="/icons/check.svg" render={false} />,
    )
    expect(container).toBeEmptyDOMElement()

    rerender(<Svg />)
    expect(container).toBeEmptyDOMElement()
  })
})
