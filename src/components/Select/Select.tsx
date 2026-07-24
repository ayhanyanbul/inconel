import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { createPortal } from 'react-dom'
import { classNames as mergeClassNames } from '../shared/classNames'
import '../shared/field.css'
import '../shared/field-controls.css'
import './styles.css'

import FieldFeedback from '../FieldFeedback/FieldFeedback'
import type { FieldFeedbackContentProps } from '../FieldFeedback/FieldFeedback'

export type OptionValue = string | number

export interface SelectHandle {
  focus: () => void
  blur: () => void
  clear: () => void
}

type SelectPart =
  | 'root'
  | 'label'
  | 'control'
  | 'input'
  | 'clearButton'
  | 'toggleButton'
  | 'menu'
  | 'option'
  | 'message'

export type SelectClassNames = Partial<Record<SelectPart, string>>
export type SelectStyles = Partial<Record<SelectPart, CSSProperties>>

export interface SelectProps<T extends object> extends FieldFeedbackContentProps {
  id?: string
  name?: string
  label: string
  options: T[]
  value: OptionValue | null
  onChange: (value: OptionValue | null, option: T | null) => void
  optionLabel: keyof T | ((option: T) => ReactNode)
  optionValue: keyof T | ((option: T) => OptionValue)
  getOptionSearchText?: (option: T) => string
  isOptionDisabled?: (option: T) => boolean
  placeholder?: string
  isClearable?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isLoading?: boolean
  loadOptions?: (inputValue: string, signal: AbortSignal) => Promise<T[]>
  loadOptionsDebounceMs?: number
  asyncErrorMessage?: ReactNode
  loadingMessage?: ReactNode
  noOptionsMessage?: ReactNode
  clearButtonLabel?: string
  openMenuButtonLabel?: string
  closeMenuButtonLabel?: string
  searchLocale?: string
  menuPortalTarget?: HTMLElement | null
  virtualize?: boolean
  virtualizationThreshold?: number
  optionHeight?: number
  className?: string
  classNames?: SelectClassNames
  styles?: SelectStyles
  onInputChange?: (value: string) => void
  onMenuOpen?: () => void
  onMenuClose?: () => void
}

function SelectInner<T extends object>(
  {
    id,
    name,
    label,
    options,
    value,
    onChange,
    optionLabel,
    optionValue,
    getOptionSearchText,
    isOptionDisabled = () => false,
    placeholder,
    isClearable = false,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    isLoading = false,
    loadOptions,
    loadOptionsDebounceMs = 250,
    hint,
    errorMessage,
    asyncErrorMessage,
    loadingMessage,
    noOptionsMessage,
    clearButtonLabel,
    openMenuButtonLabel,
    closeMenuButtonLabel,
    searchLocale,
    menuPortalTarget,
    virtualize = false,
    virtualizationThreshold = 100,
    optionHeight = 44,
    className,
    classNames = {},
    styles = {},
    onInputChange,
    onMenuOpen,
    onMenuClose,
  }: SelectProps<T>,
  forwardedRef: ForwardedRef<SelectHandle>,
) {
  const generatedId = useId()
  const inputId = id ?? `inconel-select-${generatedId.replace(/:/g, '')}`
  const labelId = `${inputId}-label`
  const listboxId = `${inputId}-listbox`
  const messageId = `${inputId}-message`
  const hintId = `${inputId}-hint`
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [asyncOptions, setAsyncOptions] = useState<T[] | null>(null)
  const [isAsyncLoading, setIsAsyncLoading] = useState(false)
  const [hasAsyncError, setHasAsyncError] = useState(false)

  useEffect(() => {
    if (!loadOptions) return
    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsAsyncLoading(true)
      setHasAsyncError(false)
      try {
        const loadedOptions = await loadOptions(
          inputValue,
          controller.signal,
        )
        if (!controller.signal.aborted) setAsyncOptions(loadedOptions)
      } catch {
        if (!controller.signal.aborted) setHasAsyncError(true)
      } finally {
        if (!controller.signal.aborted) setIsAsyncLoading(false)
      }
    }, loadOptionsDebounceMs)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [inputValue, loadOptions, loadOptionsDebounceMs])

  const availableOptions = loadOptions
    ? (asyncOptions ?? options)
    : options
  const loading = isLoading || isAsyncLoading

  const getLabel = useCallback(
    (option: T): ReactNode =>
      typeof optionLabel === 'function'
        ? optionLabel(option)
        : String(option[optionLabel]),
    [optionLabel],
  )

  const getSearchLabel = useCallback(
    (option: T) => {
      if (getOptionSearchText) return getOptionSearchText(option)
      const renderedLabel = getLabel(option)
      return typeof renderedLabel === 'string' ||
        typeof renderedLabel === 'number'
        ? String(renderedLabel)
        : ''
    },
    [getLabel, getOptionSearchText],
  )

  const getValue = useCallback(
    (option: T): OptionValue => {
      const resolvedValue =
        typeof optionValue === 'function'
          ? optionValue(option)
          : option[optionValue]

      if (
        typeof resolvedValue !== 'string' &&
        typeof resolvedValue !== 'number'
      ) {
        throw new TypeError('optionValue must resolve to a string or number.')
      }
      return resolvedValue
    },
    [optionValue],
  )

  const duplicateValues = useMemo(() => {
    const seen = new Set<OptionValue>()
    return availableOptions
      .map(getValue)
      .filter((optionId) => {
        if (seen.has(optionId)) return true
        seen.add(optionId)
        return false
      })
  }, [availableOptions, getValue])

  useEffect(() => {
    if (duplicateValues.length) {
      console.warn(
        `Duplicate optionValue found in Select "${label}":`,
        duplicateValues,
      )
    }
  }, [duplicateValues, label])

  const selectedOption = [...options, ...availableOptions].find(
    (option) => getValue(option) === value,
  )
  const selectedLabel = selectedOption ? getSearchLabel(selectedOption) : ''

  const filteredOptions = useMemo(() => {
    const query = inputValue.trim().toLocaleLowerCase(searchLocale)
    if (!query || loadOptions) return availableOptions
    return availableOptions.filter((option) =>
      getSearchLabel(option).toLocaleLowerCase(searchLocale).includes(query),
    )
  }, [availableOptions, getSearchLabel, inputValue, loadOptions, searchLocale])

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    strategy: menuPortalTarget ? 'fixed' : 'absolute',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: 12 }),
      shift({ padding: 12 }),
      size({
        padding: 12,
        apply({ availableHeight, rects, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.min(230, availableHeight)}px`,
            width: `${rects.reference.width}px`,
          })
        },
      }),
    ],
  })

  const shouldVirtualize =
    virtualize || filteredOptions.length >= virtualizationThreshold
  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => menuRef.current,
    estimateSize: () => optionHeight,
    overscan: 5,
    enabled: shouldVirtualize && isOpen,
  })

  const closeMenu = useCallback(() => {
    setIsOpen(false)
    setInputValue('')
    onInputChange?.('')
    onMenuClose?.()
  }, [onInputChange, onMenuClose])

  const openMenu = () => {
    if (isDisabled || isReadOnly) return
    if (!isOpen) onMenuOpen?.()
    setIsOpen(true)
  }

  const clearSelection = useCallback(() => {
    if (isDisabled || isReadOnly) return
    onChange(null, null)
    setInputValue('')
    setActiveIndex(0)
    onInputChange?.('')
    inputRef.current?.focus()
  }, [isDisabled, isReadOnly, onChange, onInputChange])

  useImperativeHandle(
    forwardedRef,
    () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: clearSelection,
    }),
    [clearSelection],
  )

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [closeMenu])

  useEffect(() => {
    if (activeIndex >= filteredOptions.length) setActiveIndex(0)
  }, [activeIndex, filteredOptions.length])

  useEffect(() => {
    if (shouldVirtualize && isOpen && filteredOptions[activeIndex]) {
      virtualizer.scrollToIndex(activeIndex, { align: 'auto' })
    }
  }, [
    activeIndex,
    filteredOptions,
    isOpen,
    shouldVirtualize,
    virtualizer,
  ])

  const selectOption = (option: T) => {
    if (isOptionDisabled(option)) return
    onChange(getValue(option), option)
    closeMenu()
    inputRef.current?.focus()
  }

  const moveActiveOption = (direction: 1 | -1) => {
    if (!filteredOptions.length) return
    let nextIndex = activeIndex
    do {
      nextIndex =
        (nextIndex + direction + filteredOptions.length) %
        filteredOptions.length
    } while (
      isOptionDisabled(filteredOptions[nextIndex]) &&
      nextIndex !== activeIndex
    )
    setActiveIndex(nextIndex)
  }

  const findEnabledIndex = (fromEnd = false) => {
    const entries = filteredOptions.map((option, index) => ({ option, index }))
    if (fromEnd) entries.reverse()
    return entries.find(({ option }) => !isOptionDisabled(option))?.index ?? 0
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'Backspace' &&
      !inputValue &&
      value !== null &&
      isClearable
    ) {
      event.preventDefault()
      clearSelection()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        openMenu()
        setActiveIndex(findEnabledIndex(event.key === 'ArrowUp'))
      } else {
        moveActiveOption(event.key === 'ArrowDown' ? 1 : -1)
      }
    } else if (event.key === 'Home' && isOpen) {
      event.preventDefault()
      setActiveIndex(findEnabledIndex())
    } else if (event.key === 'End' && isOpen) {
      event.preventDefault()
      setActiveIndex(findEnabledIndex(true))
    } else if (event.key === 'Enter' && isOpen) {
      event.preventDefault()
      const activeOption = filteredOptions[activeIndex]
      if (activeOption) selectOption(activeOption)
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      closeMenu()
    } else if (event.key === 'Tab') {
      closeMenu()
    }
  }

  const renderOption = (option: T, index: number, style?: CSSProperties) => {
    const optionId = getValue(option)
    const disabled = isOptionDisabled(option)
    return (
      <div
        id={`${inputId}-option-${index}`}
        key={optionId}
        role="option"
        aria-selected={optionId === value}
        aria-disabled={disabled}
        aria-posinset={index + 1}
        aria-setsize={filteredOptions.length}
        className={mergeClassNames(
          'inconel-select-option',
          index === activeIndex && 'inconel-is-active',
          optionId === value && 'inconel-is-selected',
          disabled && 'inconel-is-disabled',
          classNames.option,
        )}
        style={{ ...style, ...styles.option }}
        onMouseEnter={() => setActiveIndex(index)}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => selectOption(option)}
      >
        <span>{getLabel(option)}</span>
        {optionId === value && <span aria-hidden="true">✓</span>}
      </div>
    )
  }

  const menuContent = loading ? (
    <div
      role="status"
      className={mergeClassNames('inconel-select-message', classNames.message)}
      style={styles.message}
    >
      <span className="inconel-select-spinner" aria-hidden="true" />
      {loadingMessage}
    </div>
  ) : hasAsyncError ? (
    <div
      role="alert"
      className={mergeClassNames('inconel-select-message inconel-select-message-error', classNames.message)}
      style={styles.message}
    >
      {asyncErrorMessage}
    </div>
  ) : filteredOptions.length === 0 ? (
    <div
      className={mergeClassNames('inconel-select-message', classNames.message)}
      style={styles.message}
    >
      {noOptionsMessage}
    </div>
  ) : shouldVirtualize ? (
    <div
      role="presentation"
      className="inconel-select-virtual-content"
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((virtualRow) =>
        renderOption(filteredOptions[virtualRow.index], virtualRow.index, {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: virtualRow.size,
          transform: `translateY(${virtualRow.start}px)`,
        }),
      )}
    </div>
  ) : (
    filteredOptions.map((option, index) => renderOption(option, index))
  )

  const menu = isOpen ? (
    <div
      ref={(node) => {
        menuRef.current = node
        refs.setFloating(node)
      }}
      id={listboxId}
      role="listbox"
      aria-labelledby={labelId}
      className={mergeClassNames(
        'inconel-select-menu',
        menuPortalTarget && 'inconel-select-menu-portal',
        classNames.menu,
      )}
      style={{ ...floatingStyles, ...styles.menu }}
    >
      {menuContent}
    </div>
  ) : null

  const describedBy = errorMessage ? messageId : hint ? hintId : undefined

  return (
    <div
      ref={rootRef}
      className={mergeClassNames('inconel-select-field', className, classNames.root)}
      style={styles.root}
    >
      <label
        id={labelId}
        htmlFor={inputId}
        className={classNames.label}
        style={styles.label}
      >
        {label}
        {isRequired && <span aria-hidden="true"> *</span>}
      </label>
      <div
        ref={refs.setReference}
        className={mergeClassNames(
          'inconel-select-control',
          isOpen && 'inconel-is-open',
          isDisabled && 'inconel-is-disabled',
          Boolean(errorMessage) && 'inconel-has-error',
          classNames.control,
        )}
        style={styles.control}
      >
        <input
          ref={inputRef}
          id={inputId}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && filteredOptions[activeIndex]
              ? `${inputId}-option-${activeIndex}`
              : undefined
          }
          aria-describedby={describedBy}
          aria-invalid={Boolean(errorMessage)}
          aria-required={isRequired}
          aria-busy={loading}
          required={isRequired}
          disabled={isDisabled}
          readOnly={isReadOnly}
          autoComplete="off"
          placeholder={placeholder}
          value={inputValue || selectedLabel}
          className={classNames.input}
          style={styles.input}
          onChange={(event) => {
            setInputValue(event.target.value)
            setActiveIndex(0)
            onInputChange?.(event.target.value)
            openMenu()
          }}
          onClick={openMenu}
          onFocus={(event) => {
            openMenu()
            if (selectedOption && !inputValue) event.currentTarget.select()
          }}
          onKeyDown={handleKeyDown}
        />
        {loading && <span className="inconel-select-spinner" aria-hidden="true" />}
        {isClearable && value !== null && !isDisabled && !isReadOnly && clearButtonLabel && (
          <button
            type="button"
            className={mergeClassNames('inconel-select-clear', classNames.clearButton)}
            style={styles.clearButton}
            aria-label={clearButtonLabel}
            onClick={clearSelection}
          >
            ×
          </button>
        )}
        <button
          type="button"
          className={mergeClassNames('inconel-select-toggle', classNames.toggleButton)}
          style={styles.toggleButton}
          aria-label={isOpen ? closeMenuButtonLabel : openMenuButtonLabel}
          aria-expanded={isOpen}
          disabled={isDisabled}
          tabIndex={-1}
          onClick={() => (isOpen ? closeMenu() : openMenu())}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            width="20"
            height="20"
            fill="none"
          >
            <path
              d="m5 7.5 5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {name && (
        <input
          type="hidden"
          name={name}
          value={value ?? ''}
          required={isRequired}
        />
      )}
      <FieldFeedback
        hint={hint}
        errorMessage={errorMessage}
        hintId={hintId}
        errorId={messageId}
      />

      {menuPortalTarget && menu
        ? createPortal(menu, menuPortalTarget)
        : menu}
    </div>
  )
}

const Select = forwardRef(SelectInner) as <T extends object>(
  props: SelectProps<T> & { ref?: ForwardedRef<SelectHandle> },
) => ReactNode

export default Select
