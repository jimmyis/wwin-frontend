// import { useState, useEffect } from 'react'
import { Tabs } from 'antd';
const { TabPane } = Tabs;

import OfficialMarketplace from "./official"
import AuctionMarketplace from "./auction"

export default function MarketplaceContainer() {

  // const [ tab, setTab ] = useState("official")

  // __RENDER
  return (
    <Tabs defaultActiveKey="official" centered>
      <TabPane tab="Official" key="official">
        <OfficialMarketplace />
      </TabPane>
      <TabPane tab="Auction" key="auction">
        <AuctionMarketplace />
      </TabPane>
    </Tabs>
  )
}
