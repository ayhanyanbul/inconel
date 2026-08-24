import type { Meta, StoryObj } from '@storybook/react-vite'

import { InputText } from './InputText'

const meta = {
  title: 'Components/InputText',
  component: InputText,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'number', 'currency', 'percent', 'phone', 'email', 'password'],
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
} satisfies Meta<typeof InputText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHint: Story = {
  args: { hint: 'Adınızı ve soyadınızı yazınız.' },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Bu alan zorunludur.',
  },
}

export const Required: Story = {
  args: { required: true },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Ayhan Yanbul' },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'Ayhan Yanbul' },
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
    placeholder: 'ornek@firma.com',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    label: 'Şifre',
    placeholder: '••••••••',
  },
}

export const Phone: Story = {
  args: {
    type: 'phone',
    label: 'Telefon',
    mask: '(999) 999 99 99',
    placeholder: '(5__) ___ __ __',
  },
}

export const Percent: Story = {
  args: {
    type: 'percent',
    label: 'KDV Oranı',
    defaultValue: 20,
  },
}

export const WithAdornments: Story = {
  args: {
    label: 'Web sitesi',
    startAdornment: 'https://',
    endAdornment: '.com',
    defaultValue: 'inconel',
  },
}

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}
