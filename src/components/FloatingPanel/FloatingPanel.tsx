import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { classNames } from '../shared/classNames'
import './styles.css'

export type FloatingPanelTrianglePosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'right-top'
  | 'right-center'
  | 'right-bottom'

export interface FloatingPanelPosition {
  x: number | null
  y: number | null
}

export interface FloatingPanelProps {
  id?: string | null
  className?: string
  target?: HTMLElement | null
  watchTarget?: boolean
  trianglePosition?: FloatingPanelTrianglePosition
  triangleShow?: boolean
  windowCenterToPage?: boolean
  closeButtonShow?: boolean
  onClosed: () => void
  onOutsideClick?: (event: MouseEvent) => void
  closeOnScroll?: boolean
  transition?: 'slide' | 'fade' | 'off'
  draggable?: boolean
  defaultPositionX?: number | null
  defaultPositionY?: number | null
  onPositionChange?: (position: FloatingPanelPosition) => void
  render?: boolean
  children?: ReactNode
  portalTarget?: Element | null
}

const TRIANGLE_OFFSET = 10
const VERTICAL_OFFSET = 5

function isValidNumber(value: number | null | undefined): value is number {
  return value !== null && value !== undefined && !Number.isNaN(value)
}

export function FloatingPanel({
  id = null,
  className,
  target = null,
  watchTarget = true,
  trianglePosition = 'top-left',
  triangleShow = true,
  windowCenterToPage = false,
  closeButtonShow = true,
  onClosed,
  onOutsideClick,
  closeOnScroll = false,
  transition = 'slide',
  draggable = false,
  defaultPositionX = null,
  defaultPositionY = null,
  onPositionChange,
  render = true,
  children,
  portalTarget,
}: FloatingPanelProps) {
  const [holding, setHolding] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const referencePosition = useRef<{ x: number; y: number } | null>(null)
  const lastDragPosition = useRef<FloatingPanelPosition>({ x: null, y: null })
  const watchIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  )
  const isDraggingRef = useRef(false)

  const resolvedPortalTarget =
    portalTarget ?? (typeof document !== 'undefined' ? document.body : null)
  const show = render && resolvedPortalTarget !== null
  const watchTargetActive = !draggable && watchTarget && show

  const setCenter = useCallback(() => {
    const panelElement = panelRef.current
    if (!panelElement) return
    const { width, height } = panelElement.getBoundingClientRect()
    const halfBrowserWidth = window.innerWidth / 2
    const halfBrowserHeight = window.innerHeight / 2
    panelElement.style.transform = `translate(${halfBrowserWidth - width / 2}px, ${
      halfBrowserHeight - height / 2
    }px)`
  }, [])

  const setPosition = useCallback(() => {
    const panelElement = panelRef.current
    if (!panelElement || !target) return

    const winWidth = window.innerWidth
    const winHeight = window.innerHeight
    const panelRect = panelElement.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    const horizontalOffset = TRIANGLE_OFFSET * 1.5

    let posX = 0
    let posY = 0

    switch (trianglePosition) {
      case 'top-left':
        posX = targetRect.left + targetRect.width / 2 - horizontalOffset
        posY = targetRect.top + targetRect.height + VERTICAL_OFFSET
        break
      case 'top-center':
        posX = targetRect.left + targetRect.width / 2 - panelRect.width / 2
        posY = targetRect.top + targetRect.height + VERTICAL_OFFSET
        break
      case 'top-right':
        posX =
          targetRect.left + targetRect.width / 2 - panelRect.width + horizontalOffset
        posY = targetRect.top + targetRect.height + VERTICAL_OFFSET
        break
      case 'bottom-left':
        posX = targetRect.left + targetRect.width / 2 - horizontalOffset
        posY = targetRect.top - panelRect.height - VERTICAL_OFFSET
        break
      case 'bottom-center':
        posX = targetRect.left + targetRect.width / 2 - panelRect.width / 2
        posY = targetRect.top - panelRect.height - VERTICAL_OFFSET
        break
      case 'bottom-right':
        posX =
          targetRect.left + targetRect.width / 2 - panelRect.width + horizontalOffset
        posY = targetRect.top - panelRect.height - VERTICAL_OFFSET
        break
      case 'left-top':
        posX = targetRect.left + targetRect.width + VERTICAL_OFFSET
        posY = targetRect.top + targetRect.height / 2 - horizontalOffset
        break
      case 'left-center':
        posX = targetRect.left + targetRect.width + VERTICAL_OFFSET
        posY = targetRect.top + targetRect.height / 2 - panelRect.height / 2
        break
      case 'left-bottom':
        posX = targetRect.left + targetRect.width + VERTICAL_OFFSET
        posY =
          targetRect.top + targetRect.height / 2 - panelRect.height + horizontalOffset
        break
      case 'right-top':
        posX = targetRect.left - panelRect.width - VERTICAL_OFFSET
        posY = targetRect.top + targetRect.height / 2 - horizontalOffset
        break
      case 'right-center':
        posX = targetRect.left - panelRect.width - VERTICAL_OFFSET
        posY = targetRect.top + targetRect.height / 2 - panelRect.height / 2
        break
      case 'right-bottom':
        posX = targetRect.left - panelRect.width - VERTICAL_OFFSET
        posY =
          targetRect.top + targetRect.height / 2 - panelRect.height + horizontalOffset
        break
      default:
        break
    }

    posX = posX < TRIANGLE_OFFSET ? TRIANGLE_OFFSET : posX
    posX =
      posX + panelRect.width + TRIANGLE_OFFSET > winWidth
        ? winWidth - (panelRect.width + TRIANGLE_OFFSET)
        : posX

    posY = posY < TRIANGLE_OFFSET ? TRIANGLE_OFFSET : posY
    posY =
      posY + panelRect.height + TRIANGLE_OFFSET > winHeight
        ? winHeight - (panelRect.height + TRIANGLE_OFFSET)
        : posY

    panelElement.style.transform = `translate(${posX}px, ${posY}px)`
  }, [target, trianglePosition])

  const handleScroll = useCallback(
    (event: Event) => {
      const panelElement = panelRef.current
      if (panelElement && !panelElement.contains(event.target as Node)) {
        onClosed()
      }
    },
    [onClosed],
  )

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      const panelElement = panelRef.current
      if (panelElement && !panelElement.contains(event.target as Node)) {
        onOutsideClick?.(event)
      }
    },
    [onOutsideClick],
  )

  const watchComponent = useCallback(() => {
    if (watchTargetActive) {
      if (windowCenterToPage) setCenter()
      else setPosition()
    }

    if (target && !document.body.contains(target)) {
      clearInterval(watchIntervalRef.current)
      onClosed()
    }
  }, [onClosed, setCenter, setPosition, target, watchTargetActive, windowCenterToPage])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    event.preventDefault()
    const reference = referencePosition.current
    const panelElement = panelRef.current
    if (!reference || !panelElement) return

    const posX = event.pageX - reference.x
    const posY = event.pageY - reference.y
    lastDragPosition.current = { x: posX, y: posY }

    if (isDraggingRef.current) {
      requestAnimationFrame(() => {
        panelElement.style.transform = `translate(${posX}px, ${posY}px)`
      })
    }
    setHolding(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mousemove', handleMouseMove)
    isDraggingRef.current = false
    onPositionChange?.({
      x: lastDragPosition.current.x,
      y: lastDragPosition.current.y,
    })
    setHolding(false)
  }, [handleMouseMove, onPositionChange])

  const handlePanelMouseDown = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()
      const panelElement = panelRef.current
      if (!panelElement) return
      const { left, top } = panelElement.getBoundingClientRect()
      referencePosition.current = { x: event.clientX - left, y: event.clientY - top }
      isDraggingRef.current = true
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mousemove', handleMouseMove)
    },
    [handleMouseMove, handleMouseUp],
  )

  useEffect(() => {
    document.removeEventListener('mousedown', handleOutsideClick)
    clearInterval(watchIntervalRef.current)

    if (!isValidNumber(defaultPositionX) && !isValidNumber(defaultPositionY)) {
      if (windowCenterToPage) setCenter()
      else setPosition()
    }

    if (show) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    let watchedTimeout: ReturnType<typeof setTimeout> | undefined
    if (target) {
      watchIntervalRef.current = setInterval(watchComponent, 100)
      watchedTimeout = setTimeout(() => {
        panelRef.current?.classList.add('inconel-is-watched')
      }, 500)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      clearInterval(watchIntervalRef.current)
      clearTimeout(watchedTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render, target, handleOutsideClick, windowCenterToPage, draggable])

  useEffect(() => {
    if (!closeOnScroll) return undefined
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [closeOnScroll, handleScroll])

  useEffect(() => {
    const contentElement = contentRef.current
    if (!contentElement || !draggable) return undefined
    contentElement.addEventListener('mousedown', handlePanelMouseDown)
    return () =>
      contentElement.removeEventListener('mousedown', handlePanelMouseDown)
  }, [draggable, handlePanelMouseDown, render])

  useEffect(() => {
    if (isValidNumber(defaultPositionX) && isValidNumber(defaultPositionY)) {
      panelRef.current?.style.setProperty(
        'transform',
        `translate(${defaultPositionX}px, ${defaultPositionY}px)`,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!show || !resolvedPortalTarget) return null

  const triangleClass = triangleShow ? trianglePosition : 'inconel-triangle-off'
  const transitionClass =
    transition === 'slide'
      ? `inconel-is-animated-${trianglePosition.split('-')[0]}`
      : transition === 'fade'
        ? 'inconel-is-animation-fade'
        : undefined

  return createPortal(
    <div
      id={id ?? undefined}
      className={classNames(
        'inconel-floating-panel',
        triangleClass,
        transitionClass,
        holding && 'inconel-is-holding',
        className,
      )}
      ref={panelRef}
      style={{ transform: 'translate(-1000px, 0px)' }}
    >
      <div className="inconel-floating-panel__content">
        {draggable && (
          <div className="inconel-floating-panel__drag-bg" ref={contentRef} />
        )}
        {children}
        {closeButtonShow && (
          <div
            className="inconel-floating-panel__close"
            role="button"
            tabIndex={0}
            onClick={() => onClosed()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onClosed()
            }}
          >
            ×
          </div>
        )}
      </div>
    </div>,
    resolvedPortalTarget,
  )
}
