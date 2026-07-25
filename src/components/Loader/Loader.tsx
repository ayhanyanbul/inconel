import type { HTMLAttributes } from 'react'

import { useInconelAdapters } from '../../adapters'
import { classNames } from '../shared/classNames'
import { Svg } from '../Svg'
import './styles.css'
import { DEFAULT_LOADER_LABEL } from './constants'

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  fullscreen?: boolean
  render?: boolean | null
  logo?: string
}

export function Loader({
  label = DEFAULT_LOADER_LABEL,
  fullscreen = false,
  render,
  logo,
  className,
  ...props
}: LoaderProps) {
  const adapters = useInconelAdapters()
  const shouldRender = render ?? adapters.loading ?? true
  const logoSource = logo ?? adapters.assets?.loaderLogo

  if (!shouldRender) return null

  return (
    <div
      {...props}
      className={classNames(
        'inconel-loader',
        fullscreen && 'inconel-loader--fullscreen',
        className,
      )}
      role="status"
      aria-label={label}
    >
      <span className="inconel-loader__spinner" aria-hidden="true" />
      {logoSource && (
        <Svg
          src={logoSource}
          className="inconel-loader__logo"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
