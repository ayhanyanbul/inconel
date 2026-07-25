import {
  Children,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'

import { useInconelAdapters } from '../../adapters'
import { Button } from '../Button'
import { classNames } from '../shared/classNames'
import { Svg } from '../Svg'
import { DEFAULT_MODAL_CLOSE_LABEL } from './constants'
import './styles.css'

export interface ModalProps {
  id?: string | null
  open?: boolean
  show?: boolean
  title?: ReactNode
  modalTitle?: ReactNode
  modalType?: 'info' | 'success' | 'error' | 'danger' | 'warning'
  children?: ReactNode
  footer?: ReactNode
  customButtons?: ReactNode
  closeLabel?: string
  closeButton?: boolean
  closeOnBackdrop?: boolean
  backdrop?: 'static' | boolean
  keyboard?: boolean
  centered?: boolean
  scrollable?: boolean
  size?: string
  maximize?: boolean
  maximizeIcon?: string
  fullSize?: boolean
  hideFooter?: boolean
  okText?: ReactNode
  okAction?: () => void
  okButtonType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  okButtonVariant?: string
  cancelText?: ReactNode
  cancelAction?: () => void
  cancelButtonType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  onClose?: () => void
  onHide?: () => void
  onShow?: () => void
  onEnter?: () => void
  onEntering?: () => void
  onEntered?: () => void
  onExit?: () => void
  onExiting?: () => void
  onExited?: () => void
  onEscapeKeyDown?: () => void
  dialogClassName?: string
  backdropClassName?: string
  bodyClassName?: string
  className?: string | null
  enforceFocus?: boolean
}

export function Modal({
  id,
  open,
  show,
  title,
  modalTitle,
  modalType = 'info',
  children,
  footer,
  customButtons,
  closeLabel = DEFAULT_MODAL_CLOSE_LABEL,
  closeButton = true,
  closeOnBackdrop = true,
  backdrop = true,
  keyboard = true,
  centered = true,
  scrollable = true,
  size = 'md',
  maximize = false,
  maximizeIcon,
  fullSize = false,
  hideFooter = false,
  okText,
  okAction,
  okButtonType = 'button',
  cancelText,
  cancelAction,
  cancelButtonType = 'button',
  onClose,
  onHide,
  onShow,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  onEscapeKeyDown,
  dialogClassName,
  backdropClassName,
  bodyClassName,
  className,
}: ModalProps) {
  const adapters = useInconelAdapters()
  const [maximized, setMaximized] = useState(false)
  const visible = open ?? show ?? false
  const close = () => {
    onClose?.()
    onHide?.()
  }

  useEffect(() => {
    if (visible) {
      onEnter?.()
      onEntering?.()
      onShow?.()
      onEntered?.()
    } else {
      onExit?.()
      onExiting?.()
      onExited?.()
    }
  }, [visible, onEnter, onEntered, onEntering, onExit, onExited, onExiting, onShow])

  useEffect(() => {
    if (!visible || !keyboard) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      onEscapeKeyDown?.()
      close()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  })

  if (!visible) return null

  const resolvedTitle =
    title ??
    modalTitle ??
    adapters.translate?.(
      `modalTitle${modalType[0].toUpperCase()}${modalType.slice(1)}`,
      modalType === 'success'
        ? 'Başarılı'
        : modalType === 'error' || modalType === 'danger'
          ? 'Hata'
          : 'Bilgi',
    )
  const resolvedMaximizeIcon = maximizeIcon ?? adapters.assets?.maximize
  const hasFooter =
    !hideFooter &&
    (footer !== undefined ||
      customButtons !== undefined ||
      Boolean(cancelText && cancelAction) ||
      Boolean(okText && okAction))

  return (
    <div
      className={classNames('inconel-modal-backdrop', backdropClassName)}
      role="presentation"
      onMouseDown={(event) => {
        if (
          backdrop !== 'static' &&
          backdrop !== false &&
          closeOnBackdrop &&
          event.target === event.currentTarget
        ) {
          close()
        }
      }}
    >
      <section
        id={id ?? undefined}
        className={classNames(
          'inconel-modal',
          `inconel-modal--${size}`,
          `inconel-modal--${modalType}`,
          centered && 'inconel-modal--centered',
          scrollable && 'inconel-modal--scrollable',
          (maximized || fullSize) && 'inconel-is-maximized',
          fullSize && 'inconel-is-full-size',
          dialogClassName,
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={typeof resolvedTitle === 'string' ? resolvedTitle : undefined}
      >
        <header className="inconel-modal__header">
          <div className="inconel-modal__title">{resolvedTitle}</div>
          <div className="inconel-modal__header-actions">
            {maximize && (
              <button
                type="button"
                className="inconel-modal__maximize"
                onClick={() => setMaximized((current) => !current)}
                aria-label="Büyüt"
              >
                {resolvedMaximizeIcon ? (
                  <Svg src={resolvedMaximizeIcon} />
                ) : (
                  '□'
                )}
              </button>
            )}
            {closeButton && (
              <button
                type="button"
                className="inconel-modal__close"
                aria-label={closeLabel}
                onClick={close}
              >
                ×
              </button>
            )}
          </div>
        </header>
        {children && (
          <div className={classNames('inconel-modal__content', bodyClassName)}>
            {children}
          </div>
        )}
        {hasFooter && (
          <footer className="inconel-modal__footer">
            {footer ??
              (customButtons !== undefined ? (
                Children.toArray(customButtons)
              ) : (
                <>
                  {cancelText && cancelAction && (
                    <Button
                      type={cancelButtonType}
                      variant="secondary"
                      onClick={cancelAction}
                    >
                      {cancelText}
                    </Button>
                  )}
                  {okText && okAction && (
                    <Button
                      type={okButtonType}
                      buttonType="success"
                      onClick={okAction}
                    >
                      {okText}
                    </Button>
                  )}
                </>
              ))}
          </footer>
        )}
      </section>
    </div>
  )
}
