import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type UIEvent,
} from 'react'
import { createPortal } from 'react-dom'

import { DotLoader } from '../DotLoader'
import { classNames } from '../shared/classNames'
import './styles.css'

export interface MultiSelectCheckBoxOption {
  [key: string]: unknown
}

export interface MultiSelectCheckBoxProps<
  T extends MultiSelectCheckBoxOption = MultiSelectCheckBoxOption,
> {
  id?: string | null
  label?: ReactNode
  className?: string | null
  labelClassName?: string | null
  inputClassName?: string | null
  optionsClassName?: string | null
  optionItemClassName?: string | null
  searchableInputClassName?: string | null
  options?: T[]
  defaultSelectedOptions?: T[]
  optionLabel?: string
  optionValue?: string
  onChange?: (selected: T[]) => void
  placeholder?: string
  selectedInputMessage?: string
  itemSelectedText?: string
  selectAllText?: string
  searchPlaceholder?: string
  noDataMessage?: string
  errorMessage?: string
  errorPlace?: 'in' | 'out'
  isSearchable?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  reactPortal?: boolean
  windowPosition?: boolean
  windowHeight?: number
  windowClose?: (closed: boolean) => void
  isScrollEnd?: (end: boolean) => void
  getOptionTooltip?: (option: T) => string | undefined
  limit?: number | null
  selectionLimit?: number | null
}

const EMPTY_OPTIONS: never[] = []

function isOptionSelected<T extends MultiSelectCheckBoxOption>(
  selected: T[],
  option: T,
  optionValue: string,
) {
  return selected.some(
    (item) => item?.[optionValue] === option?.[optionValue],
  )
}

export function MultiSelectCheckBox<
  T extends MultiSelectCheckBoxOption = MultiSelectCheckBoxOption,
>({
  id = null,
  label = null,
  className = null,
  labelClassName = null,
  inputClassName = null,
  optionsClassName = null,
  optionItemClassName = null,
  searchableInputClassName = null,
  options = EMPTY_OPTIONS,
  defaultSelectedOptions = EMPTY_OPTIONS,
  optionLabel = 'label',
  optionValue = 'value',
  onChange,
  placeholder = 'Seçiniz',
  selectedInputMessage,
  itemSelectedText = 'öğe seçili',
  selectAllText = 'Tümünü Seç',
  searchPlaceholder = 'Ara',
  noDataMessage = 'Veri bulunamadı',
  errorMessage = '',
  errorPlace = 'out',
  isSearchable = false,
  isLoading = false,
  isDisabled = false,
  reactPortal = false,
  windowPosition = false,
  windowHeight = 800,
  windowClose,
  isScrollEnd,
  getOptionTooltip = (option: T) =>
    typeof option?.tooltip === 'string' ? option.tooltip : undefined,
  limit = null,
  selectionLimit = null,
}: MultiSelectCheckBoxProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const portalWrapRef = useRef<HTMLDivElement>(null)

  const [showOptions, setShowOptions] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<T[]>(
    defaultSelectedOptions,
  )
  const [openDirection, setOpenDirection] = useState<'top' | 'bottom' | null>(
    null,
  )
  const [searchValue, setSearchValue] = useState('')
  const [portalStyle, setPortalStyle] = useState<CSSProperties | null>(null)
  const [portalReady, setPortalReady] = useState(false)

  const selectionLimitValue = limit ?? selectionLimit
  const maxSelectionCount = Number(selectionLimitValue)
  const hasSelectionLimit =
    Number.isFinite(maxSelectionCount) && maxSelectionCount > 0

  const recomputePortalPosition = useCallback(() => {
    if (!reactPortal || !anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    setPortalStyle({
      position: 'fixed',
      left: rect.left,
      top: rect.bottom,
      width: rect.width,
      zIndex: 9999,
    })
    setPortalReady(true)
  }, [reactPortal])

  useEffect(() => {
    const next = hasSelectionLimit
      ? defaultSelectedOptions.slice(0, maxSelectionCount)
      : defaultSelectedOptions
    setSelectedOptions(next)
  }, [defaultSelectedOptions, hasSelectionLimit, maxSelectionCount])

  useEffect(() => {
    if (!showOptions) {
      windowClose?.(true)
      setSearchValue('')
    }
  }, [showOptions, windowClose])

  useEffect(() => {
    if (!showOptions) return undefined

    const rootEl = rootRef.current
    const portalEl = portalWrapRef.current

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      const inRoot = rootEl?.contains(target)
      const inPortal = portalEl?.contains(target)
      if (!inRoot && !inPortal) setShowOptions(false)
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    return () =>
      document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [showOptions])

  useLayoutEffect(() => {
    if (!showOptions) {
      setPortalReady(false)
      return
    }
    if (!reactPortal) return
    recomputePortalPosition()
  }, [showOptions, reactPortal, recomputePortalPosition])

  useEffect(() => {
    if (!showOptions || !reactPortal) return undefined

    const handleReposition = () => recomputePortalPosition()
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [showOptions, reactPortal, recomputePortalPosition])

  useEffect(() => {
    if (!windowPosition) return
    setOpenDirection(Number(windowHeight) < 800 ? 'top' : 'bottom')
  }, [windowHeight, windowPosition])

  const updateSelection = useCallback(
    (next: T[]) => {
      setSelectedOptions(next)
      onChange?.(next)
    },
    [onChange],
  )

  const handleScroll = useCallback(
    (event: UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget
      if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
        isScrollEnd?.(true)
      }
    },
    [isScrollEnd],
  )

  const toggleOption = useCallback(
    (option: T) => {
      if (isOptionSelected(selectedOptions, option, optionValue)) {
        updateSelection(
          selectedOptions.filter(
            (item) => item?.[optionValue] !== option?.[optionValue],
          ),
        )
        return
      }
      if (hasSelectionLimit && selectedOptions.length >= maxSelectionCount) {
        return
      }
      updateSelection([...selectedOptions, option])
    },
    [
      hasSelectionLimit,
      maxSelectionCount,
      optionValue,
      selectedOptions,
      updateSelection,
    ],
  )

  const filteredOptions = useMemo(() => {
    const query = searchValue.trim().toLocaleLowerCase()
    if (!query) return options
    return options.filter((option) =>
      String(option?.[optionLabel] ?? '')
        .toLocaleLowerCase()
        .includes(query),
    )
  }, [options, optionLabel, searchValue])

  const inputValue = useMemo(() => {
    if (selectedOptions.length === 0) return ''
    if (selectedOptions.length === 1) {
      return String(selectedOptions[0]?.[optionLabel] ?? '')
    }
    return `${selectedOptions.length} ${selectedInputMessage || itemSelectedText}`
  }, [itemSelectedText, optionLabel, selectedInputMessage, selectedOptions])

  const inputPlaceholder =
    errorPlace === 'in' ? errorMessage || placeholder : placeholder

  const toggleDropdown = useCallback(() => {
    if (isDisabled) return
    setShowOptions((prev) => !prev)
  }, [isDisabled])

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleDropdown()
    }
  }

  const allFilteredSelected = useMemo(
    () =>
      filteredOptions.length > 0 &&
      filteredOptions.every((option) =>
        isOptionSelected(selectedOptions, option, optionValue),
      ),
    [filteredOptions, optionValue, selectedOptions],
  )

  const handleSelectAll = useCallback(() => {
    if (allFilteredSelected) {
      updateSelection(
        selectedOptions.filter(
          (selected) =>
            !filteredOptions.some(
              (option) => selected?.[optionValue] === option?.[optionValue],
            ),
        ),
      )
      return
    }
    const toAdd = filteredOptions.filter(
      (option) => !isOptionSelected(selectedOptions, option, optionValue),
    )
    const limitedToAdd = hasSelectionLimit
      ? toAdd.slice(0, Math.max(maxSelectionCount - selectedOptions.length, 0))
      : toAdd
    updateSelection([...selectedOptions, ...limitedToAdd])
  }, [
    allFilteredSelected,
    filteredOptions,
    hasSelectionLimit,
    maxSelectionCount,
    optionValue,
    selectedOptions,
    updateSelection,
  ])

  const baseId = id || 'inconel-multi-select-checkbox'

  const optionsPanel = (
    <div
      ref={reactPortal ? portalWrapRef : undefined}
      className={classNames(
        'inconel-multi-select-checkbox__panel-wrap',
        reactPortal && 'inconel-multi-select-checkbox__panel-wrap--portal',
        openDirection === 'top' && 'inconel-is-open-top',
      )}
      style={
        reactPortal
          ? { ...(portalStyle ?? {}), visibility: portalReady ? 'visible' : 'hidden' }
          : undefined
      }
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div
        className={classNames(
          'inconel-multi-select-checkbox__options',
          reactPortal && 'inconel-multi-select-checkbox__options--portal',
          optionsClassName,
        )}
        onScroll={handleScroll}
      >
        {isSearchable && (
          <div className="inconel-multi-select-checkbox__search">
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={classNames(
                'inconel-multi-select-checkbox__search-input',
                searchableInputClassName,
              )}
              value={searchValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setSearchValue(event.target.value)
              }
              disabled={isDisabled}
            />
          </div>
        )}

        <div
          className={classNames(
            'inconel-multi-select-checkbox__option-item',
            optionItemClassName,
          )}
        >
          <input
            id={`${baseId}-select-all`}
            type="checkbox"
            checked={allFilteredSelected}
            onChange={handleSelectAll}
            disabled={isDisabled}
          />
          <label htmlFor={`${baseId}-select-all`}>{selectAllText}</label>
        </div>

        {filteredOptions.map((option, index) => {
          const value = option?.[optionValue] ?? index
          const checked = isOptionSelected(selectedOptions, option, optionValue)
          const optionDisabled =
            isDisabled ||
            (!checked && hasSelectionLimit && selectedOptions.length >= maxSelectionCount)
          const inputId = `${baseId}-${String(value)}`

          return (
            <div
              key={String(value)}
              className={classNames(
                'inconel-multi-select-checkbox__option-item',
                checked && 'inconel-is-selected',
                optionDisabled && 'inconel-is-disabled',
                optionItemClassName,
              )}
              title={getOptionTooltip(option)}
            >
              <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={() => toggleOption(option)}
                disabled={optionDisabled}
              />
              <label htmlFor={inputId}>
                {String(option?.[optionLabel] ?? '')}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div
      ref={rootRef}
      id={id ?? undefined}
      className={classNames(
        'inconel-multi-select-checkbox',
        errorMessage && 'inconel-is-error',
        isDisabled && 'inconel-is-disabled',
        openDirection === 'top' && !reactPortal && 'inconel-is-open-top',
        className,
      )}
    >
      {label && (
        <span
          className={classNames(
            'inconel-multi-select-checkbox__label',
            labelClassName,
          )}
        >
          {label}
        </span>
      )}

      <div className="inconel-multi-select-checkbox__input-wrap">
        {isLoading && (
          <div className="inconel-multi-select-checkbox__loader-cover">
            <DotLoader />
          </div>
        )}

        <div
          ref={anchorRef}
          role="button"
          tabIndex={0}
          className="inconel-multi-select-checkbox__input-container"
          onClick={toggleDropdown}
          onKeyDown={handleTriggerKeyDown}
        >
          <input
            type="text"
            className={classNames(
              'inconel-multi-select-checkbox__input',
              inputClassName,
            )}
            placeholder={inputPlaceholder}
            readOnly
            value={inputValue}
          />
          <span
            className="inconel-multi-select-checkbox__indicator"
            aria-hidden="true"
          />
        </div>
      </div>

      {showOptions &&
        (options.length > 0 ? (
          reactPortal ? (
            createPortal(optionsPanel, document.body)
          ) : (
            optionsPanel
          )
        ) : (
          <div className="inconel-multi-select-checkbox__nodata">
            <span>{noDataMessage}</span>
          </div>
        ))}

      {errorPlace !== 'in' && errorMessage && (
        <span className="inconel-multi-select-checkbox__error">
          {errorMessage}
        </span>
      )}
    </div>
  )
}
