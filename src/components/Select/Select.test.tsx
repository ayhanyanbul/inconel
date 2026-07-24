import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Select, { type SelectHandle } from './Select'

interface City {
  id: number
  name: string
  disabled?: boolean
}

const cities: City[] = [
  { id: 34, name: 'İstanbul' },
  { id: 6, name: 'Ankara' },
  { id: 35, name: 'İzmir' },
]

interface TestSelectProps {
  portalTarget?: HTMLElement
  options?: City[]
  name?: string
  onChange?: (value: string | number | null) => void
}

function TestSelect({
  portalTarget,
  options = cities,
  name,
  onChange,
}: TestSelectProps) {
  const [cityId, setCityId] = useState<string | number | null>(null)

  return (
    <Select
      label="Şehir"
      name={name}
      options={options}
      optionLabel="name"
      optionValue="id"
      value={cityId}
      isClearable
      clearButtonLabel="Seçimi temizle"
      openMenuButtonLabel="Seçenekleri aç"
      closeMenuButtonLabel="Seçenekleri kapat"
      isOptionDisabled={(option) => Boolean(option.disabled)}
      menuPortalTarget={portalTarget}
      onChange={(value) => {
        setCityId(value)
        onChange?.(value)
      }}
    />
  )
}

afterEach(cleanup)

describe('Select', () => {
  it('seçilen değeri gösterir ve temizleme butonuyla seçimi siler', async () => {
    const user = userEvent.setup()
    render(<TestSelect />)

    const input = screen.getByRole('combobox', { name: 'Şehir' })
    await user.click(input)
    await user.click(screen.getByRole('option', { name: 'İstanbul' }))

    expect(input).toHaveValue('İstanbul')

    await user.click(screen.getByRole('button', { name: 'Seçimi temizle' }))

    expect(input).toHaveValue('')
    expect(
      screen.queryByRole('button', { name: 'Seçimi temizle' }),
    ).not.toBeInTheDocument()
  })

  it('arama metnine göre seçenekleri filtreler', async () => {
    const user = userEvent.setup()
    render(<TestSelect />)

    await user.type(screen.getByRole('combobox', { name: 'Şehir' }), 'ank')

    expect(screen.getByRole('option', { name: 'Ankara' })).toBeInTheDocument()
    expect(
      screen.queryByRole('option', { name: 'İstanbul' }),
    ).not.toBeInTheDocument()
  })

  it('klavyeyle disabled seçeneği atlayarak seçim yapar', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <TestSelect
        options={[
          { id: 1, name: 'Kapalı', disabled: true },
          { id: 2, name: 'Açık' },
        ]}
        onChange={onChange}
      />,
    )

    const input = screen.getByRole('combobox', { name: 'Şehir' })
    await user.click(input)
    await user.keyboard('{Home}{Enter}')

    expect(onChange).toHaveBeenCalledWith(2)
    expect(input).toHaveValue('Açık')
  })

  it('menüyü verilen portal hedefinde oluşturur', async () => {
    const user = userEvent.setup()
    const portalTarget = document.createElement('div')
    document.body.append(portalTarget)
    render(<TestSelect portalTarget={portalTarget} />)

    await user.click(screen.getByRole('combobox', { name: 'Şehir' }))

    expect(within(portalTarget).getByRole('listbox')).toBeInTheDocument()
    portalTarget.remove()
  })

  it('seçilen değeri form alanına yazar', async () => {
    const user = userEvent.setup()
    const { container } = render(<TestSelect name="cityId" />)

    await user.click(screen.getByRole('combobox', { name: 'Şehir' }))
    await user.click(screen.getByRole('option', { name: 'İzmir' }))

    expect(
      container.querySelector<HTMLInputElement>('input[name="cityId"]'),
    ).toHaveValue('35')
  })

  it('ref üzerinden focus ve clear işlemlerini sunar', async () => {
    const user = userEvent.setup()
    const ref = createRef<SelectHandle>()

    function RefExample() {
      const [value, setValue] = useState<string | number | null>(34)
      return (
        <Select
          ref={ref}
          label="Şehir"
          options={cities}
          optionLabel="name"
          optionValue="id"
          value={value}
          isClearable
          onChange={(nextValue) => setValue(nextValue)}
        />
      )
    }

    render(<RefExample />)
    act(() => ref.current?.focus())
    expect(screen.getByRole('combobox', { name: 'Şehir' })).toHaveFocus()

    act(() => ref.current?.clear())
    expect(screen.getByRole('combobox', { name: 'Şehir' })).toHaveValue('')

    await user.keyboard('{Escape}')
  })

  it('async seçenekleri yükler ve sonucu gösterir', async () => {
    const user = userEvent.setup()
    const loadOptions = vi.fn().mockResolvedValue([
      { id: 1, name: 'Async İstanbul' },
    ])

    function AsyncExample() {
      const [value, setValue] = useState<string | number | null>(null)
      return (
        <Select
          label="Async şehir"
          options={[]}
          optionLabel="name"
          optionValue="id"
          value={value}
          loadOptions={loadOptions}
          loadOptionsDebounceMs={0}
          onChange={(nextValue) => setValue(nextValue)}
        />
      )
    }

    render(<AsyncExample />)
    await user.click(screen.getByRole('combobox', { name: 'Async şehir' }))

    expect(
      await screen.findByRole('option', { name: 'Async İstanbul' }),
    ).toBeInTheDocument()
    expect(loadOptions).toHaveBeenCalled()
  })
})
