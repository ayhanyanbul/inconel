import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { SlideTabs } from './SlideTabs'
import type { SlideTab } from './SlideTabs'

const baseTabs: SlideTab[] = [
  { key: 'all', label: 'Tümü', count: 12 },
  { key: 'active', label: 'Aktif', count: 5 },
  { key: 'passive', label: 'Pasif', count: 7 },
]

const meta = {
  title: 'Components/SlideTabs',
  component: SlideTabs,
  tags: ['autodocs'],
  args: {
    tabs: baseTabs,
    activeKey: 'active',
  },
} satisfies Meta<typeof SlideTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const FirstTabActive: Story = {
  args: { activeKey: 'all' },
}

export const WithoutCounts: Story = {
  args: {
    tabs: [
      { key: 'all', label: 'Tümü' },
      { key: 'active', label: 'Aktif' },
      { key: 'passive', label: 'Pasif' },
    ],
  },
}

export const WithHiddenTab: Story = {
  args: {
    tabs: [
      { key: 'all', label: 'Tümü', count: 12 },
      { key: 'active', label: 'Aktif', count: 5 },
      { key: 'hidden', label: 'Gizli', count: 3, show: false },
    ],
  },
}

export const Empty: Story = {
  args: { tabs: [] },
}

export const Controlled: Story = {
  render: (args) => {
    function ControlledSlideTabs() {
      const [activeKey, setActiveKey] = useState<string | number>('all')
      return (
        <SlideTabs
          {...args}
          tabs={baseTabs}
          activeKey={activeKey}
          onChange={setActiveKey}
        />
      )
    }
    return <ControlledSlideTabs />
  },
}
