import { NFTStatus } from '@/types/constants'

export const filters = {
  sort: [
    {
      id: 101,
      label: 'Price (High to Low)',
      value: 'fromMax'
    },
    {
      id: 102,
      label: 'Price (Low to Hight)',
      value: 'fromMin'
    }
  ],
  collection: Array.from({ length: 6 }).map((_, i) => ({
    id: 201 + i,
    value: `00${i + 1}`,
    label: `Collections 0${i + 1}`
  })),
  category: Array.from({ length: 4 }).map((_, i) => ({
    id: 201 + i,
    value: `00${i + 1}`,
    label: `Category 0${i + 1}`
  }))
}

export const FilterList = [
  {
    id: 1,
    title: 'status',
    field: 'status',
    isCollapse: true,
    options: [
      {
        value: NFTStatus.New,
        label: 'New',
        enabled: true
      },
      {
        value: NFTStatus.Sale,
        label: 'On Sale',
        enabled: true
      },
      {
        value: NFTStatus.Auction,
        label: 'On Auction',
        enabled: false
      },
      {
        value: NFTStatus.Offer,
        label: 'Has Offers',
        enabled: false
      },
      {
        value: NFTStatus.BuyNow,
        label: 'Buy now',
        enabled: true
      }
    ].filter((r) => r.enabled)
  }
]
