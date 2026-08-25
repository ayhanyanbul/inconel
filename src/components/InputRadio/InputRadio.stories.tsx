import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { InputRadio } from './InputRadio'

const meta = {
  title: 'Components/InputRadio',
  component: InputRadio,
  tags: ['autodocs'],
  args: {
    label: 'Onayla',
    name: 'approve',
  },
} satisfies Meta<typeof InputRadio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: { isSelected: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, isSelected: true },
}

export const ReadOnly: Story = {
  args: { readOnly: true, value: 'Onaylandı' },
}

export const IndependentRadios: Story = {
  render: () => {
    function IndependentRadiosDemo() {
      const [status, setStatus] = useState<'approved' | 'rejected' | null>(
        null,
      )
      return (
        <div style={{ display: 'flex', gap: 16 }}>
          <InputRadio
            name="approve"
            label="Onayla"
            isSelected={status === 'approved'}
            onChange={() => setStatus('approved')}
          />
          <InputRadio
            name="reject"
            label="Reddet"
            isSelected={status === 'rejected'}
            onChange={() => setStatus('rejected')}
          />
        </div>
      )
    }
    return <IndependentRadiosDemo />
  },
}

export const Group: Story = {
  render: () => {
    function GroupDemo() {
      const [value, setValue] = useState('apple')
      const options = [
        { value: 'apple', label: 'Elma' },
        { value: 'pear', label: 'Armut' },
        { value: 'banana', label: 'Muz' },
      ]
      return (
        <div style={{ display: 'flex', gap: 16 }}>
          {options.map((option) => (
            <InputRadio
              key={option.value}
              name="fruits"
              value={option.value}
              label={option.label}
              isSelected={value === option.value}
              onChange={() => setValue(option.value)}
            />
          ))}
        </div>
      )
    }
    return <GroupDemo />
  },
}
