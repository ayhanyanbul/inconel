import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
  },
  args: {
    label: 'Kaydet',
    variant: 'primary',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Danger: Story = {
  args: { variant: 'danger' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Warning: Story = {
  args: { variant: 'warning' },
}

export const Dark: Story = {
  args: { variant: 'dark' },
}

export const Loading: Story = {
  args: { loading: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithIcon: Story = {
  args: { icon: '/icons/export.svg' },
}

export const WithLargeIcon: Story = {
  args: { icon: '/icons/export.svg', iconWidth: 30, iconHeight: 30 },
}

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}

export const OutlinePrimary: Story = {
  args: { buttonType: 'outlinePrimary' },
}

export const OutlineSecondary: Story = {
  args: { buttonType: 'outlineSecondary' },
}

export const OutlineDanger: Story = {
  args: { buttonType: 'outlineDanger' },
}

export const OutlineWarning: Story = {
  args: { buttonType: 'outlineWarning' },
}

export const OutlineSuccess: Story = {
  args: { buttonType: 'outlineSuccess' },
}

export const OutlineDark: Story = {
  args: { buttonType: 'outlineDark' },
}

export const Pill: Story = {
  args: { pill: true },
}

export const WithCount: Story = {
  args: { count: 3 },
}

export const WithProgress: Story = {
  args: { label: 'Yükleniyor', progress: 45 },
}

export const OutlinePill: Story = {
  args: { buttonType: 'outlinePrimary', pill: true },
}

export const OutlineWithProgress: Story = {
  args: {
    buttonType: 'outlinePrimary',
    label: 'Yükleniyor',
    progress: 45,
  },
}

export const PollOption: Story = {
  args: {
    buttonType: 'outlinePrimary',
    label: 'Elma',
    count: '%100',
    progress: 100,
  },
  parameters: { layout: 'padded' },
}

export const ExtraSmall: Story = {
  args: { size: 'xxs' },
}
