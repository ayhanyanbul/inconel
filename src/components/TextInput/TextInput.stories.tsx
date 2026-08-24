import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { TextInput } from './TextInput'
import type { InputValue } from '../Input/Input'

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['autodocs'],
  args: {
    label: 'Kullanıcı Adı',
    placeholder: 'Kullanıcı adınızı giriniz',
  },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: {
    hint: 'En az 3 karakter olmalıdır.',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Kullanıcı adı zaten alınmış.',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Düzenlenemez',
  },
}

export const ReadOnlyState: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Salt okunur değer',
  },
}

export const Clearable: Story = {
  args: {
    isClearable: true,
    clearButtonLabel: 'Temizle',
    defaultValue: 'Silinebilir metin',
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    label: 'E-posta',
    defaultValue: 'ayse@example.com',
  },
}

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}

export const Controlled: Story = {
  render: (args) => {
    function ControlledTextInput() {
      const [value, setValue] = useState<InputValue>('')
      return (
        <TextInput
          {...args}
          value={value}
          onChange={(payload) => setValue(payload.rawValue)}
        />
      )
    }
    return <ControlledTextInput />
  },
}
