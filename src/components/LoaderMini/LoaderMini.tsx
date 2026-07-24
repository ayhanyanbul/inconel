import { Loader, type LoaderProps } from '../Loader'
import { classNames } from '../shared/classNames'

export type LoaderMiniProps = LoaderProps
export function LoaderMini(props: LoaderMiniProps) {
  return <Loader {...props} className={classNames('inconel-loader--mini', props.className)} />
}
