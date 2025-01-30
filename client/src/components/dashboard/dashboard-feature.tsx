'use client'

import * as d3 from "d3";
// import { HeatMapGrid } from 'react-grid-heatmap'
import { Suspense, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react'
import { useQueryClient } from "@tanstack/react-query";
import {Brain} from "lucide-react"

import { AppHero } from '../ui/ui-layout'
import Cards from "./cards";
import AiNotifications from "./ai-notifications";
import HealthFactor from "./SBF";
import SupplyBorrowFactor from "./HF";
import PoolsHeatmap from "./pools-heatmap";
import AiPredictedTrends from "./ai-predicted-trends";
import PoolsTable from "./pools-table";

import { useGetPools, useGetPredictions, useGetPrices } from "./dashboard-data-access";

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
]

export default function DashboardFeature() {

    const [ showTable, setShowTable ] = useState(false)
    const { publicKey } = useWallet()
    const [symbols, setSymbols] = useState<string[]>([]);
    const [mints, setMints] = useState<string[]>([]);

    const onPoolItemClicked = (item: any) => {
        setShowTable(true)
    }

    const query = useGetPools({ address: publicKey || undefined })
    const pricesQuery = useGetPrices({ symbols })
    const predictionsQuery = useGetPredictions({ mints })
    
    useEffect(() => {
    
        if (publicKey) {
            query.refetch();  // Initial refetch when publicKey changes

            const interval = setInterval(() => {
                console.log("Auto refetching pools...");
                query.refetch();
            }, 10000);
    
            return () => clearInterval(interval);  // Cleanup the interval
        }
    
        
        return () => {};  // Proper cleanup when publicKey is falsy
    }, [publicKey]);

    useEffect(() => {
        if( query.data ) {
            // const symbols = query.data.pools.map((pool: any) => {
            //     return pool.deposits.map((deposit: any) => deposit.symbol);
            // }).flat();

            // const uniqueSymbols = [...new Set<string>(symbols) as unknown as string[]];

            // setSymbols(uniqueSymbols)

            const mints = query.data.pools.map((pool: any) => {
                return pool.deposits.map((deposit: any) => deposit.mint);
            }).flat();

            const uniqueMints = [...new Set<string>(mints) as unknown as string[]];

            setMints(uniqueMints)
        }
    }, [ query.data ])


    return (
        <div className="w-full py-4 lg:py-8">
            {/* <AppHero title="gm" subtitle="Say hi to your new Solana dApp." /> */}
            {
                !showTable ? 
                <div className="flex flex-col gap-4 lg:gap-8 w-full">
                    <Cards poolsData={query.data} predictionsData={predictionsQuery.data} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-4">
                        <div className="w-full h-full">
                            <AiNotifications poolsData={query.data} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4">
                            <div className="lg:col-span-6">
                                <HealthFactor poolsData={query.data} />
                            </div>
                            <div className="lg:col-span-5">
                                <SupplyBorrowFactor poolsData={query.data} />
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-2">
                        <div className="text-white text-[22px] font-normal text-left">AI Summary</div>
                        <div className="w-full  px-4 lg:px-9 border border-[#333333] rounded-md p-8 bg-[#0B0E12] bg-opacity-60 min-h-[75px] text-white text-base lg:text-xl font-end flex items-center text-left py-2 lg:py-4 gap-2">
                        
                        <Brain/>
                        {
                            query.data?.message?.analysis || "No Summary"
                        }
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 w-full gap-4 ">
                        <div className="h-full w-full lg:col-span-7">
                            <AiPredictedTrends poolsData={query.data} predictionsData={predictionsQuery.data} />
                        </div>
                        <div className="h-full w-full lg:col-span-5">
                            <PoolsHeatmap onItemClicked={onPoolItemClicked} poolsData={query.data} predictionsData={predictionsQuery.data} />
                        </div>
                    </div>
                </div>
                :
                <PoolsTable />
            }
        </div>
    )
}