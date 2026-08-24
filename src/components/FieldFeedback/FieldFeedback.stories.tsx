import type { Meta, StoryObj } from '@storybook/react-vite'

import FieldFeedback from './FieldFeedback'

const meta = {
  title: 'Components/FieldFeedback',
  component: FieldFeedback,
  tags: ['autodocs'],
  args: {
    hintId: 'field-hint',
    errorId: 'field-error',
  },
} satisfies Meta<typeof FieldFeedback>

export default meta
type Story = StoryObj<typeof meta>

export const Hint: Story = {
  args: {
    hint: 'Şifreniz en az 8 karakter olmalıdır.',
  },
}

export const Error: Story = {
  args: {
    hint: 'Şifreniz en az 8 karakter olmalıdır.',
    errorMessage: 'Şifre alanı zorunludur.',
  },
}

export const Empty: Story = {
  args: {},
}
