import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CollapseComponent } from '@/components'
import { useObjectState } from '@/hooks'
import { FilterList } from '@/store/state'
import { FormMarketplaceFilters } from '@/types/forms'
import cls from 'classnames'

export type IFilter = Pick<FormMarketplaceFilters, 'status' | 'collection' | 'categories'>
export interface Props {
  defaultFilter: FormMarketplaceFilters
  onApply: (value: any) => void
}

export function FilterComponent({ defaultFilter, onApply }: Props) {
  // __STATE <React.Hooks>
  const { state, setState, setStateByField } = useObjectState<FormMarketplaceFilters>({})
  const { register, handleSubmit, reset } = useForm()

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    reset()
    setState(defaultFilter)
  }, [defaultFilter])

  // __FUNCTIONS
  const handleChecker = (field: keyof IFilter, value: string) => {
    let query = state && state[field]

    if (isChecked(field, value)) {
      query = query?.filter((r: string) => r !== value)
    } else {
      query = [...(query || []), value]
    }

    setStateByField(field, query)
  }

  const isChecked = (field: keyof IFilter, value: string) => {
    const query = state && state[field]
    return query?.some((r: string) => r === value)
  }

  const submit = useCallback(
    (data: any) => {
      onApply({
        ...state,
        ...data
      })
    },
    [state]
  )

  // __RENDER
  return (
    <form className='ui--marketplace-filter' onSubmit={handleSubmit(submit)}>
      <div className='ui--marketplace-filter-body'>
        {FilterList.map((r) => (
          <CollapseComponent title={r.title} isCollapse={r.isCollapse} key={r.field}>
            <ul className='ul'>
              {r.options.map((record, index) => (
                <li
                  className={cls('li', { checked: isChecked(r.field as any, record.value) })}
                  onClick={() => handleChecker(r.field as any, record.value)}
                  key={index}
                >
                  <span className='icon bi bi-check'></span>
                  <span className='label'>{record.label}</span>
                </li>
              ))}
            </ul>
          </CollapseComponent>
        ))}

        <CollapseComponent title='price' isCollapse>
          <div className='price'>
            <input
              type='number'
              inputMode='decimal'
              spellCheck={false}
              min={0}
              placeholder='Min'
              {...register('minPrice')}
            />
            <span className='text'>to</span>
            <input
              type='number'
              inputMode='decimal'
              spellCheck={false}
              min={0}
              placeholder='Max'
              {...register('maxPrice')}
            />
          </div>
        </CollapseComponent>
      </div>

      <div className='ui--marketplace-filter-footer'>
        <button type='reset' className='btn btn-default btn-reset'>
          <span className='text'>reset</span>
        </button>

        <button type='submit' className='btn btn-primary btn-apply'>
          <span className='text'>apply</span>
        </button>
      </div>
    </form>
  )
}
