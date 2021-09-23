import { RouterLink } from '@/components'
import { setFormat } from '@/libs/moment'
import { getShortAddress, price } from '@/utils'
import { IProps } from '@/types'
import { Table } from 'antd'

export function OfferComponent({ data }: IProps) {
  // __RENDER
  return (
    <div className='ui--asset-offer'>
      <div className='ui--asset-offer-header'>
        <h2 className='h2'>Offers</h2>
      </div>

      <div className='ui--asset-offer-body'>
        <Table
          dataSource={data}
          columns={[
            {
              title: 'Address',
              dataIndex: 'from',
              key: 'from',
              render: (text: any) => (
                <RouterLink href={`/profile/${text}`}>
                  <span className='text'>{getShortAddress(text)}</span>
                </RouterLink>
              )
            },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'price',
              render: (text: any) => (
                <div className='currency'>
                  <img className='icon' src='/static/images/bnb.svg' />
                  <span className='text'>
                    {price(text, 2)} <small>BNB</small>
                  </span>
                </div>
              )
            },
            {
              title: 'Date',
              dataIndex: 'expiration',
              key: 'expiration',
              render: (text: any) => setFormat(text)
            }
          ]}
          pagination={{ pageSize: 8 }}
        />
      </div>
    </div>
  )
}
