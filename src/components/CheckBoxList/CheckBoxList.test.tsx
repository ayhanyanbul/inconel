import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckBoxList } from './CheckBoxList'

const fruitOptions = [
  { value: 'apple', label: 'Elma' },
  { value: 'pear', label: 'Armut' },
  { value: 'banana', label: 'Muz' },
]

describe('CheckBoxList', () => {
  it('seçenekleri render eder ve tıklanınca onChange(selected, unselected) tetiklenir', () => {
    const onChange = vi.fn()
    render(<CheckBoxList options={fruitOptions} onChange={onChange} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Elma' }))

    expect(onChange).toHaveBeenCalledWith(
      [{ value: 'apple', label: 'Elma' }],
      [
        { value: 'pear', label: 'Armut' },
        { value: 'banana', label: 'Muz' },
      ],
    )
  })

  it('defaultSelectedOptions ile başlangıç seçimini uygular', () => {
    render(
      <CheckBoxList
        options={fruitOptions}
        defaultSelectedOptions={['pear']}
      />,
    )

    expect(screen.getByRole('checkbox', { name: 'Armut' })).toBeChecked()
    expect(screen.getByText('1 seçildi')).toBeInTheDocument()
  })

  it('multiple=false iken tek seçime izin verir', () => {
    render(
      <CheckBoxList
        options={fruitOptions}
        multiple={false}
        defaultSelectedOptions={['apple']}
      />,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: 'Armut' }))

    expect(screen.getByRole('checkbox', { name: 'Elma' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Armut' })).toBeChecked()
  })

  it('arama kutusu listeyi filtreler', () => {
    render(<CheckBoxList options={fruitOptions} />)

    fireEvent.change(screen.getByPlaceholderText('Ara'), {
      target: { value: 'arm' },
    })

    expect(screen.getByRole('checkbox', { name: 'Armut' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Elma' })).not.toBeInTheDocument()
  })

  it('transferMode iki kutulu bir görünüm render eder', () => {
    render(<CheckBoxList options={fruitOptions} transferMode />)

    expect(screen.getByText('Veriler')).toBeInTheDocument()
    expect(screen.getByText('Seçilenler')).toBeInTheDocument()
  })

  it('transferMode: tümünü aktar ve tümünü temizle çalışır', () => {
    render(<CheckBoxList options={fruitOptions} transferMode />)

    fireEvent.click(screen.getByRole('button', { name: 'Tümünü aktar' }))
    expect(screen.getByText('3 seçildi')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tümünü temizle' }))
    expect(screen.getByText('0 seçildi')).toBeInTheDocument()
  })

  it('seçenek yokken emptyText gösterir', () => {
    render(<CheckBoxList options={[]} emptyText="Veri yok" />)

    expect(screen.getByText('Veri yok')).toBeInTheDocument()
  })

  it('disabled durumunda class ekler ve toggle çalışmaz', () => {
    const onChange = vi.fn()
    const { container } = render(
      <CheckBoxList options={fruitOptions} disabled onChange={onChange} />,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: 'Elma' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(container.querySelector('.inconel-checkbox-list')).toHaveClass(
      'inconel-is-disabled',
    )
  })
})
