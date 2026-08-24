import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CustomizableSwitch } from './CustomizableSwitch'

afterEach(cleanup)

describe('CustomizableSwitch', () => {
  it('varsayılan olarak işaretli (checked) render edilir', () => {
    render(<CustomizableSwitch />)

    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveClass('inconel-customizable-switch', 'inconel-is-checked')
    expect(switchEl).toHaveAttribute('aria-checked', 'true')
  })

  it('tıklandığında durumu tersine çevirir ve onClick çağrılır', () => {
    const onClick = vi.fn()
    render(<CustomizableSwitch isChecked onClick={onClick} />)

    const switchEl = screen.getByRole('switch')
    fireEvent.click(switchEl)

    expect(onClick).toHaveBeenCalledWith(false)
    expect(switchEl).toHaveAttribute('aria-checked', 'false')
    expect(switchEl).not.toHaveClass('inconel-is-checked')
  })

  it('Enter ve boşluk tuşlarıyla da durumu değiştirir', () => {
    const onClick = vi.fn()
    render(<CustomizableSwitch isChecked={false} onClick={onClick} />)

    const switchEl = screen.getByRole('switch')
    fireEvent.keyDown(switchEl, { key: 'Enter' })
    expect(onClick).toHaveBeenLastCalledWith(true)

    fireEvent.keyDown(switchEl, { key: ' ' })
    expect(onClick).toHaveBeenLastCalledWith(false)
  })

  it('disabled durumunda tıklama ve klavye etkileşimini yok sayar', () => {
    const onClick = vi.fn()
    render(<CustomizableSwitch isChecked disabled onClick={onClick} />)

    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveClass('inconel-is-disabled')
    expect(switchEl).toHaveAttribute('aria-disabled', 'true')
    expect(switchEl).toHaveAttribute('tabindex', '-1')

    fireEvent.click(switchEl)
    fireEvent.keyDown(switchEl, { key: 'Enter' })
    expect(onClick).not.toHaveBeenCalled()
  })

  it('render prop false olduğunda hiçbir şey render etmez', () => {
    const { container } = render(<CustomizableSwitch render={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('isChecked prop değiştiğinde iç durumu senkronize eder', () => {
    const { rerender } = render(<CustomizableSwitch isChecked={false} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')

    rerender(<CustomizableSwitch isChecked />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('children dizisini marker ve background alanlarına dağıtır', () => {
    render(
      <CustomizableSwitch>
        <span data-testid="marker-icon">M</span>
        <span data-testid="background-icon">B</span>
      </CustomizableSwitch>,
    )

    expect(
      screen.getByTestId('marker-icon').closest(
        '.inconel-customizable-switch__marker',
      ),
    ).not.toBeNull()
    expect(
      screen.getByTestId('background-icon').closest(
        '.inconel-customizable-switch__background',
      ),
    ).not.toBeNull()
  })

  it('id ve className proplarını dış elemente uygular', () => {
    render(<CustomizableSwitch id="my-switch" className="custom-class" />)

    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveAttribute('id', 'my-switch')
    expect(switchEl).toHaveClass('custom-class')
  })
})
