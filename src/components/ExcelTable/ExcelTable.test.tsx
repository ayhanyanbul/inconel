import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { ExcelTable, type ExcelTableColumn } from './ExcelTable'

afterEach(cleanup)

interface Row {
  name: string
  city: string
}

const columns: ExcelTableColumn[] = [
  { id: 'name', dataKey: 'name', title: 'Ad' },
  { id: 'city', dataKey: 'city', title: 'Şehir' },
]

const data: Row[] = [
  { name: 'Ayhan', city: 'İstanbul' },
  { name: 'Deniz', city: 'Ankara' },
]

describe('ExcelTable', () => {
  it('kolon başlıklarını ve hücre değerlerini render eder', () => {
    render(<ExcelTable columns={columns} data={data} />)

    expect(screen.getByText('Ad')).toHaveClass(
      'inconel-excel-table-header-item',
    )
    expect(screen.getByText('Şehir')).toBeInTheDocument()
    expect(screen.getByText('Ayhan')).toBeInTheDocument()
    expect(screen.getByText('İstanbul')).toBeInTheDocument()
    expect(screen.getByText('Ankara')).toBeInTheDocument()
  })

  it('verilen id kök elemana uygulanır', () => {
    const { container } = render(
      <ExcelTable id="my-excel" columns={columns} data={data} />,
    )

    expect(container.querySelector('#my-excel')).toBeInTheDocument()
  })

  it('theme prop light/dark class ismini belirler', () => {
    const { container, rerender } = render(
      <ExcelTable columns={columns} data={data} theme="light" />,
    )
    expect(container.firstElementChild).toHaveClass('is-light')

    rerender(<ExcelTable columns={columns} data={data} theme="dark" />)
    expect(container.firstElementChild).toHaveClass('is-dark')
  })

  it('className prop ile özel class eklenir', () => {
    const { container } = render(
      <ExcelTable columns={columns} data={data} className="custom-excel" />,
    )

    expect(container.firstElementChild).toHaveClass(
      'inconel-excel-table',
      'custom-excel',
    )
  })

  it('data veya columns boşken hata vermeden render edilir', () => {
    const { container } = render(<ExcelTable columns={[]} data={[]} />)

    expect(container.querySelector('.header-holder')).toBeEmptyDOMElement()
    expect(container.querySelector('.body-holder')).toBeEmptyDOMElement()
  })

  it('her hücre doğru data-column-id niteliğini taşır', () => {
    const { container } = render(<ExcelTable columns={columns} data={data} />)

    const cells = container.querySelectorAll(
      '[data-column-id="name"]',
    )
    expect(cells).toHaveLength(data.length)
  })
})
