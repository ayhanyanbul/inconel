import type { Meta, StoryObj } from '@storybook/react-vite'

import { Loader } from './Loader'

const meta = {
  title: 'Components/Loader',
  component: Loader,
  tags: ['autodocs'],
  args: {
    render: true,
  },
} satisfies Meta<typeof Loader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabel: Story = {
  args: { label: 'Veriler hazırlanıyor...' },
}

export const Fullscreen: Story = {
  args: { fullscreen: true },
  parameters: { layout: 'fullscreen' },
}

export const Hidden: Story = {
  args: { render: false },
}
