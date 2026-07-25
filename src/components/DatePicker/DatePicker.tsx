import {
  useRef,
  type ComponentType,
  type FocusEventHandler,
  type ReactNode,
} from 'react'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { tr } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

import { useInconelAdapters } from '../../adapters'
import { classNames } from '../shared/classNames'
import { DotLoader } from '../DotLoader'
import { Svg } from '../Svg'
import './styles.css'
import { normalizeDate, resolveClearedDate } from './utils'

registerLocale('tr', tr)

type DateInput = Date | string | number | null
type PickerChange = Date | null | [Date | null, Date | null]
const Picker = ReactDatePicker as unknown as ComponentType<
  Record<string, unknown>
>

export interface DatePickerProps {
  id?: string
  value?: DateInput
  onChange?: (name: string, value: PickerChange) => void
  onBlur?: FocusEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  onClose?: () => void
  disabled?: boolean
  className?: string
  labelClassName?: string
  inputClassName?: string
  placeholder?: string
  name?: string
  label?: ReactNode
  timeIntervals?: number
  errorMessage?: ReactNode
  errorPlace?: 'in' | 'out' | string
  dateFormat?: string
  minDate?: DateInput
  maxDate?: DateInput
  showTimeSelect?: boolean
  showTimeSelectOnly?: boolean
  showYearPicker?: boolean
  showMonthYearPicker?: boolean
  showFullMonthYearPicker?: boolean
  autoComplete?: string
  notNull?: boolean
  minTime?: Date | null
  maxTime?: Date | null
  readOnly?: boolean
  portalId?: string | null
  isClearable?: boolean
  peekNextMonth?: boolean
  showMonthDropdown?: boolean
  showYearDropdown?: boolean
  dropdownMode?: 'scroll' | 'select' | null
  multiple?: ReactNode
  defaultDate?: boolean
  initialDate?: Date | null
  removeLabel?: boolean
  size?: string
  showWeekNumbers?: boolean
  required?: boolean
  dayClassName?: (date: Date) => string
  monthsShown?: number
  selectsRange?: boolean
  border?: boolean
  inline?: boolean
  startDate?: DateInput
  endDate?: DateInput
  onCalendarOpen?: () => void
  onCalendarClose?: () => void
  icon?: boolean | string
  onMonthChange?: (date: Date) => void
  onYearChange?: (date: Date) => void
  highlightDates?: Array<Date | Record<string, Date[]>>
  popperContainer?: ComponentType<{ children?: ReactNode }> | null
  isLoading?: boolean
}

export function DatePicker({
  id = '',
  value = null,
  onChange,
  onBlur,
  onFocus,
  onClose,
  disabled = false,
  className,
  labelClassName,
  inputClassName,
  placeholder,
  name = '',
  label,
  timeIntervals = 1,
  errorMessage,
  errorPlace,
  dateFormat = 'dd.MM.yyyy',
  minDate,
  maxDate = new Date('9999-12-31'),
  showTimeSelect = false,
  showTimeSelectOnly = false,
  showYearPicker = false,
  showMonthYearPicker = false,
  showFullMonthYearPicker = false,
  autoComplete = 'off',
  notNull = true,
  minTime,
  maxTime,
  readOnly = false,
  portalId,
  isClearable = false,
  peekNextMonth = false,
  showMonthDropdown = false,
  showYearDropdown = false,
  dropdownMode,
  multiple,
  defaultDate = false,
  initialDate,
  removeLabel = false,
  size = 'md',
  showWeekNumbers = false,
  required = false,
  dayClassName,
  monthsShown = 1,
  selectsRange = false,
  border = true,
  inline = false,
  startDate,
  endDate,
  onCalendarOpen,
  onCalendarClose,
  icon = true,
  onMonthChange,
  onYearChange,
  highlightDates = [],
  popperContainer,
  isLoading = false,
}: DatePickerProps) {
  const adapters = useInconelAdapters()
  const initialValue = useRef(normalizeDate(value))
  const selected = normalizeDate(value)
  const calendarIcon =
    typeof icon === 'string' ? icon : adapters.assets?.calendar
  const resolvedPlaceholder =
    errorPlace === 'in' && errorMessage
      ? String(errorMessage)
      : placeholder ??
        String(adapters.translate?.('date', 'Tarih seçin') ?? 'Tarih seçin')

  return (
    <div
      className={classNames(
        'inconel-date-picker',
        `inconel-date-picker--${size}`,
        disabled && 'inconel-is-disabled',
        className,
      )}
    >
      {!removeLabel && label !== null && label !== false && (
        <label
          htmlFor={id}
          className={classNames(
            'inconel-date-picker__label',
            labelClassName,
          )}
        >
          {label || <span>&nbsp;</span>}
          {multiple && (
            <span className="inconel-date-picker__multiple" title={String(multiple)}>
              {multiple}
            </span>
          )}
          {required && !value && (
            <span className="inconel-field__required"> *</span>
          )}
          {isLoading && <DotLoader />}
        </label>
      )}
      <div
        className={classNames(
          'inconel-date-picker__control',
          border && 'inconel-date-picker__control--bordered',
        )}
      >
        <Picker
          id={id}
          name={name}
          disabled={disabled}
          className={classNames(
            'inconel-date-picker__input',
            Boolean(errorMessage) && 'inconel-is-invalid',
            inputClassName,
          )}
          selected={selected}
          onChange={(next: PickerChange) => {
            const resolved = Array.isArray(next)
              ? next
              : resolveClearedDate(next, {
                  isClearable,
                  notNull,
                  defaultDate,
                  initialDate,
                  fallbackDate: initialValue.current,
                })
            onChange?.(name, resolved)
          }}
          locale={(adapters.locale ?? 'tr-TR').split('-')[0]}
          placeholderText={resolvedPlaceholder}
          dateFormat={dateFormat}
          onBlur={onBlur}
          onFocus={onFocus}
          onCalendarClose={() => {
            onClose?.()
            onCalendarClose?.()
          }}
          onCalendarOpen={onCalendarOpen}
          minDate={normalizeDate(minDate)}
          maxDate={normalizeDate(maxDate)}
          showTimeSelect={showTimeSelect}
          showTimeSelectOnly={showTimeSelectOnly}
          timeIntervals={timeIntervals}
          showMonthYearPicker={showMonthYearPicker}
          showFullMonthYearPicker={showFullMonthYearPicker}
          showYearPicker={showYearPicker}
          autoComplete={autoComplete}
          minTime={minTime}
          maxTime={maxTime}
          readOnly={readOnly}
          portalId={portalId}
          isClearable={isClearable}
          peekNextMonth={peekNextMonth}
          showMonthDropdown={showMonthDropdown}
          showYearDropdown={showYearDropdown}
          dropdownMode={dropdownMode}
          showWeekNumbers={showWeekNumbers}
          dayClassName={dayClassName}
          monthsShown={monthsShown}
          selectsRange={selectsRange}
          inline={inline}
          startDate={normalizeDate(startDate)}
          endDate={normalizeDate(endDate)}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          highlightDates={highlightDates}
          popperContainer={popperContainer}
        />
        {icon && !(isClearable && value) && calendarIcon && (
          <Svg
            src={calendarIcon}
            className="inconel-date-picker__icon"
            aria-hidden="true"
          />
        )}
      </div>
      {errorPlace !== 'in' && errorMessage && (
        <span className="inconel-date-picker__error" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  )
}
