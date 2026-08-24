import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { CheckboxGroup } from './CheckboxGroup'
import type { CheckboxOption } from './CheckboxGroup'

const fruitOptions: CheckboxOption[] = [
  { label: 'Elma', value: 'apple' },
  { label: 'Armut', value: 'pear' },
  { label: 'Muz', value: 'banana' },
  { label: 'Çilek', value: 'strawberry', disabled: true },
]

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  args: {
    options: fruitOptions,
    value: ['pear'],
    name: 'fruits',
  },
} satisfies Meta<typeof CheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoneSelected: Story = {
  args: { value: [] },
}

export const MultipleSelected: Story = {
  args: { value: ['apple', 'banana'] },
}

export const WithDisabledOption: Story = {
  args: { value: ['apple'] },
}

export const Controlled: Story = {
  render: () => {
    function ControlledCheckboxGroup() {
      const [value, setValue] = useState<string[]>(['apple'])
      return (
        <CheckboxGroup
          options={fruitOptions}
          name="fruits-controlled"
          value={value}
          onChange={setValue}
        />
      )
    }
    return <ControlledCheckboxGroup />
  },
}
