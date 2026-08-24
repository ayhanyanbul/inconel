import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Tabs, type TabsItem } from './Tabs'

const items: TabsItem[] = [
  { id: 'first', label: 'Birinci', content: 'İlk içerik' },
  { id: 'second', label: 'İkinci', content: 'İkinci içerik' },
  { id: 'third', label: 'Üçüncü', content: 'Üçüncü içerik', disabled: true },
]

describe('Tabs', () => {
  it('ilk sekmeyi varsayılan olarak aktif gösterir ve içeriğini render eder', () => {
    render(<Tabs items={items} />)

    expect(screen.getByRole('tab', { name: 'Birinci' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tabpanel')).toHaveTextContent('İlk içerik')
  })

  it('sekmeye tıklayınca içerik değişir ve onChange çağrılır', () => {
    const onChange = vi.fn()
    render(<Tabs items={items} onChange={onChange} />)

    fireEvent.click(screen.getByRole('tab', { name: 'İkinci' }))

    expect(onChange).toHaveBeenCalledWith('second')
    expect(screen.getByRole('tab', { name: 'İkinci' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tabpanel')).toHaveTextContent('İkinci içerik')
  })

  it('disabled sekme disabled niteliğine sahiptir', () => {
    render(<Tabs items={items} />)

    expect(screen.getByRole('tab', { name: 'Üçüncü' })).toBeDisabled()
  })

  it('initialTab ile başlangıç sekmesini belirler', () => {
    render(<Tabs items={items} initialTab="second" />)

    expect(screen.getByRole('tab', { name: 'İkinci' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('tabData prop üzerinden sekmeleri index tabanlı id ile oluşturur', () => {
    render(
      <Tabs
        tabData={[
          { label: 'A', content: 'A içerik' },
          { label: 'B', content: 'B içerik' },
        ]}
      />,
    )

    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    fireEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('B içerik')
  })

  it('value verildiğinde kontrollü şekilde çalışır', () => {
    const onChange = vi.fn()

    function Controlled() {
      const [value, setValue] = useState('first')
      return (
        <Tabs
          items={items}
          value={value}
          onChange={(id) => {
            setValue(id)
            onChange(id)
          }}
        />
      )
    }

    render(<Controlled />)

    fireEvent.click(screen.getByRole('tab', { name: 'İkinci' }))

    expect(onChange).toHaveBeenCalledWith('second')
    expect(screen.getByRole('tab', { name: 'İkinci' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })
})
