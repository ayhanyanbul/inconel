import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { CheckboxGroup } from './CheckboxGroup'

describe('CheckboxGroup', () => {
  it('seçim listesini günceller', () => {
    const onChange = vi.fn()
    render(
      <CheckboxGroup
        options={[{ label: 'A', value: 'a' }]}
        value={[]}
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('checkbox', { name: 'A' }))
    expect(onChange).toHaveBeenCalledWith(['a'])
  })
})
