import type { ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'
import { DEFAULT_MODAL_CLOSE_LABEL } from './constants'

export interface ModalProps {
  open: boolean
  title?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  closeLabel?: string
  closeOnBackdrop?: boolean
  onClose?: () => void
  className?: string
}

export function Modal({
  open,
  title,
  children,
  footer,
  closeLabel = DEFAULT_MODAL_CLOSE_LABEL,
  closeOnBackdrop = true,
  onClose,
  className,
}: ModalProps) {
  if (!open) return null

  return (
    <div
      className="inconel-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose?.()
      }}
    >
      <section
        className={classNames('inconel-modal', className)}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
      >
        <header className="inconel-modal__header">
          <div className="inconel-modal__title">{title}</div>
          <button
            type="button"
            className="inconel-modal__close"
            aria-label={closeLabel}
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="inconel-modal__content">{children}</div>
        {footer && <footer className="inconel-modal__footer">{footer}</footer>}
      </section>
    </div>
  )
}
