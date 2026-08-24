import type { Meta, StoryObj } from '@storybook/react-vite'

import { OptionWithIcon } from './OptionWithIcon'

const meta = {
  title: 'Components/OptionWithIcon',
  component: OptionWithIcon,
  tags: ['autodocs'],
  args: {
    icon: <span aria-hidden="true">🍎</span>,
    children: 'Elma',
  },
} satisfies Meta<typeof OptionWithIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: { selected: true },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    icon: <span aria-hidden="true">🍓</span>,
    children: 'Çilek (tükendi)',
  },
}

export const IconList: Story = {
  render: () => (
    <div role="listbox" style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
      <OptionWithIcon icon={<span aria-hidden="true">🍎</span>} selected>
        Elma
      </OptionWithIcon>
      <OptionWithIcon icon={<span aria-hidden="true">🍐</span>}>
        Armut
      </OptionWithIcon>
      <OptionWithIcon icon={<span aria-hidden="true">🍌</span>}>
        Muz
      </OptionWithIcon>
      <OptionWithIcon icon={<span aria-hidden="true">🍓</span>} disabled>
        Çilek (tükendi)
      </OptionWithIcon>
    </div>
  ),
}
