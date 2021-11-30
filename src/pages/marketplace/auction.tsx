import { useState, useEffect } from 'react'
import { ItemCardAuctionComponent, Loading } from '@/components'
// import { useQueryString } from '@/hooks'
// import { assetService } from '@/services/assets.service'
import { Pagination } from 'antd'

import { useDataContext } from '@/context'
import { loadMarketplaceListData, loadMarketplaceItemData } from "@/functions/firestore"

export default function AuctionlMarketplace() {
  const { db } = useDataContext();

  // __STATE <React.Hooks>
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<any[]>([])
  const [/* list */, setList] = useState<string[]>([])
  // const [/* query */, setQuery] = useQueryString()
  const [page/* , setPage */] = useState<any>({
    currentPage: 1,
    totalItems: 0
  })

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    setLoading(true);

    (async () => {
      let records_: any[] = []
      const marketplaceListData = await loadMarketplaceListData(db, "auction:recent")
      if (marketplaceListData.list) {
        records_ = await Promise.all(marketplaceListData.list.map(async (marketplace_item_id: string) => {
          const _data = await loadMarketplaceItemData(db, marketplace_item_id);
          console.log("loadMarketplaceItemData", _data)
          return _data
        }))
        setList(marketplaceListData.list)
        setRecords(records_)
        // setPage({
        //   currentPage: 1,
        //   totalItems: _data.list.length
        // });
      }
      setLoading(false)
    })()

    return () => {
      setRecords([])
      setLoading(false)
    }
  }, [])

  // __FUNCTIONS
  // const handleFilter = (value: { [propName: string]: any }) => {
  //   setQuery('/marketplace', value)
  // }

  // const handleSortBy = ({ target }: any) => {
  //   handleFilter({ sortBy: target.value })
  // }

  const handlePageChange = (target: number, limit: number) => {
    console.log(target, limit)

    // setQuery('/marketplace', { page: target, limit })
  }

  // __RENDER
  return (
    <div className='ui--marketplace router-view'>
      <div className='ui--marketplace-container'>
        {/* <div className='ui--marketplace-sidebar'>
          <h4 className='h4'>filters</h4>
          <Marketplace.Filters defaultFilter={query} onApply={handleFilter} />
        </div> */}

        <div className='ui--marketplace-content'>
          <div className='ui--marketplace-header'>
            <div className='title'>
              <h2 className='h2'>marketplace</h2>
              <p className='desc'>{page.totalItems} results</p>
            </div>

            <div className='action'>
              {/* <label>sort by:</label>
              <select value={query?.sortBy || ''} onChange={handleSortBy}>
                <option value=''>Auto</option>
                {filters.sort.map((r) => (
                  <option value={r.value} key={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
              <span className='icon bi bi-caret-down'></span> */}
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (<>{
            records.length > 0
            ? (
              <div className='ui--marketplace-body'>
                {records.map((record, index) => (
                  <ItemCardAuctionComponent data={record} key={index} />
                ))}
              </div>
            ) : (<div>No Item</div>)
          }</>
            
          )}

          <div className='ui--marketplace-footer'>
            <Pagination
              total={page.totalItems}
              current={page.currentPage}
              pageSize={20}
              defaultPageSize={20}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
