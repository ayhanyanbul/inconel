import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MultiSelect, type MultiSelectOption } from './MultiSelect'

afterEach(cleanup)

const options: MultiSelectOption[] = [
  { label: 'Kırmızı', value: 'red' },
  { label: 'Yeşil', value: 'green' },
  { label: 'Mavi', value: 'blue', disabled: true },
]

describe('MultiSelect', () => {
  it('seçili değerleri işaretli gösterir', () => {
    render(<MultiSelect options={options} value={['green']} label="Renkler" />)

    expect(screen.getByRole('checkbox', { name: 'Kırmızı' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Yeşil' })).toBeChecked()
  })

  it('bir seçeneği işaretleyince value dizisine ekler', () => {
    const onChange = vi.fn()
    render(
      <MultiSelect
        options={options}
        value={['green']}
        onChange={onChange}
        label="Renkler"
      />,
    )

    screen.getByRole('checkbox', { name: 'Kırmızı' }).click()

    expect(onChange).toHaveBeenCalledWith(['green', 'red'])
  })

  it('işaretli bir seçeneği kaldırınca value dizisinden çıkarır', () => {
    const onChange = vi.fn()
    render(
      <MultiSelect
        options={options}
        value={['green', 'red']}
        onChange={onChange}
        label="Renkler"
      />,
    )

    screen.getByRole('checkbox', { name: 'Yeşil' }).click()

    expect(onChange).toHaveBeenCalledWith(['red'])
  })

  it('disabled seçenek tıklanamaz ve onChange tetiklenmez', () => {
    const onChange = vi.fn()
    render(
      <MultiSelect options={options} value={[]} onChange={onChange} label="Renkler" />,
    )

    const disabledOption = screen.getByRole('checkbox', { name: 'Mavi' })
    expect(disabledOption).toBeDisabled()

    disabledOption.click()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('label ve className fieldset üzerinde render edilir', () => {
    const { container } = render(
      <MultiSelect options={options} label="Renkler" className="custom-multi" />,
    )

    expect(screen.getByText('Renkler').tagName).toBe('LEGEND')
    expect(container.querySelector('fieldset')).toHaveClass(
      'inconel-multi-select',
      'custom-multi',
    )
  })
})
