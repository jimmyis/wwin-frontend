import { useMemo, useCallback } from 'react'
import { getErrors } from '@/components/input'
import { SelectProps } from '@/types/input'
import cls from 'classnames'

export function SelectProvider({ name, value, register, rules, options, optionGroup, ...props }: SelectProps) {
  // __STATE <React.Hooks>
  const vid = useMemo(() => `ui--form-model-${name}`, [name])
  const defaultValue = useMemo(() => value, [value])

  const required = useMemo(() => rules?.required, [])
  const optionValue = useMemo(() => props.optionValue || 'value', [props.optionValue])
  const optionLabel = useMemo(() => props.optionLabel || 'label', [props.optionLabel])

  // __FUNCTIONS
  const optionRenderer = useCallback(() => {
    if (optionGroup) {
      const groupLabel = optionGroup[0] || 'label'
      const groupItems = optionGroup[1] || 'items'

      return options.map((group: any, index) => (
        <optgroup label={group[groupLabel]} key={group.id || index}>
          {group[groupItems].map((option: any, key: number) => (
            <option value={option[optionValue]} key={option.id || index + key / 10}>
              {option[optionLabel]}
            </option>
          ))}
        </optgroup>
      ))
    } else {
      return options.map((option: any, index) => (
        <option value={option[optionValue]} key={index}>
          {option[optionLabel]}
        </option>
      ))
    }
  }, [options, optionGroup])

  // __RENDER
  return (
    <div className='ui--input-provider'>
      <label className={cls('ui--input-label', { required })} htmlFor={vid}>
        {props.icon && <span className={`icon bi bi-${props.icon}`}></span>}
        <span className='text'>{props.label}</span>
      </label>

      <div className='ui--input-desc'>{props.children}</div>

      <div className='ui--input-field'>
        <select
          id={vid}
          name={name}
          className='ui--input-select'
          defaultValue={defaultValue}
          disabled={props.disabled}
          {...register(name, rules)}
        >
          {props.placeholder && <option>{props.placeholder}</option>}
          {optionRenderer()}
        </select>
        <span className='icon bi bi-play'></span>
      </div>

      <span className='ui--input-errors'>{getErrors(props.errors)}</span>
    </div>
  )
}
