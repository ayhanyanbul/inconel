import type { Meta, StoryObj } from '@storybook/react-vite'

import { SocketStatus } from './SocketStatus'

const meta = {
  title: 'Components/SocketStatus',
  component: SocketStatus,
  tags: ['autodocs'],
  args: {
    connected: true,
  },
} satisfies Meta<typeof SocketStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Connected: Story = {}

export const Disconnected: Story = {
  args: { connected: false },
}

export const CustomLabels: Story = {
  args: {
    connected: true,
    connectedLabel: 'Çevrimiçi',
    disconnectedLabel: 'Çevrimdışı',
  },
}

export const CustomLabelsDisconnected: Story = {
  args: {
    connected: false,
    connectedLabel: 'Çevrimiçi',
    disconnectedLabel: 'Çevrimdışı',
  },
}
