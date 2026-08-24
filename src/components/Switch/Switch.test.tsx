import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './Switch'

describe('Switch', () => {
  it('tıklanınca onChange ve onCheckedChange çalışır', () => {
    const onChange = vi.fn()
    const onCheckedChange = vi.fn()
    render(
      <Switch
        isChecked={false}
        onChange={onChange}
        onCheckedChange={onCheckedChange}
      />,
    )

    fireEvent.click(screen.getByRole('checkbox'))

    expect(onChange).toHaveBeenCalledOnce()
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('checked durumu ve rengi sınıflara yansır', () => {
    render(<Switch isChecked color="green" sizing="large" />)

    const track = screen.getByRole('checkbox').closest('.inconel-switch')
    expect(track).toHaveClass(
      'inconel-switch--large',
      'inconel-switch--green',
      'inconel-is-selected',
    )
  })

  it('disabled durumunda class ve disabled niteliğini yansıtır', () => {
    render(<Switch disabled />)

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
    expect(checkbox.closest('.inconel-switch')).toHaveClass(
      'inconel-is-disabled',
    )
  })

  it('onLabel ve offLabel durum metnini gösterir', () => {
    const { rerender } = render(
      <Switch isChecked={false} offLabel="Kapalı" onLabel="Açık" />,
    )
    expect(screen.getByText('Kapalı')).toBeInTheDocument()

    rerender(<Switch isChecked offLabel="Kapalı" onLabel="Açık" />)
    expect(screen.getByText('Açık')).toBeInTheDocument()
  })

  it('markerVals verildiğinde durum metni yerine marker gösterilir', () => {
    render(<Switch isChecked={false} markerVals={['Kapalı M', 'Açık M']} />)

    expect(screen.getByText('Kapalı M')).toBeInTheDocument()
  })

  it('render false iken hiçbir şey render edilmez', () => {
    const { container } = render(<Switch render={false} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('label prop’u etiket olarak gösterilir', () => {
    render(<Switch label="Bildirimler" />)

    expect(screen.getByText('Bildirimler')).toBeInTheDocument()
  })
})
