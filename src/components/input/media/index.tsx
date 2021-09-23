import { useState, useMemo, useCallback, ChangeEvent } from 'react'
import { MediaComponent } from '@/components'
import { getErrors } from '@/components/input'
import { MediaProps } from '@/types/input'
import { Files } from '@/types'
import cls from 'classnames'

export function MediaProvider({ name, value, rules, ...props }: MediaProps) {
  // __STATE <React.Hooks>
  const vid = useMemo(() => `ui--form-model-${name}`, [name])
  const defaultValue = useMemo(() => value || '', [value])

  const required = useMemo(() => rules?.required, [])
  const register = useMemo(() => props.register(name, rules), [])

  const [render, setRender] = useState<Files>([])
  const hasFile = render.length

  // __FUNCTIONS
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target
      if (files?.length) {
        register.onChange(event)
        setRender(Array.from(files))
      }
    },
    [register]
  )

  // __RENDER
  return (
    <div className='ui--input-provider'>
      <label className={cls('ui--input-label', { required })} htmlFor={vid}>
        {props.icon && <span className={`icon bi bi-${props.icon}`}></span>}
        <span className='text'>{props.label}</span>
      </label>

      <div className='ui--input-desc'>{props.children}</div>

      <div className={cls('ui--input-media', { 'has-file': hasFile }, name)}>
        {render.map((record, index) => (
          <div className='ui--input-media-preview' key={index}>
            <MediaComponent media={record} autoPlay />
          </div>
        ))}

        <div className='ui--input-media-field'>
          <input
            type='file'
            id={vid}
            name={name}
            accept={props.accept}
            defaultValue={defaultValue}
            multiple={props.multiple}
            readOnly={props.readonly}
            disabled={props.disabled}
            {...register}
            onChange={handleFileChange}
          />

          <div className='placeholder'>
            <span className='icon bi bi-files cursor-none'></span>
            <span className='text'>{hasFile ? 'Change' : 'Choose'}</span>
          </div>
        </div>
      </div>

      <span className='ui--input-errors'>{getErrors(props.errors)}</span>
    </div>
  )
}
