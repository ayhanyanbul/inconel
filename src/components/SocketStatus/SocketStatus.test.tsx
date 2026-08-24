import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SocketStatus } from './SocketStatus'

describe('SocketStatus', () => {
  it('bağlı durumunu class ve varsayılan etiketle gösterir', () => {
    render(<SocketStatus connected />)

    const status = screen.getByRole('status')
    expect(status).toHaveClass('inconel-socket-status', 'inconel-is-connected')
    expect(status).toHaveTextContent('Bağlı')
  })

  it('bağlantı yok durumunu class ve varsayılan etiketle gösterir', () => {
    render(<SocketStatus connected={false} />)

    const status = screen.getByRole('status')
    expect(status).toHaveClass(
      'inconel-socket-status',
      'inconel-is-disconnected',
    )
    expect(status).toHaveTextContent('Bağlantı yok')
  })

  it('özel connectedLabel ve disconnectedLabel metinlerini kullanır', () => {
    const { rerender } = render(
      <SocketStatus connected connectedLabel="Çevrimiçi" />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Çevrimiçi')

    rerender(<SocketStatus connected={false} disconnectedLabel="Çevrimdışı" />)
    expect(screen.getByRole('status')).toHaveTextContent('Çevrimdışı')
  })

  it('dışarıdan verilen className ile birleşir', () => {
    render(<SocketStatus connected className="custom-status" />)

    expect(screen.getByRole('status')).toHaveClass('custom-status')
  })
})
