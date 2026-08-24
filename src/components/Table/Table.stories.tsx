import type { Meta, StoryObj } from '@storybook/react-vite'

import { Table, type Column } from './Table'

interface Person {
  id: number
  name: string
  city: string
}

const columns: Column<Person>[] = [
  { key: 'name', header: 'Ad Soyad' },
  { key: 'city', header: 'Şehir' },
]

const data: Person[] = [
  { id: 1, name: 'Ayhan Yanbul', city: 'İstanbul' },
  { id: 2, name: 'Deniz Kaya', city: 'Ankara' },
  { id: 3, name: 'Berk Aydın', city: 'İzmir' },
]

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
  args: {
    id: 'table-story',
    columns,
    data,
    rowKey: 'id',
  },
} satisfies Meta<typeof Table<Person>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { id: 'table-empty', data: [], emptyMessage: 'Kayıt bulunamadı.' },
}

export const WithRowClick: Story = {
  args: {
    id: 'table-row-click',
    onRowClick: (row) => {
      console.log('row clicked', row)
    },
  },
}

export const DarkTheme: Story = {
  args: { id: 'table-dark', theme: 'dark' },
}

export const Loading: Story = {
  args: { id: 'table-loading', loading: true },
}

export const CustomClassName: Story = {
  args: { id: 'table-custom-class', className: 'custom-table' },
}
