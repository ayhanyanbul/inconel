import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

import { Button, type ButtonProps } from '../Button'
import { classNames } from '../shared/classNames'
import { Svg } from '../Svg'
import './styles.css'

export interface DropDownBoxStyle extends CSSProperties {
  arrowAlign?: 'left' | 'right'
  arrowPosition?: number
  menuPosition?: 'left' | 'right'
  rightTolerance?: number
  leftTolerance?: number
  topTolerance?: number
}

export interface DropDownBoxProps {
  downIconJsx?: ReactNode
  children?: ReactNode
  className?: string
  buttonClassName?: string
  onWindowOpen?: (open: boolean) => void
  onWindowClose?: () => void
  buttonClose?: boolean
  closeIcon?: string | null
  icon?: string | null
  downIcon?: string | null
  iconWidth?: number
  iconHeight?: number
  showDownIcon?: boolean
  style?: DropDownBoxStyle
  portalId?: string
  isActive?: boolean
  buttonClasses?: string
  trigger?: ReactNode
  filterButtonType?: ButtonProps['variant']
  label?: ReactNode
  footerJSX?: ReactNode
  windowTrigger?: number
  disabled?: boolean
  blockWindowClose?: boolean
  notificationCount?: number | null
  closeOnAction?: boolean
}

export function DropDownBox({
  downIconJsx,
  children,
  className,
  buttonClassName,
  onWindowOpen,
  onWindowClose = () => {},
  buttonClose = false,
  closeIcon,
  icon,
  downIcon,
  iconWidth = 20,
  iconHeight = 20,
  showDownIcon = false,
  style = { minWidth: 200, arrowAlign: 'right', arrowPosition: 10 },
  portalId,
  isActive = false,
  buttonClasses,
  trigger,
  filterButtonType = 'ghost',
  label,
  footerJSX,
  windowTrigger = 0,
  disabled = false,
  blockWindowClose = false,
  notificationCount,
  closeOnAction = false,
}: DropDownBoxProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [positionStyle, setPositionStyle] = useState<CSSProperties>({
    minWidth: style.minWidth,
  })
  const menuElementRef = useRef<HTMLDivElement>(null)
  const triggerElementRef = useRef<HTMLDivElement>(null)
  const blockWindowCloseRef = useRef(blockWindowClose)

  const portalTarget = useMemo(() => {
    if (typeof document === 'undefined') return null
    return (portalId && document.getElementById(portalId)) || document.body
  }, [portalId])

  const handleClickClose = (event: MouseEvent) => {
    if (blockWindowCloseRef.current) return

    const path =
      typeof event.composedPath === 'function' ? event.composedPath() : []
    const menuElement = menuElementRef.current
    const triggerElement = triggerElementRef.current

    if (
      (menuElement && path.includes(menuElement)) ||
      (triggerElement && path.includes(triggerElement))
    ) {
      return
    }

    setMenuOpen(false)
    onWindowOpen?.(false)
    onWindowClose()
  }

  const handleContentClick = () => {
    if (!closeOnAction) return

    setTimeout(() => {
      if (blockWindowCloseRef.current) return
      setMenuOpen(false)
      onWindowOpen?.(false)
      onWindowClose()
    }, 0)
  }

  const handleClickOpen = () => {
    const next = !menuOpen
    setMenuOpen(next)
    onWindowOpen?.(next)

    if (!triggerElementRef.current) return

    const rect = triggerElementRef.current.getBoundingClientRect()
    const x = rect.left + window.scrollX
    const y = rect.top + window.scrollY
    const topTolerance = style.topTolerance ?? 0
    const rightTolerance = style.rightTolerance ?? 0
    const leftTolerance = style.leftTolerance ?? 0

    const nextStyle: CSSProperties = {
      minWidth: style.minWidth,
      top: `${y + rect.height + topTolerance}px`,
    }

    if (style.menuPosition === 'right') {
      nextStyle.left = `${x - rightTolerance}px`
    } else if (style.menuPosition === 'left') {
      nextStyle.left = `${x + leftTolerance}px`
    } else {
      nextStyle.left = `${x - iconWidth / 2}px`
    }

    setPositionStyle(nextStyle)
  }

  useEffect(() => {
    if (!menuOpen) return undefined
    document.addEventListener('mousedown', handleClickClose)
    return () => document.removeEventListener('mousedown', handleClickClose)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen])

  useEffect(() => {
    blockWindowCloseRef.current = blockWindowClose
  }, [blockWindowClose])

  useEffect(() => {
    if (windowTrigger) setMenuOpen(false)
  }, [windowTrigger])

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClickOpen()
    }
  }

  const { arrowAlign, arrowPosition } = style
  const restStyle: DropDownBoxStyle = { ...style }
  delete restStyle.arrowAlign
  delete restStyle.arrowPosition
  delete restStyle.menuPosition
  delete restStyle.rightTolerance
  delete restStyle.leftTolerance
  delete restStyle.topTolerance

  const menu =
    menuOpen && portalTarget
      ? createPortal(
          <div ref={menuElementRef} className={className}>
            <div
              style={{ ...positionStyle, ...restStyle }}
              className="inconel-dropdown-box__content"
            >
              <span
                style={{ [arrowAlign ?? 'right']: arrowPosition }}
                className="inconel-dropdown-box__arrow"
              />
              {buttonClose && (
                <Button
                  className="inconel-dropdown-box__remove"
                  icon={closeIcon}
                  iconWidth={9}
                  iconHeight={9}
                  variant={filterButtonType}
                  onClick={() => {
                    setMenuOpen(false)
                    onWindowOpen?.(false)
                  }}
                >
                  {!closeIcon && '×'}
                </Button>
              )}
              <div
                className="inconel-dropdown-box__body"
                onClick={handleContentClick}
              >
                {children}
              </div>
              {footerJSX && (
                <div className="inconel-dropdown-box__footer">{footerJSX}</div>
              )}
            </div>
          </div>,
          portalTarget,
        )
      : null

  return (
    <div
      ref={triggerElementRef}
      className={classNames('inconel-dropdown-box', className)}
    >
      {trigger ? (
        <div
          role="button"
          tabIndex={0}
          onClick={handleClickOpen}
          onKeyDown={handleTriggerKeyDown}
        >
          {trigger}
        </div>
      ) : (
        <div className="inconel-dropdown-box__trigger">
          {notificationCount != null && (
            <span className="inconel-dropdown-box__notification">
              {notificationCount}
            </span>
          )}
          <Button
            label={label}
            className={classNames(
              'inconel-dropdown-box__button',
              menuOpen && 'inconel-is-open',
              isActive && 'inconel-is-selected',
              buttonClasses,
              buttonClassName,
            )}
            icon={icon}
            iconWidth={iconWidth}
            iconHeight={iconHeight}
            variant={filterButtonType}
            onClick={handleClickOpen}
            disabled={disabled}
          />
          {!downIconJsx && showDownIcon && downIcon && (
            <Svg src={downIcon} className="inconel-dropdown-box__down-icon" />
          )}
          {downIconJsx}
        </div>
      )}
      {menu}
    </div>
  )
}
