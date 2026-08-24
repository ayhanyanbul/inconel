import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Switch } from './Switch'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    sizing: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
  args: {
    isChecked: true,
  },
} satisfies Meta<typeof Switch>

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

export const WithLabel: Story = {
  args: {
    label: 'Bildirimleri Etkinleştir',
  },
}

export const WithOnOffLabels: Story = {
  args: {
    onLabel: 'Açık',
    offLabel: 'Kapalı',
  },
}

export const MediumSize: Story = {
  args: { sizing: 'medium' },
}

export const LargeSize: Story = {
  args: { sizing: 'large' },
}

export const NotRendered: Story = {
  args: { render: false },
}

export const Controlled: Story = {
  render: (args) => {
    function ControlledSwitch() {
      const [checked, setChecked] = useState(false)
      return (
        <Switch
          {...args}
          isChecked={checked}
          onCheckedChange={setChecked}
        />
      )
    }
    return <ControlledSwitch />
  },
}
