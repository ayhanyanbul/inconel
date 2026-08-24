import type { Meta, StoryObj } from '@storybook/react-vite'

import { MultiSelect, type MultiSelectOption } from './MultiSelect'

const options: MultiSelectOption[] = [
  { label: 'Kırmızı', value: 'red' },
  { label: 'Yeşil', value: 'green' },
  { label: 'Mavi', value: 'blue' },
  { label: 'Sarı', value: 'yellow', disabled: true },
]

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  args: {
    options,
    label: 'Renkler',
    value: ['green'],
  },
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoSelection: Story = {
  args: { value: [] },
}

export const MultipleSelected: Story = {
  args: { value: ['red', 'green', 'blue'] },
}

export const WithoutLabel: Story = {
  args: { label: undefined },
}

export const AllSelected: Story = {
  args: { value: ['red', 'green', 'blue', 'yellow'] },
}

export const CustomClassName: Story = {
  args: { className: 'custom-multi-select' },
}
