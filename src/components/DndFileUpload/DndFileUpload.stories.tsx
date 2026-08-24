import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { DndFileUpload } from './DndFileUpload'
import type { DndFileUploadProps } from './DndFileUpload'

// DndFileUpload is a direct alias of DragDropUpload (see index.ts) — this
// file only covers the wrapper's basic usage. See DragDropUpload.stories.tsx
// for the full set of prop variations.
function DndFileUploadDemo(props: DndFileUploadProps) {
  const [files, setFiles] = useState<File[]>(props.value ?? props.files ?? [])
  return (
    <DndFileUpload {...props} value={files} onChange={(next) => setFiles(next)} />
  )
}

const meta = {
  title: 'Components/DndFileUpload',
  component: DndFileUpload,
  tags: ['autodocs'],
  args: {
    label: 'Dosya Yükle',
    helperText: 'Dosyayı buraya sürükle veya seç',
  },
  render: (args) => <DndFileUploadDemo {...args} />,
} satisfies Meta<typeof DndFileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  args: { multiple: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
