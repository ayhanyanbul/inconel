import Input, { type InputProps } from '../Input/Input'

export interface CurrencyInputProps extends Omit<InputProps, 'type'> {
  currency?: string
}

export function CurrencyInput(props: CurrencyInputProps) {
  return <Input {...props} type="currency" />
}
