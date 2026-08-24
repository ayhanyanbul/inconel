import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Şartları kabul ediyorum',
    defaultChecked: false,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const WithoutLabel: Story = {
  args: { label: undefined },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
}

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Bazıları seçili' },
}

export const WithError: Story = {
  args: {
    label: 'KVKK metnini onaylıyorum',
    errorMessage: 'Bu alanın işaretlenmesi zorunludur.',
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'Salt okunur seçenek',
    readOnly: true,
    defaultChecked: true,
  },
}
