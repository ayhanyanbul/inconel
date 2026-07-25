import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Table } from './Table'

describe('Table', () => {
  it('kolonları ve satırları render eder', () => {
    render(
      <Table
        columns={[{ key: 'name', header: 'Ad' }]}
        data={[{ id: 1, name: 'Ayhan' }]}
        rowKey="id"
      />,
    )

    expect(screen.getByText('Ad')).toBeInTheDocument()
    expect(screen.getByText('Ayhan')).toBeInTheDocument()
  })
})
