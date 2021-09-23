import { useState, ReactNode } from 'react'
import cls from 'classnames'

export interface Props {
  title: string
  children: ReactNode
  isCollapse?: boolean
}

export function CollapseComponent({ title, children, isCollapse }: Props) {
  // __STATE <React.Hooks>
  const [collapse, setCollapse] = useState(isCollapse)

  // __RENDER
  return (
    <div className={cls('ui--collapse', { 'is-collapse': collapse })}>
      <div className='ui--collapse-header' onClick={() => setCollapse(!collapse)}>
        <div className='label'>{title}</div>
        <span className={cls('icon', 'bi', collapse ? 'bi-dash' : 'bi-plus')}></span>
      </div>

      <div className='ui--collapse-body'>{children}</div>
    </div>
  )
}
