import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Input, Select, Svg, Textarea } from './index'

afterEach(cleanup)

describe('Inconel public API', () => {
  it('bileşenleri root entry üzerinden sunar', () => {
    render(
      <>
        <Input label="E-posta" />
        <Textarea label="Mesaj" />
        <Select
          label="Şehir"
          options={[{ id: 34, name: 'İstanbul' }]}
          optionLabel="name"
          optionValue="id"
          value={null}
          onChange={() => undefined}
        />
      </>,
    )

    expect(screen.getByRole('textbox', { name: 'E-posta' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Mesaj' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Şehir' })).toBeInTheDocument()
    expect(Svg).toBeTypeOf('function')
  })
})
