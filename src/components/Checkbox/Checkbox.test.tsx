import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('label ile render edilir ve tıklanınca onChange tetiklenir', () => {
    const onChange = vi.fn()
    render(<Checkbox label="Kabul ediyorum" onChange={onChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Kabul ediyorum' })
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledOnce()
  })

  it('disabled durumunda class ve disabled niteliğini yansıtır', () => {
    render(<Checkbox label="Devre dışı" disabled />)

    const checkbox = screen.getByRole('checkbox', { name: 'Devre dışı' })
    expect(checkbox).toBeDisabled()
    expect(checkbox.closest('.inconel-checkbox')).toHaveClass(
      'inconel-is-disabled',
    )
  })

  it('readOnly iken onChange tetiklenmez', () => {
    const onChange = vi.fn()
    render(<Checkbox label="Salt okunur" readOnly onChange={onChange} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Salt okunur' }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('errorMessage alert rolüyle gösterilir', () => {
    render(<Checkbox label="Alan" errorMessage="Bu alan zorunludur" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Bu alan zorunludur')
  })

  it('indeterminate özelliği input elementine yansır', () => {
    render(<Checkbox label="Kısmi" indeterminate />)

    const checkbox = screen.getByRole('checkbox', {
      name: 'Kısmi',
    }) as HTMLInputElement
    expect(checkbox.indeterminate).toBe(true)
  })
})
