import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export type CheckBoxListValue = string | number

export interface CheckBoxListOption {
  [key: string]: unknown
}

export interface CheckBoxListProps<
  T extends CheckBoxListOption = CheckBoxListOption,
> {
  id?: string | null
  className?: string | null
  options?: T[]
  defaultSelectedOptions?: Array<T | CheckBoxListValue>
  optionLabel?: string
  optionValue?: string
  multiple?: boolean
  transferMode?: boolean
  disabled?: boolean
  selectedText?: string
  emptyText?: string
  sourceTitle?: string
  selectedTitle?: string
  transferAllText?: string
  clearAllText?: string
  searchPlaceholder?: string
  onChange?: (selected: T[], unselected: T[]) => void
}

function isDefinedValue(
  value: CheckBoxListValue | undefined | null,
): value is CheckBoxListValue {
  return value !== undefined && value !== null
}

const EMPTY_ARRAY: never[] = []

export function CheckBoxList<
  T extends CheckBoxListOption = CheckBoxListOption,
>({
  id = null,
  className = null,
  options = EMPTY_ARRAY,
  defaultSelectedOptions = EMPTY_ARRAY,
  optionLabel = 'label',
  optionValue = 'value',
  multiple = true,
  transferMode = false,
  disabled = false,
  selectedText = 'seçildi',
  emptyText = 'Veri bulunamadı',
  sourceTitle = 'Veriler',
  selectedTitle = 'Seçilenler',
  transferAllText = 'Tümünü aktar',
  clearAllText = 'Tümünü temizle',
  searchPlaceholder = 'Ara',
  onChange,
}: CheckBoxListProps<T>) {
  const [selectedValues, setSelectedValues] = useState<CheckBoxListValue[]>([])
  const [sourceSearch, setSourceSearch] = useState('')
  const [selectedSearch, setSelectedSearch] = useState('')

  const getValue = useCallback(
    (option: T) =>
      (option?.[optionValue] ?? option?.value ?? option?.id) as
        | CheckBoxListValue
        | undefined,
    [optionValue],
  )

  const getLabel = useCallback(
    (option: T): ReactNode =>
      (option?.[optionLabel] ?? option?.label ?? option?.name ?? '') as ReactNode,
    [optionLabel],
  )

  const normalizedDefaultValues = useMemo(() => {
    const values = defaultSelectedOptions.map((item) => {
      if (item && typeof item === 'object') {
        const option = item as T
        return (option[optionValue] ?? option.value ?? option.id) as
          | CheckBoxListValue
          | undefined
      }
      return item
    })
    return values.filter(isDefinedValue)
  }, [defaultSelectedOptions, optionValue])

  const normalizedOptions = useMemo(() => {
    const uniqueMap = new Map<CheckBoxListValue, T>()
    options.forEach((option) => {
      const value = getValue(option)
      if (isDefinedValue(value) && !uniqueMap.has(value)) {
        uniqueMap.set(value, option)
      }
    })
    return Array.from(uniqueMap.values())
  }, [getValue, options])

  const selectedOptions = useMemo(
    () =>
      normalizedOptions.filter((option) => {
        const value = getValue(option)
        return isDefinedValue(value) && selectedValues.includes(value)
      }),
    [getValue, normalizedOptions, selectedValues],
  )

  const unselectedOptions = useMemo(
    () =>
      normalizedOptions.filter((option) => {
        const value = getValue(option)
        return !isDefinedValue(value) || !selectedValues.includes(value)
      }),
    [getValue, normalizedOptions, selectedValues],
  )

  const filterBySearch = useCallback(
    (list: T[], searchValue: string) => {
      const query = searchValue.trim().toLocaleLowerCase()
      if (!query) return list
      return list.filter((option) =>
        String(getLabel(option)).toLocaleLowerCase().includes(query),
      )
    },
    [getLabel],
  )

  const filteredUnselectedOptions = useMemo(
    () => filterBySearch(unselectedOptions, sourceSearch),
    [filterBySearch, sourceSearch, unselectedOptions],
  )

  const filteredSelectedOptions = useMemo(
    () => filterBySearch(selectedOptions, selectedSearch),
    [filterBySearch, selectedOptions, selectedSearch],
  )

  const filteredOptions = useMemo(
    () => filterBySearch(normalizedOptions, sourceSearch),
    [filterBySearch, normalizedOptions, sourceSearch],
  )

  const emitChange = useCallback(
    (nextValues: CheckBoxListValue[]) => {
      const selected = normalizedOptions.filter((option) => {
        const value = getValue(option)
        return isDefinedValue(value) && nextValues.includes(value)
      })
      const unselected = normalizedOptions.filter((option) => {
        const value = getValue(option)
        return !isDefinedValue(value) || !nextValues.includes(value)
      })
      onChange?.(selected, unselected)
    },
    [getValue, normalizedOptions, onChange],
  )

  const updateSelection = useCallback(
    (nextValues: CheckBoxListValue[]) => {
      const cleanValues = multiple ? nextValues : nextValues.slice(-1)
      setSelectedValues(cleanValues)
      emitChange(cleanValues)
    },
    [emitChange, multiple],
  )

  const handleToggle = useCallback(
    (option: T) => {
      if (disabled) return
      const value = getValue(option)
      if (!isDefinedValue(value)) return
      const isSelected = selectedValues.includes(value)
      if (isSelected) {
        updateSelection(
          selectedValues.filter((selectedValue) => selectedValue !== value),
        )
        return
      }
      updateSelection(multiple ? [...selectedValues, value] : [value])
    },
    [disabled, getValue, multiple, selectedValues, updateSelection],
  )

  const handleTransferAll = useCallback(() => {
    if (disabled) return
    const values = normalizedOptions
      .map((option) => getValue(option))
      .filter(isDefinedValue)
    updateSelection(multiple ? values : values.slice(0, 1))
  }, [disabled, getValue, multiple, normalizedOptions, updateSelection])

  const handleClearAll = useCallback(() => {
    if (disabled) return
    updateSelection([])
  }, [disabled, updateSelection])

  useEffect(() => {
    const optionValues = normalizedOptions
      .map((option) => getValue(option))
      .filter(isDefinedValue)
    const nextValues = normalizedDefaultValues.filter((value) =>
      optionValues.includes(value),
    )
    const limitedValues = multiple ? nextValues : nextValues.slice(0, 1)
    setSelectedValues(limitedValues)
  }, [getValue, multiple, normalizedDefaultValues, normalizedOptions])

  const renderOption = useCallback(
    (option: T, area: 'list' | 'source' | 'selected' = 'list') => {
      const value = getValue(option)
      const checked = isDefinedValue(value) && selectedValues.includes(value)
      const inputId = `${id || 'inconel-checkbox-list'}-${area}-${String(value)}`
      const label = getLabel(option)

      return (
        <label
          className={classNames(
            'inconel-checkbox-list__item',
            checked && 'inconel-is-selected',
          )}
          htmlFor={inputId}
          key={`${area}-${String(value)}`}
          title={String(label)}
        >
          <input
            type="checkbox"
            id={inputId}
            checked={checked}
            disabled={disabled}
            onChange={() => handleToggle(option)}
          />
          <span className="inconel-checkbox-list__checkmark" aria-hidden="true" />
          <span className="inconel-checkbox-list__item-label">{label}</span>
        </label>
      )
    },
    [disabled, getLabel, getValue, handleToggle, id, selectedValues],
  )

  const renderEmpty = () => (
    <div className="inconel-checkbox-list__empty">{emptyText}</div>
  )

  return (
    <div
      className={classNames(
        'inconel-checkbox-list',
        transferMode && 'inconel-checkbox-list--transfer-mode',
        disabled && 'inconel-is-disabled',
        className,
      )}
      id={id ?? undefined}
    >
      <div className="inconel-checkbox-list__summary">
        <span>
          {selectedOptions.length} {selectedText}
        </span>
      </div>

      {transferMode ? (
        <div className="inconel-checkbox-list__transfer">
          <section className="inconel-checkbox-list__box">
            <div className="inconel-checkbox-list__box-header">
              <span>{sourceTitle}</span>
              <button
                type="button"
                onClick={handleTransferAll}
                disabled={disabled || unselectedOptions.length === 0}
              >
                {transferAllText}
              </button>
            </div>

            <div className="inconel-checkbox-list__box-search">
              <input
                type="text"
                value={sourceSearch}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSourceSearch(event.target.value)
                }
                placeholder={searchPlaceholder}
                disabled={disabled}
              />
            </div>

            <div className="inconel-checkbox-list__box-body">
              {filteredUnselectedOptions.length > 0
                ? filteredUnselectedOptions.map((option) =>
                    renderOption(option, 'source'),
                  )
                : renderEmpty()}
            </div>
          </section>

          <section className="inconel-checkbox-list__box inconel-checkbox-list__box--selected">
            <div className="inconel-checkbox-list__box-header">
              <span>{selectedTitle}</span>
              <button
                type="button"
                onClick={handleClearAll}
                disabled={disabled || selectedOptions.length === 0}
              >
                {clearAllText}
              </button>
            </div>

            <div className="inconel-checkbox-list__box-search">
              <input
                type="text"
                value={selectedSearch}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setSelectedSearch(event.target.value)
                }
                placeholder={searchPlaceholder}
                disabled={disabled}
              />
            </div>

            <div className="inconel-checkbox-list__box-body">
              {filteredSelectedOptions.length > 0
                ? filteredSelectedOptions.map((option) =>
                    renderOption(option, 'selected'),
                  )
                : renderEmpty()}
            </div>
          </section>
        </div>
      ) : (
        <div className="inconel-checkbox-list__list">
          <div className="inconel-checkbox-list__box-search">
            <input
              type="text"
              value={sourceSearch}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSourceSearch(event.target.value)
              }
              placeholder={searchPlaceholder}
              disabled={disabled}
            />
          </div>

          <div className="inconel-checkbox-list__list-body">
            {filteredOptions.length > 0
              ? filteredOptions.map((option) => renderOption(option))
              : renderEmpty()}
          </div>
        </div>
      )}
    </div>
  )
}
