import type { Meta, StoryObj } from '@storybook/react-vite'

import { FileUploadText } from './FileUploadText'

// FileUploadText is a thin forwardRef wrapper around FileUpload with an
// identical prop API (see FileUploadText.tsx). This file covers its basic
// usage — see FileUpload.stories.tsx for the full set of prop variations.
const meta = {
  title: 'Components/FileUploadText',
  component: FileUploadText,
  tags: ['autodocs'],
  args: {
    label: 'Belge',
    placeholder: 'Dosya seç',
  },
} satisfies Meta<typeof FileUploadText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  args: { multiple: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithError: Story = {
  args: { errorMessage: 'Bu alan zorunludur' },
}
