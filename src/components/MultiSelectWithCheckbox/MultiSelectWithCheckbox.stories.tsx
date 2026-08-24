import type { Meta, StoryObj } from '@storybook/react-vite'

import { MultiSelectWithCheckbox } from './MultiSelectWithCheckbox'

const options = [
  { label: 'Kırmızı', value: 'red' },
  { label: 'Yeşil', value: 'green' },
  { label: 'Mavi', value: 'blue' },
  { label: 'Sarı', value: 'yellow', disabled: true },
]

const meta = {
  title: 'Components/MultiSelectWithCheckbox',
  component: MultiSelectWithCheckbox,
  tags: ['autodocs'],
  args: {
    options,
    label: 'Renkler',
    value: ['green'],
  },
} satisfies Meta<typeof MultiSelectWithCheckbox>

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

export const CustomClassName: Story = {
  args: { className: 'custom-multi-select-checkbox' },
}
