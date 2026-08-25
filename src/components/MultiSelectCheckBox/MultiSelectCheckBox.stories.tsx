import type { Meta, StoryObj } from '@storybook/react-vite'

import { MultiSelectCheckBox } from './MultiSelectCheckBox'

const fruitOptions = [
  { value: 'apple', label: 'Elma' },
  { value: 'pear', label: 'Armut' },
  { value: 'banana', label: 'Muz' },
  { value: 'strawberry', label: 'Çilek' },
  { value: 'orange', label: 'Portakal' },
]

const meta = {
  title: 'Components/MultiSelectCheckBox',
  component: MultiSelectCheckBox,
  tags: ['autodocs'],
  args: {
    label: 'Meyveler',
    options: fruitOptions,
  },
} satisfies Meta<typeof MultiSelectCheckBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDefaultSelection: Story = {
  args: {
    defaultSelectedOptions: [fruitOptions[0], fruitOptions[2]],
  },
}

export const Searchable: Story = {
  args: {
    isSearchable: true,
  },
}

export const SelectionLimit: Story = {
  args: {
    selectionLimit: 2,
    defaultSelectedOptions: [fruitOptions[0]],
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    isDisabled: true,
    defaultSelectedOptions: [fruitOptions[0]],
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Bu alan zorunludur',
  },
}

export const Empty: Story = {
  args: {
    options: [],
  },
}

export const ReactPortal: Story = {
  args: {
    reactPortal: true,
  },
}
