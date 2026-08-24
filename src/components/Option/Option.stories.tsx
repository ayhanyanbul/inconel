import type { Meta, StoryObj } from '@storybook/react-vite'

import { Option } from './Option'

const meta = {
  title: 'Components/Option',
  component: Option,
  tags: ['autodocs'],
  args: {
    children: 'Elma',
  },
} satisfies Meta<typeof Option>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: { selected: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithIcon: Story = {
  args: {
    icon: <span aria-hidden="true">★</span>,
    children: 'Favori Meyve',
  },
}

export const OptionList: Story = {
  render: () => (
    <div role="listbox" style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 200 }}>
      <Option selected>Elma</Option>
      <Option>Armut</Option>
      <Option>Muz</Option>
      <Option disabled>Çilek (tükendi)</Option>
    </div>
  ),
}
