import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tooltip } from './Tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  args: {
    content: 'İpucu metni',
    placement: 'top',
    children: <button type="button">Üzerine gel</button>,
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Top: Story = {}

export const Right: Story = {
  args: { placement: 'right' },
}

export const Bottom: Story = {
  args: { placement: 'bottom' },
}

export const Left: Story = {
  args: { placement: 'left' },
}

export const WithLongContent: Story = {
  args: {
    content: 'Bu, birden fazla satıra yayılabilecek daha uzun bir ipucu açıklamasıdır.',
  },
}

export const WithTextChild: Story = {
  args: {
    children: <span>Bilgi için üzerine gelin</span>,
  },
}
