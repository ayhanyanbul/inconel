import type { Meta, StoryObj } from '@storybook/react-vite'

import { LoaderMini } from './LoaderMini'

const meta = {
  title: 'Components/LoaderMini',
  component: LoaderMini,
  tags: ['autodocs'],
  args: {
    show: true,
  },
} satisfies Meta<typeof LoaderMini>

export default meta
type Story = StoryObj<typeof meta>

export const Visible: Story = {}

export const Hidden: Story = {
  args: { show: false },
}
