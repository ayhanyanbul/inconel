import type { Meta, StoryObj } from '@storybook/react-vite'

import { CustomizableSwitch } from './CustomizableSwitch'

const meta = {
  title: 'Components/CustomizableSwitch',
  component: CustomizableSwitch,
  tags: ['autodocs'],
  args: {
    isChecked: true,
  },
} satisfies Meta<typeof CustomizableSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Checked: Story = {}

export const Unchecked: Story = {
  args: { isChecked: false },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledUnchecked: Story = {
  args: { disabled: true, isChecked: false },
}

export const WithChildren: Story = {
  args: {
    isChecked: true,
    children: [
      <span key="marker">☀️</span>,
      <span key="background">🌙</span>,
    ],
  },
}

export const NotRendered: Story = {
  args: { render: false },
}
