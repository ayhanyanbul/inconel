import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-svg', () => ({
  ReactSVG: ({ className, src }: { className?: string; src: string }) => (
    <span className={className} data-testid="svg-mock" data-src={src} />
  ),
}))

vi.mock('react-datepicker', () => ({
  default: ({
    id,
    onChange,
    placeholderText,
  }: {
    id?: string
    onChange?: (value: Date) => void
    placeholderText?: string
  }) => (
    <input
      id={id}
      aria-label="date-picker"
      placeholder={placeholderText}
      onChange={() => onChange?.(new Date('2026-01-01'))}
    />
  ),
  registerLocale: vi.fn(),
}))

vi.mock('./ExcelTable/legacy/index.jsx', () => ({
  default: ({ data = [] }: { data?: Array<Record<string, unknown>> }) => (
    <div data-testid="excel-table">{data.length}</div>
  ),
}))

vi.mock('./HTMLTable/legacy/index.jsx', () => ({
  default: ({ data = [] }: { data?: Array<Record<string, unknown>> }) => (
    <div data-testid="html-table">{data.length}</div>
  ),
}))

import {
  Button,
  Checkbox,
  CheckboxGroup,
  CurrencyInput,
  CustomizableSwitch,
  DataGrid,
  DatePicker,
  DndFileUpload,
  DotLoader,
  DragDropUpload,
  ExcelTable,
  FieldFeedback,
  FileUpload,
  FileUploadText,
  Filter,
  HTMLTable,
  Input,
  InputText,
  Loader,
  LoaderMini,
  Modal,
  MultiSelect,
  MultiSelectWithCheckbox,
  Option,
  OptionWithIcon,
  RadioGroup,
  ReadOnly,
  Select,
  SlideTabs,
  SocketStatus,
  Svg,
  Switch,
  Table,
  Tabs,
  Textarea,
  TextInput,
  Tooltip,
} from './index'

describe('all public components', () => {
  it('Button eski label ve buttonType API’sini destekler', () => {
    render(<Button label="Kaydet" buttonType="success" />)
    expect(screen.getByRole('button', { name: 'Kaydet' })).toHaveClass(
      'inconel-button--success',
    )
  })

  it('Checkbox ve CheckboxGroup değişiklikleri iletir', () => {
    const checkboxChange = vi.fn()
    const groupChange = vi.fn()
    render(
      <>
        <Checkbox label="Tek" onChange={checkboxChange} />
        <CheckboxGroup
          options={[{ label: 'Grup', value: 'group' }]}
          onChange={groupChange}
        />
      </>,
    )
    fireEvent.click(screen.getByRole('checkbox', { name: 'Tek' }))
    fireEvent.click(screen.getByRole('checkbox', { name: 'Grup' }))
    expect(checkboxChange).toHaveBeenCalledOnce()
    expect(groupChange).toHaveBeenCalledWith(['group'])
  })

  it('Input varyantları render edilir', () => {
    render(
      <>
        <Input label="Input" />
        <InputText label="InputText" />
        <TextInput label="TextInput" />
        <CurrencyInput label="Currency" />
        <Textarea label="Textarea" />
      </>,
    )
    expect(screen.getByLabelText('Input')).toBeInTheDocument()
    expect(screen.getByLabelText('InputText')).toBeInTheDocument()
    expect(screen.getByLabelText('TextInput')).toBeInTheDocument()
    expect(screen.getByLabelText('Currency')).toBeInTheDocument()
    expect(screen.getByLabelText('Textarea')).toBeInTheDocument()
  })

  it('Switch varyantları değer değiştirir', () => {
    const onChange = vi.fn()
    const onClick = vi.fn()
    render(
      <>
        <Switch id="switch" isChecked={false} onChange={onChange} />
        <CustomizableSwitch isChecked={false} onClick={onClick}>
          <span>marker</span>
          <span>background</span>
        </CustomizableSwitch>
      </>,
    )
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledWith(true)
  })

  it('DataGrid veriyi ve yükleme durumunu gösterir', () => {
    render(
      <DataGrid
        data={[{ label: 'Ad', value: 'Ayhan' }]}
        loading
      />,
    )
    expect(screen.getByText('Ad')).toBeInTheDocument()
    expect(screen.getByText('Ayhan')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('DatePicker eski callback imzasını korur', () => {
    const onChange = vi.fn()
    render(<DatePicker id="date" name="date" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('date-picker'), {
      target: { value: '2026-01-01' },
    })
    expect(onChange).toHaveBeenCalledWith('date', new Date('2026-01-01'))
  })

  it('dosya yükleme bileşenleri render edilir', () => {
    render(
      <>
        <FileUpload id="file" label="Dosya" />
        <FileUploadText id="file-text" label="Metin dosyası" />
        <DragDropUpload label="Sürükle" />
        <DndFileUpload label="DND" />
      </>,
    )
    expect(screen.getByText('Dosya')).toBeInTheDocument()
    expect(screen.getByText('Metin dosyası')).toBeInTheDocument()
    expect(screen.getByText('Sürükle')).toBeInTheDocument()
    expect(screen.getByText('DND')).toBeInTheDocument()
  })

  it('loader bileşenleri görünürlük kurallarını uygular', () => {
    const { rerender } = render(<Loader render />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    rerender(<LoaderMini show />)
    expect(screen.getByRole('status')).toHaveClass('inconel-loader-mini')
    rerender(<DotLoader />)
    expect(screen.getByRole('status')).toHaveClass('inconel-dot-loader')
  })

  it('Modal eski show API’siyle açılır ve kapanır', () => {
    const onHide = vi.fn()
    render(
      <Modal show modalTitle="Modal" onHide={onHide}>
        İçerik
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveTextContent('İçerik')
    fireEvent.click(screen.getByRole('button', { name: 'Kapat' }))
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('Tabs ve SlideTabs seçim olaylarını çalıştırır', () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <Tabs
        tabData={[
          { label: 'Bir', content: 'İçerik bir' },
          { label: 'İki', content: 'İçerik iki' },
        ]}
        initialTab={0}
      />,
    )
    fireEvent.click(screen.getByRole('tab', { name: 'İki' }))
    expect(screen.getByText('İçerik iki')).toBeInTheDocument()
    rerender(
      <SlideTabs
        tabs={[{ key: 'one', label: 'Slide', show: true }]}
        activeKey="one"
        onChange={onChange}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Slide' }))
    expect(onChange).toHaveBeenCalledWith('one')
  })

  it('Select eski tek argümanlı onChange API’sini destekler', () => {
    const onChange = vi.fn()
    render(
      <Select
        label="Şehir"
        options={[{ value: 34, label: 'İstanbul' }]}
        value={null}
        singleValue
        onChange={onChange}
      />,
    )
    fireEvent.click(screen.getByRole('combobox', { name: 'Şehir' }))
    fireEvent.click(screen.getByRole('option', { name: 'İstanbul' }))
    expect(onChange).toHaveBeenCalledWith({ value: 34, label: 'İstanbul' })
  })

  it('tablo bileşenlerinin public exportları çalışır', () => {
    render(
      <>
        <ExcelTable data={[{ id: 1 }]} />
        <HTMLTable data={[{ id: 1 }]} />
      </>,
    )
    expect(screen.getByTestId('excel-table')).toHaveTextContent('1')
    expect(screen.getByTestId('html-table')).toHaveTextContent('1')
    expect(Table).toBeDefined()
  })

  it('Filter, MultiSelect ve varyantı render edilir', () => {
    render(
      <>
        <Filter>Filtre</Filter>
        <MultiSelect
          label="Multi"
          options={[{ label: 'A', value: 'a' }]}
        />
        <MultiSelectWithCheckbox
          label="Multi checkbox"
          options={[{ label: 'B', value: 'b' }]}
        />
      </>,
    )
    expect(screen.getByText('Filtre')).toBeInTheDocument()
    expect(screen.getByText('Multi')).toBeInTheDocument()
    expect(screen.getByText('Multi checkbox')).toBeInTheDocument()
  })

  it('yardımcı görsel bileşenler render edilir', () => {
    render(
      <>
        <ReadOnly label="Salt" value="Değer" />
        <Option selected>Seçenek</Option>
        <OptionWithIcon icon={<span>İkon</span>}>İkonlu</OptionWithIcon>
        <RadioGroup
          name="radio"
          options={[{ label: 'Radyo', value: 'radio' }]}
        />
        <SocketStatus connected />
        <Svg src="/icon.svg" />
        <Tooltip content="İpucu">
          <button type="button">Hedef</button>
        </Tooltip>
        <FieldFeedback
          hint="Yardım"
          hintId="hint"
          errorId="error"
        />
      </>,
    )
    expect(screen.getByText('Değer')).toBeInTheDocument()
    expect(screen.getByText('Seçenek')).toBeInTheDocument()
    expect(screen.getByText('İkonlu')).toBeInTheDocument()
    expect(screen.getByText('Radyo')).toBeInTheDocument()
    expect(screen.getByText('Bağlı')).toBeInTheDocument()
    expect(screen.getByTestId('svg-mock')).toBeInTheDocument()
    expect(screen.getByRole('tooltip')).toHaveTextContent('İpucu')
    expect(screen.getByText('Yardım')).toBeInTheDocument()
  })
})
