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
            <div className="grid grid-cols-2 w-full gap-4">
                <div>
                    <AiNotifications />
                </div>
                <div className="w-full h-full grid grid-rows-2 gap-4">
                    <HealthFactor />
                    <SupplyBorrowFactor />
                </div>
            </div>
            <div className="border rounded-md px-8 py-4 border-red-400">
                <div className="">
                    3 lending pools are high risk
                </div>
            </div>
            <div className="grid grid-cols-2 w-full gap-4">
                <div>
                    <AiPredictedTrends />
                </div>
                <div>
                    <PoolsHeatmap />
                </div>
            </div>
            {/* <div className="max-w-xl text-center flex">
                <div className="space-y-2 w-full h-full">
                    <Suspense fallback={<div>Loading...</div>}>
                        <HeatMapGrid
                            data={data}
                            xLabels={xLabels}
                            yLabels={yLabels}
                            // Render cell with tooltip
                            cellRender={(x, y, value) => (
                                <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>
                            )}
                            xLabelsStyle={(index) => ({
                                color: index % 2 ? 'transparent' : '#777',
                                fontSize: '1rem'
                            })}
                            yLabelsStyle={() => ({
                                fontSize: '.7rem',
                                textTransform: 'uppercase',
                                color: '#777'
                            })}
                            cellStyle={(_x, _y, ratio) => ({
                                background: `rgb(12, 160, 44, ${ratio})`,
                                fontSize: '.8rem',
                                color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`
                            })}
                            cellHeight='2rem'
                            xLabelsPos='bottom'
                            onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
                            yLabelsPos='right'
                            square
                        />
                    </Suspense>
                
                </div>
            </div> */}
        </div>
    )
}
