import type { Meta, StoryObj } from '@storybook/react-vite'

import { Filter } from './Filter'

const meta = {
  title: 'Components/Filter',
  component: Filter,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <input type="text" placeholder="Ara..." />
        <select defaultValue="all">
          <option value="all">Tümü</option>
          <option value="active">Aktif</option>
          <option value="passive">Pasif</option>
        </select>
      </>
    ),
  },
} satisfies Meta<typeof Filter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithClearButton: Story = {
  args: {
    onClear: () => alert('Filtreler temizlendi'),
  },
}

export const CustomClearLabel: Story = {
  args: {
    onClear: () => alert('Sıfırlandı'),
    clearLabel: 'Sıfırla',
  },
}

export const SingleField: Story = {
  args: {
    children: <input type="text" placeholder="Ara..." />,
    onClear: () => alert('Temizlendi'),
  },
}
