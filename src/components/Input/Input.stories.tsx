import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Input from './Input'
import type { InputValue } from './Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    type: {
      control: 'select',
      options: [
        'text',
        'number',
        'currency',
        'percent',
        'phone',
        'email',
        'password',
      ],
    },
    roundMode: {
      control: 'select',
      options: ['ceil', 'floor', 'round'],
    },
  },
  args: {
    label: 'Ad Soyad',
    placeholder: 'Adınızı giriniz',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Email: Story = {
  args: {
    type: 'email',
    label: 'E-posta',
    defaultValue: 'ayse@example.com',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    label: 'Şifre',
    placeholder: '••••••••',
  },
}

export const NumberType: Story = {
  args: {
    type: 'number',
    label: 'Miktar',
    defaultValue: 42,
  },
}

export const Currency: Story = {
  args: {
    type: 'currency',
    label: 'Tutar',
    currency: 'TRY',
    decimalScale: 2,
    defaultValue: 1500.5,
  },
}

export const Percent: Story = {
  args: {
    type: 'percent',
    label: 'Oran',
    decimalScale: 1,
    defaultValue: 0.15,
  },
}

export const Phone: Story = {
  args: {
    type: 'phone',
    label: 'Telefon',
    mask: '(0XXX) XXX XX XX',
    defaultValue: '5551234567',
  },
}

export const WithHint: Story = {
  args: {
    hint: 'Bu alan zorunludur.',
  },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Bu alan geçersiz.',
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

export const WithAdornments: Story = {
  args: {
    startAdornment: '₺',
    endAdornment: 'TL',
    type: 'number',
    label: 'Bakiye',
    defaultValue: 100,
  },
}

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}

export const Controlled: Story = {
  render: (args) => {
    function ControlledInput() {
      const [value, setValue] = useState<InputValue>('')
      return (
        <Input
          {...args}
          value={value}
          onChange={(payload) => setValue(payload.rawValue)}
        />
      )
    }
    return <ControlledInput />
  },
}
