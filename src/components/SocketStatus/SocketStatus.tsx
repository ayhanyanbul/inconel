import type { HTMLAttributes, ReactNode } from 'react'

import { classNames } from '../shared/classNames'
import './styles.css'

export interface SocketStatusProps extends HTMLAttributes<HTMLSpanElement> {
  connected: boolean
  connectedLabel?: ReactNode
  disconnectedLabel?: ReactNode
}

export function SocketStatus({
  connected,
  connectedLabel = 'Bağlı',
  disconnectedLabel = 'Bağlantı yok',
  className,
  ...props
}: SocketStatusProps) {
  return (
    <span
      {...props}
      className={classNames(
        'inconel-socket-status',
        connected ? 'inconel-is-connected' : 'inconel-is-disconnected',
        className,
      )}
      role="status"
    >
      <i aria-hidden="true" />
      {connected ? connectedLabel : disconnectedLabel}
    </span>
  )
}
