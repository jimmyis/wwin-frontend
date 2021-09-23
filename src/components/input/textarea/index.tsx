import { useMemo } from 'react'
import { getErrors } from '@/components/input'
import { TextareaProps } from '@/types/input'
import cls from 'classnames'

export function TextareaProvider({ name, value, register, rules, ...props }: TextareaProps) {
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

      <div className='ui--input-field'>
        <textarea
          id={vid}
          name={name}
          className='ui--input-textarea'
          defaultValue={defaultValue}
          placeholder={props.placeholder}
          maxLength={props.maxlength}
          readOnly={props.readonly}
          rows={props.rows}
          disabled={props.disabled}
          {...register(name, rules)}
        />
      </div>

      <span className='ui--input-errors'>{getErrors(props.errors)}</span>
    </div>
  )
}
