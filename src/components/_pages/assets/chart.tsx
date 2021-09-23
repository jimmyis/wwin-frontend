import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts'
import { isBrowser } from '@/libs/configs'
import { IProps } from '@/types'

export function PriceChartComponent({ data }: IProps) {
  // __RENDER
  return (
    <div className='ui--asset-chart'>
      <div className='ui--asset-chart-header'>
        <h2 className='h2'>Price History</h2>
      </div>

      <div className='ui--asset-chart-body'>
        {!data.length ? (
          <Chart />
        ) : (
          <div className='ui--asset-chart-empty'>
            <span className='icon bi bi-bar-chart'></span>
            <span className='text'>No trading data yet</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function Chart() {
  const AxisTick = ({ payload, x, y }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={16} y={0} dy={16} textAnchor='end' fill='var(--color-dark-6)' fontSize='12px' fontWeight={100}>
          {payload.value}
        </text>
      </g>
    )
  }

  if (isBrowser)
    return (
      <ResponsiveContainer width='100%' height={256}>
        <AreaChart data={data} margin={{ top: 25, left: 5, right: 5, bottom: 10 }}>
          <defs>
            <linearGradient id='area-linear' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='10%' stopColor='var(--color-hunt-6)' stopOpacity={0.5} />
              <stop offset='90%' stopColor='var(--color-hunt-6)' stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke='var(--color-dark-2)' strokeWidth={1} vertical={false} />

          <Tooltip animationDuration={400} cursor={{ stroke: 'var(--color-dark-2)', strokeWidth: 1 }} />

          <XAxis dataKey='name' stroke='var(--color-dark-2)' strokeWidth={1} tick={<AxisTick />} />

          <Area
            type='linear'
            dataKey='uv'
            stroke='var(--color-hunt-6)'
            strokeWidth={2}
            fill='url(#area-linear)'
            dot={{ strokeWidth: 4, r: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  else return null
}

export const data = [
  {
    name: 'Page A',
    uv: 10
  },
  {
    name: 'Page B',
    uv: 12
  },
  {
    name: 'Page C',
    uv: 20
  },
  {
    name: 'Page D',
    uv: 60
  },
  {
    name: 'Page E',
    uv: 100
  },
  {
    name: 'Page F',
    uv: 90
  },
  {
    name: 'Page G',
    uv: 80
  },
  {
    name: 'Page A',
    uv: 120
  },
  {
    name: 'Page B',
    uv: 140
  },
  {
    name: 'Page C',
    uv: 160
  },
  {
    name: 'Page D',
    uv: 220
  },
  {
    name: 'Page E',
    uv: 200
  },
  {
    name: 'Page F',
    uv: 170
  },
  {
    name: 'Page G',
    uv: 190
  }
]
