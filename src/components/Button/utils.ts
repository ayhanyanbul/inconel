import type { MouseEventHandler } from 'react'

export interface DebouncedCallback
  extends MouseEventHandler<HTMLButtonElement> {
  cancel: () => void
}

export function createDebouncedCallback(
  callback?: MouseEventHandler<HTMLButtonElement>,
  wait = 0,
): DebouncedCallback {
  let timer: ReturnType<typeof setTimeout> | undefined

  const debounced = ((event) => {
    if (!callback) return
    if (timer) clearTimeout(timer)
    event.persist()
    timer = setTimeout(() => callback(event), wait)
  }) as DebouncedCallback

  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = undefined
  }

  return debounced
}
