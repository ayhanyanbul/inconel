import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SlideTabs, type SlideTab } from './SlideTabs'

const tabs: SlideTab[] = [
  { key: 'a', label: 'A' },
  { key: 'b', label: 'B' },
  { key: 'c', label: 'C' },
]

describe('SlideTabs', () => {
  it('sekmeleri render eder ve aktif olanı işaretler', () => {
    render(<SlideTabs tabs={tabs} activeKey="b" />)

    expect(screen.getByRole('button', { name: 'B' })).toHaveClass(
      'inconel-is-active',
    )
    expect(screen.getByRole('button', { name: 'A' })).not.toHaveClass(
      'inconel-is-active',
    )
  })

  it('activeKey verilmediğinde ilk görünür sekmeyi aktif seçer', () => {
    render(<SlideTabs tabs={tabs} />)

    expect(screen.getByRole('button', { name: 'A' })).toHaveClass(
      'inconel-is-active',
    )
  })

  it('bir sekmeye tıklandığında onChange ilgili key ile çağrılır', () => {
    const onChange = vi.fn()
    render(<SlideTabs tabs={tabs} activeKey="a" onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'B' }))

    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('show false olan sekmeleri listelemez', () => {
    render(
      <SlideTabs
        tabs={[
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B', show: false },
        ]}
      />,
    )

    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'B' })).not.toBeInTheDocument()
  })

  it('0 dan büyük sayısal count değerini gösterir, sıfırı gizler', () => {
    render(
      <SlideTabs
        tabs={[
          { key: 'a', label: 'A', count: 3 },
          { key: 'b', label: 'B', count: 0 },
        ]}
        activeKey="a"
      />,
    )

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('görünür sekme yoksa hiçbir şey render etmez', () => {
    const { container } = render(<SlideTabs tabs={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
