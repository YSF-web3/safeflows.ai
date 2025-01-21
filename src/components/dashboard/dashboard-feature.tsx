'use client'

import * as d3 from "d3";
// import { HeatMapGrid } from 'react-grid-heatmap'
import { Suspense } from 'react';


import { AppHero } from '../ui/ui-layout'
import Cards from "./cards";
import AiNotifications from "./ai-notifications";
import HealthFactor from "./HF";
import SupplyBorrowFactor from "./SBF";
import PoolsHeatmap from "./pools-heatmap";
import AiPredictedTrends from "./ai-predicted-trends";

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
]

export default function DashboardFeature() {

    const xLabels = new Array(24).fill(0).map((_, i) => `${i}`)
    const yLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const data = new Array(yLabels.length)
      .fill(0)
      .map(() =>
        new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 50 + 50))
    )

    return (
        <div className="w-full py-8 flex flex-col gap-8">
            {/* <AppHero title="gm" subtitle="Say hi to your new Solana dApp." /> */}
            <Cards />
            <div className="grid grid-cols-2 w-full gap-4 h-[409px] max-h-[409px]">
                <div className="w-full h-full">
                    <AiNotifications />
                </div>
                <div className="grid grid-cols-11 gap-4">
                    <div className="col-span-6">
                        <HealthFactor />
                    </div>
                    <div className="col-span-5">
                        <SupplyBorrowFactor />
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2">
                <div className="text-white text-[22px] font-normal text-left">AI Summary</div>
                <div className="w-full border rounded-[13px] px-9 border-[#B52C24] h-[75px] text-white text-[22px] font-normal flex items-center text-left">
                3 Lending Pools are high risk Lorem ipsum dolor sit amet consectetur. Leo enim diam sollicitudin integer nunc .
                </div>
            </div>
            <div className="grid grid-cols-12 w-full gap-4 h-[365px]">
                <div className="h-full w-full col-span-7">
                    <AiPredictedTrends />
                </div>
                <div className="h-full w-full col-span-5">
                    <PoolsHeatmap />
                </div>
            </div>
        </div>
    )
}
