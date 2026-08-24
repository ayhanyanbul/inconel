import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HTMLTable, type HTMLTableColumn } from './HTMLTable'

afterEach(cleanup)

interface Row {
  id: number
  name: string
}

const columns: HTMLTableColumn<Row>[] = [
  { key: 'name', title: 'Ad', sortable: true },
]

const data: Row[] = [
  { id: 1, name: 'Deniz' },
  { id: 2, name: 'Ayhan' },
  { id: 3, name: 'Berk' },
]

describe('HTMLTable', () => {
  it('kolon başlıklarını ve satır verilerini render eder', () => {
    render(<HTMLTable columns={columns} data={data} rowKey="id" />)

    expect(screen.getByText('Ad')).toBeInTheDocument()
    expect(screen.getByText('Deniz')).toBeInTheDocument()
    expect(screen.getByText('Ayhan')).toBeInTheDocument()
  })

  it('veri yokken "Kayıt bulunamadı" mesajını gösterir', () => {
    render(<HTMLTable columns={columns} data={[]} rowKey="id" />)

    expect(screen.getByText('Kayıt bulunamadı')).toBeInTheDocument()
  })

  it('sıralanabilir kolon başlığına tıklayınca satırları alfabetik sıralar', async () => {
    const user = userEvent.setup()
    render(<HTMLTable columns={columns} data={data} rowKey="id" />)

    await user.click(screen.getByText('Ad'))

    const rows = screen.getAllByRole('row').slice(1)
    expect(within(rows[0]).getByText('Ayhan')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Berk')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Deniz')).toBeInTheDocument()
  })

  it('satıra tıklandığında onRowClick ilgili satır verisiyle çağrılır', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(
      <HTMLTable
        columns={columns}
        data={data}
        rowKey="id"
        onRowClick={onRowClick}
      />,
    )

    await user.click(screen.getByText('Deniz'))

    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })

  it('selectable true iken tümünü seç kutusu tüm satırları seçer', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <HTMLTable
        columns={columns}
        data={data}
        rowKey="id"
        selectable
        onSelectionChange={onSelectionChange}
      />,
    )

    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])

    expect(onSelectionChange).toHaveBeenCalledWith([1, 2, 3])
  })

  it('pageSize sayfa sayısını kontrol eder ve İleri butonu sonraki sayfayı gösterir', async () => {
    const user = userEvent.setup()
    render(
      <HTMLTable columns={columns} data={data} rowKey="id" pageSize={1} />,
    )

    expect(screen.getByText('Deniz')).toBeInTheDocument()
    expect(screen.queryByText('Ayhan')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'İleri' }))

    expect(screen.getByText('Ayhan')).toBeInTheDocument()
    expect(screen.queryByText('Deniz')).not.toBeInTheDocument()
  })
})
