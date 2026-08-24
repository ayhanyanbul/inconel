import type { Meta, StoryObj } from '@storybook/react-vite'

import { CurrencyInput } from './CurrencyInput'

const meta = {
  title: 'Components/CurrencyInput',
  component: CurrencyInput,
  tags: ['autodocs'],
  argTypes: {
    currency: {
      control: 'select',
      options: ['TRY', 'USD', 'EUR'],
    },
    roundMode: {
      control: 'select',
      options: ['ceil', 'floor', 'round'],
    },
  },
  args: {
    label: 'Tutar',
    defaultValue: 1500,
    currency: 'TRY',
  },
} satisfies Meta<typeof CurrencyInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { defaultValue: '' },
}

export const WithHint: Story = {
  args: { hint: 'Vergiler dahil tutarı giriniz.' },
}

export const WithError: Story = {
  args: {
    errorMessage: 'Girilen tutar geçersiz.',
    defaultValue: '',
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 2500 },
}

export const Clearable: Story = {
  args: { isClearable: true, clearButtonLabel: 'Temizle' },
}

export const WithDecimals: Story = {
  args: { decimalScale: 2, defaultValue: 199.9 },
}

export const WithMinMax: Story = {
  args: { min: 0, max: 10000, defaultValue: 500 },
}

export const UsdCurrency: Story = {
  args: { currency: 'USD', locale: 'en-US', defaultValue: 250 },
}

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
}
