import type { Meta, StoryObj } from '@storybook/react-vite'

import { CheckBoxList } from './CheckBoxList'

const fruitOptions = [
  { value: 'apple', label: 'Elma' },
  { value: 'pear', label: 'Armut' },
  { value: 'banana', label: 'Muz' },
  { value: 'strawberry', label: 'Çilek' },
  { value: 'orange', label: 'Portakal' },
  { value: 'grape', label: 'Üzüm' },
]

const meta = {
  title: 'Components/CheckBoxList',
  component: CheckBoxList,
  tags: ['autodocs'],
  args: {
    options: fruitOptions,
  },
} satisfies Meta<typeof CheckBoxList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDefaultSelection: Story = {
  args: {
    defaultSelectedOptions: ['pear', 'banana'],
  },
}

export const SingleSelect: Story = {
  args: {
    multiple: false,
    defaultSelectedOptions: ['apple'],
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultSelectedOptions: ['apple'],
  },
}

export const Empty: Story = {
  args: {
    options: [],
  },
}

export const TransferMode: Story = {
  args: {
    transferMode: true,
    defaultSelectedOptions: ['pear'],
  },
}
