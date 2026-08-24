import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DataGrid, type DataGridItem } from './DataGrid'

afterEach(cleanup)

const items: DataGridItem[] = [
  { label: 'Ad', value: 'Ayhan', key: 'name' },
  { label: 'Aktif', value: true, key: 'active' },
  { label: 'Boş', value: null, key: 'empty' },
]

describe('DataGrid', () => {
  it('etiket ve değerleri render eder, boolean/null değerleri biçimlendirir', () => {
    render(<DataGrid data={items} />)

    expect(screen.getByText('Ad')).toBeInTheDocument()
    expect(screen.getByText('Ayhan')).toBeInTheDocument()
    expect(screen.getByText('Yes')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('columns, size ve stil bayraklarına göre class isimlerini uygular', () => {
    const { container } = render(
      <DataGrid
        data={items}
        columns={4}
        size="compact"
        striped
        hoverable
        bordered
        className="custom-grid"
      />,
    )

    const root = container.firstElementChild
    expect(root).toHaveClass(
      'inconel-data-grid',
      'inconel-data-grid--4-col',
      'inconel-data-grid--compact',
      'inconel-data-grid--striped',
      'inconel-data-grid--hoverable',
      'inconel-data-grid--bordered',
      'custom-grid',
    )
  })

  it('loading durumunda class ekler ve spinner gösterir', () => {
    const { container } = render(<DataGrid data={items} loading />)

    expect(container.firstElementChild).toHaveClass('inconel-is-loading')
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('onItemClick verildiğinde satırları buton rolüyle tıklanabilir yapar', () => {
    const onItemClick = vi.fn()
    render(<DataGrid data={items} onItemClick={onItemClick} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(items.length)

    buttons[0].click()
    expect(onItemClick).toHaveBeenCalledWith(items[0], 0)
  })

  it('onItemClick verilmediğinde satırlar buton rolüne sahip olmaz', () => {
    render(<DataGrid data={items} />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('customValue verildiğinde formatGridValue yerine onu gösterir', () => {
    render(
      <DataGrid
        data={[{ label: 'Özel', value: 'x', customValue: <span>Özel içerik</span> }]}
      />,
    )

    expect(screen.getByText('Özel içerik')).toBeInTheDocument()
    expect(screen.queryByText('x')).not.toBeInTheDocument()
  })
})
