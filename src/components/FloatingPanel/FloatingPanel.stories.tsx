import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { FloatingPanel } from './FloatingPanel'
import type { FloatingPanelTrianglePosition } from './FloatingPanel'

const meta = {
  title: 'Components/FloatingPanel',
  component: FloatingPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof FloatingPanel>

export default meta
type Story = StoryObj<typeof meta>

function TriggerDemo({
  trianglePosition = 'bottom-center',
  draggable = false,
}: {
  trianglePosition?: FloatingPanelTrianglePosition
  draggable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const targetRef = useRef<HTMLButtonElement>(null)

  return (
    <div style={{ padding: 120 }}>
      <button ref={targetRef} type="button" onClick={() => setOpen((v) => !v)}>
        Hedef buton
      </button>
      {open && (
        <FloatingPanel
          target={targetRef.current}
          trianglePosition={trianglePosition}
          draggable={draggable}
          onClosed={() => setOpen(false)}
        >
          <div style={{ padding: 16, width: 220 }}>
            Hedef elemente göre konumlanan floating panel içeriği.
          </div>
        </FloatingPanel>
      )}
    </div>
  )
}

export const Default: Story = {
  render: () => <TriggerDemo />,
}

export const TopLeft: Story = {
  render: () => <TriggerDemo trianglePosition="top-left" />,
}

export const RightCenter: Story = {
  render: () => <TriggerDemo trianglePosition="right-center" />,
}

export const Draggable: Story = {
  render: () => <TriggerDemo draggable />,
}
