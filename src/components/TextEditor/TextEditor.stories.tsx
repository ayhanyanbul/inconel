import type { Meta, StoryObj } from '@storybook/react-vite'

import { TextEditor } from './TextEditor'

const meta = {
  title: 'Components/TextEditor',
  component: TextEditor,
  tags: ['autodocs'],
  args: {
    value: '<p>Merhaba, bu bir <strong>TinyMCE</strong> düzenleyicisidir.</p>',
    height: 500,
  },
} satisfies Meta<typeof TextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { value: '' },
}

export const CustomHeight: Story = {
  args: { height: 300 },
}

export const EnglishLocale: Story = {
  args: { language: 'en', value: '<p>Hello, this is a TinyMCE editor.</p>' },
}
