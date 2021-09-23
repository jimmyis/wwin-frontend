import { useMemo } from 'react'
import { getErrors } from '@/components/input'
import { RadioProps } from '@/types/input'
import cls from 'classnames'

export function RadioProvider({ name, value, register, rules, options, ...props }: RadioProps) {
  // __STATE <React.Hooks>
  const vid = useMemo(() => `ui--form-model-${name}`, [name])
  const defaultChecked = useMemo(() => value, [value])

  const required = useMemo(() => rules?.required, [])
  const optionValue = useMemo(() => props.optionValue || 'value', [props.optionValue])
  const optionLabel = useMemo(() => props.optionLabel || 'label', [props.optionLabel])

  // __RENDER
  return (
    <div className='ui--input-provider'>
      <label className={cls('ui--input-label', { required })} htmlFor={vid}>
        {props.icon && <span className={`icon bi bi-${props.icon}`}></span>}
        <span className='text'>{props.label}</span>
      </label>

      <div className='ui--input-desc'>{props.children}</div>

      <div className='ui--input-radio'>
        {options.map((option: any, index: number) => (
          <div className='ui--input-radio-li' key={index}>
            <input
              type='radio'
              id={`${vid}-${index}`}
              name={name}
              value={option[optionValue]}
              className='ui--input-radio-field'
              defaultChecked={defaultChecked}
              {...register(name, rules)}
            />

            <label className='ui--input-radio-label' htmlFor={`${vid}-${index}`}>
              <span className='icon bi bi-check'></span>
              <span className='text'>{option[optionLabel]}</span>
            </label>
          </div>
        ))}
      </div>

      <span className='ui--input-errors'>{getErrors(props.errors)}</span>
    </div>
  )
}
