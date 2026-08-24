import type { Meta, StoryObj } from '@storybook/react-vite'

import { DatePicker } from './DatePicker'

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    dropdownMode: {
      control: 'select',
      options: ['scroll', 'select'],
    },
    errorPlace: {
      control: 'select',
      options: ['in', 'out'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    id: 'date-picker-story',
    name: 'date',
    label: 'Tarih',
    value: new Date('2024-06-15'),
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { value: null, label: 'Doğum Tarihi' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const ReadOnly: Story = {
  args: { readOnly: true },
}

export const Clearable: Story = {
  args: { isClearable: true },
}

export const Required: Story = {
  args: { required: true, value: null, label: 'Zorunlu Tarih' },
}

export const WithError: Story = {
  args: { errorMessage: 'Geçerli bir tarih seçin' },
}

export const ErrorInsidePlaceholder: Story = {
  args: { errorMessage: 'Tarih zorunludur', errorPlace: 'in' },
}

export const WithTimeSelect: Story = {
  args: {
    label: 'Tarih ve Saat',
    showTimeSelect: true,
    dateFormat: 'dd.MM.yyyy HH:mm',
    timeIntervals: 15,
  },
}

export const YearPicker: Story = {
  args: { label: 'Yıl Seçin', showYearPicker: true, dateFormat: 'yyyy' },
}

export const MonthYearPicker: Story = {
  args: {
    label: 'Ay/Yıl Seçin',
    showMonthYearPicker: true,
    dateFormat: 'MM.yyyy',
  },
}

export const DateRange: Story = {
  args: {
    label: 'Tarih Aralığı',
    selectsRange: true,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-10'),
    value: null,
  },
}

export const Inline: Story = {
  args: { inline: true },
  parameters: { layout: 'padded' },
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const WithMonthAndYearDropdowns: Story = {
  args: { showMonthDropdown: true, showYearDropdown: true, dropdownMode: 'select' },
}
