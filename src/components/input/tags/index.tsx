import { useMemo } from 'react'
import { getErrors } from '@/components/input'
import { TagsProps } from '@/types/input'
import { Select } from 'antd'
import cls from 'classnames'

export function TagsProvider({ name, value, rules, ...props }: TagsProps) {
  // __STATE <React.Hooks>
  const vid = useMemo(() => `ui--form-model-${name}`, [name])
  const defaultValue = useMemo(() => value, [value])

  const required = useMemo(() => rules?.required, [])

  // __RENDER
  return (
    <div className='ui--input-provider'>
      <label className={cls('ui--input-label', { required })} htmlFor={vid}>
        {props.icon && <span className={`icon bi bi-${props.icon}`}></span>}
        <span className='text'>{props.label}</span>
      </label>

      <div className='ui--input-desc'>{props.children}</div>

      <div className='ui--input-tags'>
        <Select mode='tags' defaultValue={defaultValue} onChange={props.onChange} />
      </div>

      <span className='ui--input-errors'>{getErrors(props.errors)}</span>
    </div>
  )
}
