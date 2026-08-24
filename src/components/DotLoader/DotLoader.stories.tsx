import type { Meta, StoryObj } from '@storybook/react-vite'

import { DotLoader } from './DotLoader'

const meta = {
  title: 'Components/DotLoader',
  component: DotLoader,
  tags: ['autodocs'],
} satisfies Meta<typeof DotLoader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabel: Story = {
  args: { label: 'Kaydediliyor...' },
}
