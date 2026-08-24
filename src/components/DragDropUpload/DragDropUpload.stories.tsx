import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { DragDropUpload } from './DragDropUpload'
import type { DragDropUploadProps } from './DragDropUpload'

function DragDropUploadDemo(props: DragDropUploadProps) {
  const [files, setFiles] = useState<File[]>(props.value ?? props.files ?? [])
  return (
    <DragDropUpload
      {...props}
      value={files}
      onChange={(nextFiles) => setFiles(nextFiles)}
    />
  )
}

const meta = {
  title: 'Components/DragDropUpload',
  component: DragDropUpload,
  tags: ['autodocs'],
  args: {
    label: 'Dosya Yükle',
    helperText: 'Dosyayı buraya sürükle veya seç',
    emptyText: 'Henüz dosya seçilmedi',
    buttonText: 'Dosya Seç',
    clearText: 'Sil',
    multiple: false,
    disabled: false,
  },
  render: (args) => <DragDropUploadDemo {...args} />,
} satisfies Meta<typeof DragDropUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  args: { multiple: true },
}

export const RestrictedFileType: Story = {
  args: {
    accept: '.png,.jpg,.jpeg',
    helperText: 'Sadece PNG veya JPG dosyaları kabul edilir',
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithoutLabel: Story = {
  args: { label: undefined },
}

export const CustomTexts: Story = {
  args: {
    label: 'Belgeler',
    buttonText: 'Gözat',
    clearText: 'Kaldır',
    helperText: 'Sürükleyip bırakın ya da tıklayın',
  },
}

export const NotRendered: Story = {
  args: { render: false },
}
