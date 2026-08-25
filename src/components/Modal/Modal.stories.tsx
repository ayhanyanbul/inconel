import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '../Button'
import { Select } from '../Select'
import { Modal } from './Modal'
import type { ModalProps } from './Modal'

function ModalDemo(props: ModalProps) {
  const [open, setOpen] = useState(true)
  return (
    <div>
      <Button label="Modal'ı Aç" onClick={() => setOpen(true)} />
      <Modal
        {...props}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  )
}

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    modalType: {
      control: 'select',
      options: ['info', 'success', 'error', 'danger', 'warning'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
  args: {
    title: 'Modal Başlığı',
    modalType: 'info',
    size: 'md',
    children: <p>Modal içeriği burada gösterilir.</p>,
  },
  render: (args) => <ModalDemo {...args} />,
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Success: Story = {
  args: { modalType: 'success', title: 'Başarılı' },
}

export const Error: Story = {
  args: { modalType: 'error', title: 'Hata' },
}

export const Warning: Story = {
  args: { modalType: 'warning', title: 'Uyarı' },
}

export const WithFooterActions: Story = {
  render: (args) => {
    function FooterDemo() {
      const [open, setOpen] = useState(true)
      return (
        <div>
          <Button label="Modal'ı Aç" onClick={() => setOpen(true)} />
          <Modal
            {...args}
            open={open}
            onClose={() => setOpen(false)}
            okText="Kaydet"
            okAction={() => setOpen(false)}
            cancelText="Vazgeç"
            cancelAction={() => setOpen(false)}
          />
        </div>
      )
    }
    return <FooterDemo />
  },
}

export const Maximizable: Story = {
  args: { maximize: true },
}

export const WithoutCloseButton: Story = {
  args: { closeButton: false },
}

export const NotScrollable: Story = {
  args: { scrollable: false },
}

export const LargeSize: Story = {
  args: { size: 'lg' },
}

export const LongContentWithFooter: Story = {
  args: {
    children: (
      <>
        {Array.from({ length: 40 }, (_, index) => (
          <p key={index}>Satır {index + 1}: uzun içerik örneği.</p>
        ))}
      </>
    ),
    okText: 'Kaydet',
    okAction: () => {},
    cancelText: 'Vazgeç',
    cancelAction: () => {},
  },
}

export const FullSize: Story = {
  args: { fullSize: true },
}

export const WithSelect: Story = {
  args: {
    children: (
      <Select
        label="Şehir"
        options={[
          { value: 1, label: 'İstanbul' },
          { value: 2, label: 'Ankara' },
          { value: 3, label: 'İzmir' },
        ]}
        menuPortalTarget={
          typeof document !== 'undefined' ? document.body : null
        }
      />
    ),
  },
}

export const Closed: Story = {
  render: (args) => {
    function ClosedDemo() {
      const [open, setOpen] = useState(false)
      return (
        <div>
          <Button label="Modal'ı Aç" onClick={() => setOpen(true)} />
          <Modal {...args} open={open} onClose={() => setOpen(false)} />
        </div>
      )
    }
    return <ClosedDemo />
  },
}
