import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './Badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'dark',
        'warning',
        'danger',
        'success',
        'light',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    text: 'Yeni',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Dark: Story = {
  args: { variant: 'dark' },
}

export const Warning: Story = {
  args: { variant: 'warning' },
}

export const Danger: Story = {
  args: { variant: 'danger' },
}

export const Success: Story = {
  args: { variant: 'success' },
}

export const Light: Story = {
  args: { variant: 'light' },
}

export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge {...args} size="xs" />
      <Badge {...args} size="sm" />
      <Badge {...args} size="md" />
      <Badge {...args} size="lg" />
      <Badge {...args} size="xl" />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Badge text="Primary" variant="primary" />
      <Badge text="Secondary" variant="secondary" />
      <Badge text="Dark" variant="dark" />
      <Badge text="Warning" variant="warning" />
      <Badge text="Danger" variant="danger" />
      <Badge text="Success" variant="success" />
      <Badge text="Light" variant="light" />
    </div>
  ),
}
