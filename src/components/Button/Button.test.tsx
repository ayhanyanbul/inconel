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

  it('default tipini arka plansız, paddingsiz ve miras alınan renkle gösterir', () => {
    render(<Button buttonType="default">Metin</Button>)

    const button = screen.getByRole('button', { name: 'Metin' })
    const styles = getComputedStyle(button)

    expect(button).toHaveClass('inconel-button--default')
    expect(styles.padding).toMatch(/^0(?:px)?$/)
    expect(['transparent', 'rgba(0, 0, 0, 0)']).toContain(
      styles.backgroundColor,
    )
    expect(styles.color).not.toBe('rgb(255, 255, 255)')
  })
})
