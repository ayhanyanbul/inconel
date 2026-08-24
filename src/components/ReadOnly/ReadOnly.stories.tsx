import type { Meta, StoryObj } from '@storybook/react-vite'

import { ReadOnly } from './ReadOnly'

const meta = {
  title: 'Components/ReadOnly',
  component: ReadOnly,
  tags: ['autodocs'],
  args: {
    label: 'Ad Soyad',
    value: 'Ayşe Yılmaz',
  },
} satisfies Meta<typeof ReadOnly>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutLabel: Story = {
  args: { label: undefined },
}

export const EmptyValue: Story = {
  args: { value: undefined },
}

export const CustomEmptyValue: Story = {
  args: {
    value: undefined,
    emptyValue: 'Belirtilmemiş',
  },
}

export const LongValue: Story = {
  args: {
    label: 'Adres',
    value:
      'Atatürk Mahallesi, Cumhuriyet Caddesi No: 42, Kat: 3, Daire: 7, Kadıköy / İstanbul',
  },
}
