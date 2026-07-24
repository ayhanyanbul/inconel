import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('loading durumunu class ve disabled niteliğine yansıtır', () => {
    render(<Button loading>Kaydet</Button>)

    expect(screen.getByRole('button', { name: 'Kaydet' })).toHaveClass(
      'inconel-button',
      'inconel-is-loading',
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
