import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs } from './Tabs'
import type { TabsItem } from './Tabs'

const items: TabsItem[] = [
  { id: 'profile', label: 'Profil', content: 'Profil bilgileri burada gösterilir.' },
  { id: 'security', label: 'Güvenlik', content: 'Güvenlik ayarları burada gösterilir.' },
  { id: 'billing', label: 'Fatura', content: 'Fatura bilgileri burada gösterilir.', disabled: true },
]

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    items,
    defaultValue: 'profile',
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const StartOnSecondTab: Story = {
  args: { defaultValue: 'security' },
}

export const WithDisabledTab: Story = {
  args: { defaultValue: 'profile' },
}

export const UsingTabData: Story = {
  args: {
    items: undefined,
    tabData: [
      { label: 'Genel', content: 'Genel içerik' },
      { label: 'Detay', content: 'Detay içerik' },
    ],
  },
}

export const Controlled: Story = {
  render: (args) => {
    function ControlledTabs() {
      const [value, setValue] = useState('profile')
      return <Tabs {...args} value={value} onChange={setValue} />
    }
    return <ControlledTabs />
  },
}
