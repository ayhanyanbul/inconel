import type { Meta, StoryObj } from '@storybook/react-vite'
import type { FC } from 'react'

import Select, { type SelectProps } from './Select'

interface City {
  id: number
  name: string
  disabled?: boolean
}

const cities: City[] = [
  { id: 34, name: 'İstanbul' },
  { id: 6, name: 'Ankara' },
  { id: 35, name: 'İzmir' },
  { id: 16, name: 'Bursa' },
  { id: 7, name: 'Antalya', disabled: true },
]

const manyCities: City[] = Array.from({ length: 150 }, (_, index) => ({
  id: index + 1,
  name: `Şehir ${index + 1}`,
}))

const TypedSelect = Select as FC<SelectProps<City>>

const meta = {
  title: 'Components/Select',
  component: TypedSelect,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    menuPlacement: {
      control: 'select',
      options: ['auto', 'bottom', 'top'],
    },
    errorPlace: {
      control: 'select',
      options: ['in', 'out'],
    },
  },
  args: {
    label: 'Şehir',
    options: cities,
    optionLabel: 'name',
    optionValue: 'id',
    placeholder: 'Şehir seçin',
  },
} satisfies Meta<typeof TypedSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutLabel: Story = {
  args: { label: undefined },
}

export const WithValue: Story = {
  args: { value: 34 },
}

export const Clearable: Story = {
  args: { value: 34, isClearable: true },
}

export const Disabled: Story = {
  args: { value: 34, isDisabled: true },
}

export const ReadOnly: Story = {
  args: { value: 34, isReadOnly: true },
}

export const Loading: Story = {
  args: { isLoading: true },
}

export const Required: Story = {
  args: { isRequired: true },
}

export const WithError: Story = {
  args: { errorMessage: 'Bu alan zorunludur' },
}

export const WithHint: Story = {
  args: { hint: 'Yaşadığınız şehri seçin' },
}

export const NotSearchable: Story = {
  args: { isSearchable: false },
}

export const WithDisabledOption: Story = {
  args: { isOptionDisabled: (option: City) => Boolean(option.disabled) },
}

export const Virtualized: Story = {
  args: {
    options: manyCities,
    virtualize: true,
    placeholder: 'Şehir ara (150 seçenek)',
  },
}

export const AsyncOptions: Story = {
  args: {
    options: [],
    loadOptions: async (inputValue: string) => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return cities.filter((city) =>
        city.name.toLocaleLowerCase('tr-TR').includes(inputValue.toLocaleLowerCase('tr-TR')),
      )
    },
    placeholder: 'Aramak için yazın...',
  },
}
