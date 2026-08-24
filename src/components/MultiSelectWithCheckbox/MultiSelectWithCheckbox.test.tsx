import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MultiSelectWithCheckbox } from './MultiSelectWithCheckbox'

afterEach(cleanup)

const options = [
  { label: 'Kırmızı', value: 'red' },
  { label: 'Yeşil', value: 'green' },
]

describe('MultiSelectWithCheckbox', () => {
  it('MultiSelect ile aynı davranışta checkbox listesi render eder', () => {
    render(
      <MultiSelectWithCheckbox options={options} value={['red']} label="Renkler" />,
    )

    expect(screen.getByRole('checkbox', { name: 'Kırmızı' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Yeşil' })).not.toBeChecked()
  })

  it('seçim değiştiğinde onChange ile güncel diziyi bildirir', () => {
    const onChange = vi.fn()
    render(
      <MultiSelectWithCheckbox
        options={options}
        value={['red']}
        onChange={onChange}
        label="Renkler"
      />,
    )

    screen.getByRole('checkbox', { name: 'Yeşil' }).click()

    expect(onChange).toHaveBeenCalledWith(['red', 'green'])
  })
})
