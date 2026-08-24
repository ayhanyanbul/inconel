import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { InconelProvider } from '../../adapters'
import { TextEditor } from './TextEditor'

interface FakeEditorApi {
  focus: () => void
  insertContent: (content: string) => void
  getContent: () => string
  selection: {
    getBookmark: (type: number, normalized: boolean) => unknown
    moveToBookmark: (bookmark: unknown) => void
  }
  ui: {
    registry: {
      addButton: (
        name: string,
        options: { text: string; tooltip: string; onAction: () => void },
      ) => void
    }
  }
}

let registeredButtons: Record<
  string,
  { text: string; tooltip: string; onAction: () => void }
> = {}
let lastInit: Record<string, unknown> | null = null

vi.mock('@tinymce/tinymce-react', () => ({
  Editor: ({
    value,
    onEditorChange,
    onInit,
    init,
    apiKey,
  }: {
    value: string
    apiKey?: string
    onEditorChange?: (content: string) => void
    onInit?: (event: unknown, editor: FakeEditorApi) => void
    init?: Record<string, unknown>
  }) => {
    lastInit = init ?? null
    const api: FakeEditorApi = {
      focus: vi.fn(),
      insertContent: vi.fn(),
      getContent: () => `${value} [galeri]`,
      selection: {
        getBookmark: vi.fn(() => 'bookmark'),
        moveToBookmark: vi.fn(),
      },
      ui: {
        registry: {
          addButton: (name, options) => {
            registeredButtons[name] = options
          },
        },
      },
    }
    onInit?.({}, api)
    if (typeof init?.setup === 'function') {
      ;(init.setup as (editor: FakeEditorApi) => void)(api)
    }
    return (
      <textarea
        aria-label="tinymce-fake-editor"
        data-api-key={apiKey ?? ''}
        value={value}
        onChange={(event) => onEditorChange?.(event.target.value)}
      />
    )
  },
}))

afterEach(cleanup)

beforeEach(() => {
  registeredButtons = {}
  lastInit = null
})

describe('TextEditor', () => {
  it('inconel-text-editor sarmalayıcısı içinde value değerini gösterir', () => {
    render(<TextEditor value="<p>Merhaba</p>" />)

    expect(screen.getByLabelText('tinymce-fake-editor')).toHaveValue(
      '<p>Merhaba</p>',
    )
  })

  it('kullanıcı içerik değiştirdiğinde onChange çağrılır', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TextEditor value="" onChange={onChange} />)

    await user.type(screen.getByLabelText('tinymce-fake-editor'), 'a')

    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('apiKey ve height prop olarak Editor bileşenine iletilir', () => {
    render(<TextEditor apiKey="test-key" height={300} />)

    expect(screen.getByLabelText('tinymce-fake-editor')).toHaveAttribute(
      'data-api-key',
      'test-key',
    )
    expect(lastInit?.height).toBe(300)
  })

  it('media adaptörü yoksa galeri butonu kayıt edilmez', () => {
    render(<TextEditor />)

    expect(registeredButtons.inconelGallery).toBeUndefined()
  })

  it('media adaptörü varsa galeri butonu seçilen içeriği düzenleyiciye ekler', async () => {
    const onChange = vi.fn()
    const open = vi.fn().mockResolvedValue({
      fileType: 'image',
      url: 'https://example.com/image.png',
    })

    render(
      <InconelProvider adapters={{ media: { open } }}>
        <TextEditor value="mevcut" onChange={onChange} />
      </InconelProvider>,
    )

    expect(registeredButtons.inconelGallery).toBeDefined()

    registeredButtons.inconelGallery.onAction()

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('mevcut [galeri]'))
    expect(open).toHaveBeenCalledWith({ type: 'editor' })
  })
})
