import { useState, useEffect } from 'react'
import { ArticleComponent, Loading } from '@/components'
import { useQueryString } from '@/hooks'
// import { assetService } from '@/services/assets.service'
import { Pagination } from 'antd'

import { db } from '@/libs/firebase'
import { doc, getDoc } from "firebase/firestore";
import { NFTItem, INFTCollectionList } from '@/types'

export default function MarketplaceContainer() {
  // __STATE <React.Hooks>
  const [records, setRecords] = useState<NFTItem[]>()
  const [/* query */, setQuery] = useQueryString()
  const [page, setPage] = useState<any>({
    currentPage: 1,
    totalItems: 0
  })

  // __EFFECTS <React.Hooks>
  // useEffect(() => {
  //   async function run() {
  //     setRecords([])
  //     const res = await assetService.getAll({ page: 1, limit: 20, ...query })
  //     if (res) {
  //       setRecords(res.data)
  //       setPage({
  //         currentPage: res.currentPage,
  //         totalItems: res.totalItems
  //       })
  //     }
  //   }

  const getNftCollection = async (id: string) => {
    const docSnap = await getDoc(doc(db, "nft_collections", id));
    if (docSnap.exists()) {
      return (docSnap.data() as NFTItem)
    }
    return null
  }

  //   run()
  // }, [query])
  useEffect(() => {
    (async () => {
      const records_: NFTItem[] = []
      const querySnapshot = await getDoc(doc(db, "nft_collections_list", "recent"));
      if (querySnapshot.exists()) {
        const recentList = (querySnapshot.data() as INFTCollectionList)
        for (let nftId of Object.keys(recentList.LIST)) {
          const nftData = await getNftCollection(nftId)
          if (
            nftData
            && parseFloat(nftData.price) > 0.0
          ) {
            records_.push(nftData)
          }
        }
        setRecords(records_);
        setPage({
          currentPage: 1,
          totalItems: records_.length
        });
      }
    })()
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

    setQuery('/marketplace', { page: target, limit })
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

          {records?.length ? (
            <div className='ui--marketplace-body'>
              {records?.map((record, index) => (
                <ArticleComponent data={record} key={index} />
              ))}
            </div>
          ) : (
            <Loading />
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
