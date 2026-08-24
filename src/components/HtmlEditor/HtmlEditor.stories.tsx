import type { Meta, StoryObj } from '@storybook/react-vite'

import { HtmlEditor } from './HtmlEditor'

const meta = {
  title: 'Components/HtmlEditor',
  component: HtmlEditor,
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: 'select',
      options: ['html', 'css', 'js', 'json', 'jsx', 'tsx', 'markdown'],
    },
  },
  args: {
    value: '<div class="card">\n  <h1>Merhaba Dünya</h1>\n</div>',
    language: 'html',
    padding: 15,
  },
} satisfies Meta<typeof HtmlEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { value: '' },
}

export const WithPlaceholder: Story = {
  args: { value: '', placeholder: 'Kod girin' },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const CssLanguage: Story = {
  args: {
    language: 'css',
    value: '.card {\n  padding: 16px;\n  border-radius: 8px;\n}',
  },
}

export const JsonLanguage: Story = {
  args: {
    language: 'json',
    value: '{\n  "name": "inconel",\n  "version": "1.0.0"\n}',
  },
}

export const CustomPadding: Story = {
  args: { padding: 32 },
}

export const CustomClassName: Story = {
  args: { className: 'custom-html-editor' },
}
