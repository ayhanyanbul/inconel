import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioGroup } from './RadioGroup'
import type { RadioOption } from './RadioGroup'

const fruitOptions: RadioOption[] = [
  { label: 'Elma', value: 'apple' },
  { label: 'Armut', value: 'pear' },
  { label: 'Muz', value: 'banana' },
  { label: 'Çilek', value: 'strawberry', disabled: true },
]

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    options: fruitOptions,
    value: 'pear',
    name: 'fruits',
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoneSelected: Story = {
  args: { value: undefined },
}

export const LastOptionSelected: Story = {
  args: { value: 'banana' },
}

export const WithDisabledOption: Story = {
  args: { value: 'apple' },
}

export const Controlled: Story = {
  render: () => {
    function ControlledRadioGroup() {
      const [value, setValue] = useState('apple')
      return (
        <RadioGroup
          options={fruitOptions}
          name="fruits-controlled"
          value={value}
          onChange={setValue}
        />
      )
    }
    return <ControlledRadioGroup />
  },
}
