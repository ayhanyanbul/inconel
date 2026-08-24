import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Textarea from './Textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
  },
  args: {
    label: 'Açıklama',
    placeholder: 'Açıklamanızı giriniz',
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: {
    hint: 'En fazla 500 karakter girebilirsiniz.',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Açıklama alanı zorunludur.',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Düzenlenemez metin',
  },
}

export const Required: Story = {
  args: {
    required: true,
  },
}

export const NoResize: Story = {
  args: {
    resize: 'none',
  },
}

export const ResizeBoth: Story = {
  args: {
    resize: 'both',
  },
}

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}

export const Controlled: Story = {
  render: (args) => {
    function ControlledTextarea() {
      const [value, setValue] = useState('Başlangıç metni')
      return (
        <Textarea
          {...args}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      )
    }
    return <ControlledTextarea />
  },
}
