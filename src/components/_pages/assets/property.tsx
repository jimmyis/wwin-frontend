import { NFTProperty } from '@/types'

export interface Props {
  data: NFTProperty[]
}

export function PropertyComponent({ data }: Props) {
  // __RENDER
  if (!data.length) return null
  return (
    <div className='ui--asset-property'>
      <div className='content-header'>properties</div>

      <div className='ui--asset-property-body'>
        {data.map((record, index) => (
          <div className='list' key={index}>
            <div>
              {record.image && <img className='image' src={record.image as any} />}
              <h4 className='label'>{record.label}</h4>
              <p className='value'>{record.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
