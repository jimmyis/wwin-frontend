import { useState, useMemo, useCallback } from 'react'
import { getErrors } from '@/components/input'
import { InputProps } from '@/types/input'
import cls from 'classnames'

export function InputProvider({ name, value, register, rules, errors, ...props }: InputProps) {
  // __STATE <React.Hooks>
  const vid = useMemo(() => `ui--form-model-${name}`, [name])
  const defaultValue = useMemo(() => value, [value])

  const required = useMemo(() => rules?.required, [])
  const isPassword = useMemo(() => props.type === 'password', [])

  const [type, setType] = useState(props.type || 'text')

  // __FUNCTIONS
  const handleSwitchType = useCallback(() => {
    if (isPassword) setType(type === 'text' ? 'password' : 'text')
  }, [])

  // __RENDER
  return (
    <div className='ui--input-provider'>
      <label className={cls('ui--input-label', { required })} htmlFor={vid}>
        {props.icon && <span className={`icon bi bi-${props.icon}`}></span>}
        <span className='text'>{props.label}</span>
      </label>

      <div className='ui--input-desc'>{props.children}</div>

      <div className='ui--input-field'>
        <input
          type={type}
          id={vid}
          name={name}
          defaultValue={defaultValue}
          autoComplete={props.autocomplete}
          placeholder={props.placeholder}
          maxLength={props.maxlength}
          disabled={props.disabled}
          {...register(name, rules)}
        />

        {isPassword && (
          <a
            className={cls('icon', 'bi', {
              'bi-eye': type === 'password',
              'bi-eye-slash': type === 'text'
            })}
            onClick={handleSwitchType}
          ></a>
        )}
      </div>

      <span className='ui--input-errors'>{getErrors(errors)}</span>
    </div>
  )
}
