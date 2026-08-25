import type { Meta, StoryObj } from '@storybook/react-vite'

import { DropDownBox } from './DropDownBox'

const meta = {
  title: 'Components/DropDownBox',
  component: DropDownBox,
  tags: ['autodocs'],
  args: {
    label: 'Ayarlar',
  },
} satisfies Meta<typeof DropDownBox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div>Menü içeriği buraya gelir.</div>,
  },
}

export const WithFooter: Story = {
  args: {
    children: <div>Menü içeriği buraya gelir.</div>,
    footerJSX: <span>Alt bilgi</span>,
  },
}

export const WithNotification: Story = {
  args: {
    children: <div>Menü içeriği buraya gelir.</div>,
    notificationCount: 3,
  },
}

export const Active: Story = {
  args: {
    children: <div>Menü içeriği buraya gelir.</div>,
    isActive: true,
  },
}

export const Disabled: Story = {
  args: {
    children: <div>Menü içeriği buraya gelir.</div>,
    disabled: true,
  },
}

export const WithCloseButton: Story = {
  args: {
    children: <div>Menü içeriği buraya gelir.</div>,
    buttonClose: true,
  },
}

export const CustomTrigger: Story = {
  args: {
    label: undefined,
    trigger: <button type="button">Özel tetikleyici</button>,
    children: <div>Menü içeriği buraya gelir.</div>,
  },
}
