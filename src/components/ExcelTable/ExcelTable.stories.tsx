import type { Meta, StoryObj } from '@storybook/react-vite'

import { ExcelTable, type ExcelTableColumn } from './ExcelTable'

interface Employee {
  name: string
  city: string
  department: string
}

const columns: ExcelTableColumn[] = [
  { id: 'name', dataKey: 'name', title: 'Ad Soyad' },
  { id: 'city', dataKey: 'city', title: 'Şehir' },
  { id: 'department', dataKey: 'department', title: 'Departman' },
]

const data: Employee[] = [
  { name: 'Ayhan Yanbul', city: 'İstanbul', department: 'Mühendislik' },
  { name: 'Deniz Kaya', city: 'Ankara', department: 'Tasarım' },
  { name: 'Berk Aydın', city: 'İzmir', department: 'Satış' },
  { name: 'Elif Şahin', city: 'Bursa', department: 'İnsan Kaynakları' },
]

const meta = {
  title: 'Components/ExcelTable',
  component: ExcelTable,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
  args: {
    id: 'excel-table-story',
    columns,
    data,
    viewCount: 10,
    rowHeight: 30,
    theme: 'light',
  },
} satisfies Meta<typeof ExcelTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DarkTheme: Story = {
  args: { id: 'excel-table-dark', theme: 'dark' },
}

export const CustomRowHeight: Story = {
  args: { id: 'excel-table-row-height', rowHeight: 44, viewCount: 5 },
}

export const CustomClassName: Story = {
  args: { id: 'excel-table-custom-class', className: 'custom-excel-table' },
}

export const Empty: Story = {
  args: { id: 'excel-table-empty', columns: [], data: [] },
}
