import type { Meta, StoryObj } from '@storybook/react-vite'

import { DataGrid, type DataGridItem } from './DataGrid'

const sampleData: DataGridItem[] = [
  { label: 'Ad Soyad', value: 'Ayhan Yanbul', key: 'name' },
  { label: 'Şehir', value: 'İstanbul', key: 'city' },
  { label: 'Aktif', value: true, key: 'active' },
  { label: 'Kayıt Tarihi', value: new Date('2024-03-12'), key: 'createdAt' },
  { label: 'Not', value: null, key: 'note' },
]

const meta = {
  title: 'Components/DataGrid',
  component: DataGrid,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'select',
      options: [2, 4],
    },
    size: {
      control: 'select',
      options: ['default', 'compact', 'spacious'],
    },
  },
  args: {
    data: sampleData,
    columns: 2,
    size: 'default',
  },
} satisfies Meta<typeof DataGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FourColumns: Story = {
  args: { columns: 4 },
}

export const Compact: Story = {
  args: { size: 'compact' },
}

export const Spacious: Story = {
  args: { size: 'spacious' },
}

export const Striped: Story = {
  args: { striped: true },
}

export const Hoverable: Story = {
  args: { hoverable: true, bordered: true },
}

export const Bordered: Story = {
  args: { bordered: true },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Clickable: Story = {
  args: {
    onItemClick: (item, index) => {
      console.log('item clicked', item, index)
    },
  },
}

export const CustomValue: Story = {
  args: {
    data: [
      ...sampleData,
      {
        label: 'Durum',
        value: 'ignored',
        customValue: <strong>Onaylandı</strong>,
        key: 'status',
      },
    ],
  },
}

export const CustomLabelWidth: Story = {
  args: { labelWidth: '240px' },
}
