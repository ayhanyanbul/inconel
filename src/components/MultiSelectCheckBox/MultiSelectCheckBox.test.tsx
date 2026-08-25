import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MultiSelectCheckBox } from './MultiSelectCheckBox'

const fruitOptions = [
  { value: 'apple', label: 'Elma' },
  { value: 'pear', label: 'Armut' },
  { value: 'banana', label: 'Muz' },
]

describe('MultiSelectCheckBox', () => {
  it('tıklanınca seçenekleri açar ve seçim onChange tetikler', () => {
    const onChange = vi.fn()
    render(<MultiSelectCheckBox options={fruitOptions} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Elma' }))

    expect(onChange).toHaveBeenCalledWith([{ value: 'apple', label: 'Elma' }])
  })

  it('birden fazla seçimde özet metni gösterir', () => {
    render(
      <MultiSelectCheckBox
        options={fruitOptions}
        defaultSelectedOptions={[fruitOptions[0], fruitOptions[1]]}
      />,
    )

    expect(screen.getByDisplayValue('2 öğe seçili')).toBeInTheDocument()
  })

  it('tek seçimde seçeneğin etiketini gösterir', () => {
    render(
      <MultiSelectCheckBox
        options={fruitOptions}
        defaultSelectedOptions={[fruitOptions[0]]}
      />,
    )

    expect(screen.getByDisplayValue('Elma')).toBeInTheDocument()
  })

  it('tümünü seç çalışır', () => {
    const onChange = vi.fn()
    render(<MultiSelectCheckBox options={fruitOptions} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tümünü Seç' }))

    expect(onChange).toHaveBeenCalledWith(fruitOptions)
  })

  it('arama kutusu listeyi filtreler', () => {
    render(<MultiSelectCheckBox options={fruitOptions} isSearchable />)

    fireEvent.click(screen.getByRole('button'))
    fireEvent.change(screen.getByPlaceholderText('Ara'), {
      target: { value: 'arm' },
    })

    expect(screen.getByRole('checkbox', { name: 'Armut' })).toBeInTheDocument()
    expect(
      screen.queryByRole('checkbox', { name: 'Elma' }),
    ).not.toBeInTheDocument()
  })

  it('seçenek yokken noDataMessage gösterir', () => {
    render(<MultiSelectCheckBox options={[]} noDataMessage="Veri yok" />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByText('Veri yok')).toBeInTheDocument()
  })

  it('isDisabled iken açılmaz', () => {
    render(<MultiSelectCheckBox options={fruitOptions} isDisabled />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('selectionLimit sınırını aşınca yeni seçime izin vermez', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectCheckBox
        options={fruitOptions}
        selectionLimit={1}
        defaultSelectedOptions={[fruitOptions[0]]}
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Armut' }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('errorMessage dışarıda gösterilir', () => {
    render(
      <MultiSelectCheckBox options={fruitOptions} errorMessage="Zorunlu alan" />,
    )

    expect(screen.getByText('Zorunlu alan')).toBeInTheDocument()
  })
})
