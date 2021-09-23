import { useState, useEffect, useMemo, useCallback, ChangeEvent } from 'react'
import { getErrors } from '@/components/input'
import { ImageProps } from '@/types/input'
import cls from 'classnames'

export function ImageProvider({ name, value, register, rules, ...props }: ImageProps) {
  // __STATE <React.Hooks>
  const vid = useMemo(() => `ui--form-model-${name}`, [name])
  const defaultValue = useMemo(() => value || '', [value])

  const required = useMemo(() => rules?.required, [])

  const [preview, setPreview] = useState('')
  const preRegister = register(name, rules)

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (value && typeof value === 'string') {
      setPreview(value)
    }
  }, [value])

  // __FUNCTIONS
  const handlePreview = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0]
      if (file) {
        const reader = URL.createObjectURL(file)
        setPreview(reader)
        preRegister.onChange(event)
      }
    },
    [preRegister]
  )

  // __RENDER
  return (
    <div className='ui--input-provider'>
      <label className={cls('ui--input-label', { required })} htmlFor={vid}>
        {props.icon && <span className={`icon bi bi-${props.icon}`}></span>}
        <span className='text'>{props.label}</span>
      </label>

      <div className='ui--input-desc'>{props.children}</div>

      <div className={cls('ui--input-file', name)}>
        {preview && <img className='ui--input-file-preview cursor-none' src={preview} />}

        <div className='ui--input-file-field'>
          <input
            type='file'
            id={vid}
            name={name}
            className='field'
            accept='image/*'
            defaultValue={defaultValue}
            readOnly={props.readonly}
            disabled={props.disabled}
            {...preRegister}
            onChange={handlePreview}
          />
          {!preview && <span className='icon bi bi-camera cursor-none'></span>}
        </div>
      </div>

      <span className='ui--input-errors'>{getErrors(props.errors)}</span>
    </div>
  )
}
