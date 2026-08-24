import type { Meta, StoryObj } from '@storybook/react-vite'

import Svg from './Svg'

const meta = {
  title: 'Components/Svg',
  component: Svg,
  tags: ['autodocs'],
  args: {
    src: '/icons/cog.svg',
    title: 'Ayarlar ikonu',
  },
} satisfies Meta<typeof Svg>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCustomClassName: Story = {
  args: {
    className: 'custom-icon',
  },
}

export const NotRendered: Story = {
  args: {
    render: false,
  },
}

export const NoSource: Story = {
  args: {
    src: null,
  },
}
