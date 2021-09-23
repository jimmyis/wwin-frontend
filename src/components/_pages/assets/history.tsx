import { RouterLink } from '@/components'
import { setFormat } from '@/libs/moment'
import { getShortAddress, price } from '@/utils'
import { Table } from 'antd'

export interface Props {
  data: any[]
}

export function TradeHistoryComponent({ data }: Props) {
  // __RENDER
  return (
    <div className='ui--asset-history'>
      <div className='ui--asset-history-header'>
        <h2 className='h2'>Trade History</h2>
      </div>

      <div className='ui--asset-history-body'>
        <Table
          dataSource={data}
          columns={[
            {
              title: 'Event',
              dataIndex: 'eventType',
              key: 'eventType',
              render: (text: any) => (
                <div className='event'>
                  <span className='icon bi bi-tools'></span>
                  <span className='text'>{text}</span>
                </div>
              )
            },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'price',
              render: (text: any) => (
                <div className='currency'>
                  <img className='icon' src='/static/images/weth.svg' />
                  <span className='text'>{price(text, 2)}</span>
                </div>
              )
            },
            {
              title: 'From',
              dataIndex: 'from',
              key: 'from',
              render: (text: any) => (
                <RouterLink href={`/profile/${text}`}>
                  <span className='text'>{getShortAddress(text)}</span>
                </RouterLink>
              )
            },
            {
              title: 'To',
              dataIndex: 'to',
              key: 'to',
              render: (text: any) => (
                <RouterLink href={`/profile/${text}`}>
                  <span className='text'>{getShortAddress(text)}</span>
                </RouterLink>
              )
            },
            {
              title: 'Date',
              key: 'eventTimestamp',
              dataIndex: 'eventTimestamp',
              render: (text: any) => setFormat(text)
            }
          ]}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  )
}
