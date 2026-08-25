import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { InputRadio } from './InputRadio'

describe('InputRadio', () => {
  it('label ile render edilir ve tıklanınca onChange tetiklenir', () => {
    const onChange = vi.fn()
    render(<InputRadio label="Onayla" name="approve" onChange={onChange} />)

    const radio = screen.getByRole('radio', { name: 'Onayla' })
    fireEvent.click(radio)

    expect(onChange).toHaveBeenCalledOnce()
  })

  it('isSelected ile işaretli render edilir', () => {
    render(<InputRadio label="Seçili" isSelected onChange={() => {}} />)

    expect(screen.getByRole('radio', { name: 'Seçili' })).toBeChecked()
  })

  it('label verilmediğinde label elementi render edilmez', () => {
    const { container } = render(<InputRadio />)

    expect(container.querySelector('label')).not.toBeInTheDocument()
  })

  it('farklı name değerleriyle bağımsız radio olarak çalışır', () => {
    const onChangeApprove = vi.fn()
    const onChangeReject = vi.fn()
    render(
      <>
        <InputRadio
          name="approve"
          label="Onayla"
          isSelected={false}
          onChange={onChangeApprove}
        />
        <InputRadio
          name="reject"
          label="Reddet"
          isSelected={false}
          onChange={onChangeReject}
        />
      </>,
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Reddet' }))

    expect(onChangeReject).toHaveBeenCalledOnce()
    expect(onChangeApprove).not.toHaveBeenCalled()
  })

  it('disabled durumunda class ve disabled niteliğini yansıtır', () => {
    render(<InputRadio label="Devre dışı" disabled />)

    const radio = screen.getByRole('radio', { name: 'Devre dışı' })
    expect(radio).toBeDisabled()
    expect(radio.closest('.inconel-input-radio')).toHaveClass(
      'inconel-is-disabled',
    )
  })

  it('readOnly iken salt okunur değer gösterir, input render edilmez', () => {
    render(<InputRadio label="Salt okunur" value="Değer" readOnly />)

    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.getByText('Değer')).toBeInTheDocument()
  })

  it('render=false iken hiçbir şey render edilmez', () => {
    const { container } = render(<InputRadio label="Gizli" render={false} />)

    expect(container).toBeEmptyDOMElement()
  })
})
