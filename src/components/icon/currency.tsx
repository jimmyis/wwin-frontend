import { ReactNode } from 'react'
import { lowerCase } from '@/utils'
import cls from 'classnames'

export interface Props {
  size: 'small' | 'medium' | 'large'
  symbol?: string
  currency?: string
  amount: string | number
  children?: ReactNode
}

export function CurrencyComponent({ children, ...props }: Props) {
  // __STATE <React.Hooks>
  const icon = `/static/images/${lowerCase(props.symbol || "coin-placeholder")}.png`

  // __RENDER
  return (
    <div className={cls('ui--currency', 'currency', props.size || 'medium')}>
      <img className='icon' src={icon} />
      <span className='text'>{props.amount || 0}</span>
      {children}
    </div>
  )
}
