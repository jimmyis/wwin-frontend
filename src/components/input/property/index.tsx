import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components'
import { useModal, useObjectState } from '@/hooks'
import { createObjectURL, xModal } from '@/utils'
import { NFTProperty } from '@/types'

export interface Props {
  onChange: (data: any[]) => void
}

export function PropertyProvider({ onChange }: Props) {
  // __STATE <React.Hooks>
  const [data, setData] = useState<NFTProperty[]>([])
  const { onModalActive } = useModal(null, 'Add Properties')

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    onChange(data)
  }, [data])

  // __FUNCTIONS
  const handleApply = useCallback(
    (value: NFTProperty) => {
      const arr = [...data, value]
      setData(arr)
    },
    [data]
  )

  const handleRemove = useCallback(
    (record: any) => {
      const arr = data.filter((r: any) => r !== record)
      setData(arr)
    },
    [data]
  )

  // __RENDER
  return (
    <div className='ui--input-provider'>
      <label className='ui--input-label'>
        <span className='text'>properties</span>
      </label>

      <div className='ui--input-desc'>Textual traits that show up as rectangles</div>

      <div className='ui--input-property'>
        <div className='ui--input-property-list'>
          {data.map((record, index) => (
            <div className='li' key={index}>
              <div>
                {record.image && <img className='image' src={createObjectURL(record.image)} />}
                <h4 className='label'>{record.label}</h4>
                <p className='value'>{record.value}</p>

                <button type='button' className='btn btn-remove' onClick={() => handleRemove(record)}>
                  <span className='icon bi bi-trash'></span>
                  <span className='text'>remove</span>
                </button>
              </div>
            </div>
          ))}

          <button
            type='button'
            className='btn btn-modal'
            title='Remove'
            onClick={() => onModalActive(<FormProperty onApply={handleApply} />)}
          >
            <span className='icon bi bi-plus'></span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function FormProperty({ onApply }: any) {
  // __STATE <React.Hooks>
  const { state, setStateByField } = useObjectState<NFTProperty>({
    label: '',
    value: ''
  })

  // __FUNCTIONS
  const handleApply = useCallback(() => {
    if (state && Object.values(state).every((r) => r)) {
      onApply(state)
    }

    xModal()
  }, [state])

  // __RENDER
  return (
    <>
      <div className='ui--input-property-form'>
        <div className='title'>
          Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.
        </div>

        <Input.Image
          key='.image'
          name='image'
          label='image'
          register={() => ({ onChange: ({ target }: any) => setStateByField('image', target.files[0]) })}
        />

        <div className='rows'>
          <h4 className='label'>name</h4>
          <h4 className='label'>value</h4>
        </div>

        <div className='rows'>
          <input className='input' placeholder='e.g. Luck' onChange={(e) => setStateByField('label', e.target.value)} />
          <input className='input' placeholder='+10%' onChange={(e) => setStateByField('value', e.target.value)} />
        </div>
      </div>

      <div className='ui--input-property-footer'>
        <button type='button' className='btn btn-primary btn-apply' onClick={handleApply}>
          <span className='text'>apply</span>
        </button>
      </div>
    </>
  )
}
