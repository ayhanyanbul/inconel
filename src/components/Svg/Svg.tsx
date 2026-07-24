import { ReactSVG, type Props as ReactSVGProps } from 'react-svg'
import './styles.css'

export interface SvgProps
  extends Omit<ReactSVGProps, 'className' | 'src' | 'title' | 'wrapper'> {
  className?: string
  src?: string | null
  title?: string | null
  render?: boolean
}

function Svg({
  className,
  src,
  title,
  render = true,
  ...svgProps
}: SvgProps) {
  if (!render || !src) {
    return null
  }

  const classes = ['inconel-svg', className].filter(Boolean).join(' ')

  return (
    <ReactSVG
      {...svgProps}
      className={classes}
      src={src}
      title={title ?? undefined}
      wrapper="span"
    />
  )
}

export default Svg
