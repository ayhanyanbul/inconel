import type { Meta, StoryObj } from '@storybook/react-vite'

import { FileUpload } from './FileUpload'

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  args: {
    label: 'Belge',
    placeholder: 'Dosya seç',
  },
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  args: { multiple: true },
}

export const RestrictedFileType: Story = {
  args: {
    accept: '.pdf,.doc,.docx',
    placeholder: 'PDF veya Word dosyası seç',
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithError: Story = {
  args: { errorMessage: 'Bu alan zorunludur' },
}

export const WithoutLabel: Story = {
  args: { label: undefined },
}

export const NotRendered: Story = {
  args: { render: false },
}
