import type { Meta, StoryObj } from '@storybook/react-vite'
import type { FC } from 'react'

import {
  HTMLTable,
  type HTMLTableColumn,
  type HTMLTableProps,
} from './HTMLTable'

interface Person {
  id: number
  name: string
  city: string
}

const columns: HTMLTableColumn<Person>[] = [
  { key: 'name', title: 'Ad Soyad' },
  { key: 'city', title: 'Şehir' },
]

const data: Person[] = [
  { id: 1, name: 'Deniz Kaya', city: 'Ankara' },
  { id: 2, name: 'Ayhan Yanbul', city: 'İstanbul' },
  { id: 3, name: 'Berk Aydın', city: 'İzmir' },
  { id: 4, name: 'Elif Şahin', city: 'Bursa' },
]

const TypedHTMLTable = HTMLTable as FC<HTMLTableProps<Person>>

const meta = {
  title: 'Components/HTMLTable',
  component: TypedHTMLTable,
  tags: ['autodocs'],
  args: {
    columns,
    data,
    rowKey: 'id',
  },
} satisfies Meta<typeof TypedHTMLTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { data: [] },
}

export const Selectable: Story = {
  args: { selectable: true },
}

export const WithRowClick: Story = {
  args: {
    onRowClick: (row) => {
      console.log('row clicked', row)
    },
  },
}

export const Paginated: Story = {
  args: { pageSize: 2 },
}

export const CustomPageSizeOptions: Story = {
  args: { pageSize: 2, pageSizeOptions: [2, 4, 8] },
}
