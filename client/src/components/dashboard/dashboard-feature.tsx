'use client'

import * as d3 from "d3";
// import { HeatMapGrid } from 'react-grid-heatmap'
import { Suspense, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react'
import { useQueryClient } from "@tanstack/react-query";
import {Brain} from "lucide-react"
import { motion } from "framer-motion";

import { AppHero } from '../ui/ui-layout'
import Cards from "./cards";
import AiNotifications from "./ai-notifications";
import HealthFactor from "./SBF";
import SupplyBorrowFactor from "./HF";
import PoolsHeatmap from "./pools-heatmap";
import AiPredictedTrends from "./ai-predicted-trends";
import PoolsTable from "./pools-table";
import { useDashboard } from "./dashboard-data-access";


import { useGetPools, useGetPredictions, useGetPrices } from "./dashboard-data-access";

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
]

const AnimatedBrain = ({ size = 40, color = "#c9f31d" }) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Subtle glowing background effect */}
      <div className="absolute inset-0 animate-pulse">
        <Brain 
          size={size} 
          color={color} 
          className="opacity-40 transform scale-105" 
        />
      </div>
      
      {/* Main brain with gentle rotation */}
      <Brain 
        size={size} 
        color={color} 
        className="relative animate-spin-slow" 
        style={{
          animationDuration: '3s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      />
      
      {/* Subtle pulsing overlay */}
      <div className="absolute inset-0">
        <Brain 
          size={size} 
          color={color} 
          className="opacity-20 animate-subtle-ping" 
        />
      </div>
    </div>
  );
};

export default function DashboardFeature() {

    const [ showTable, setShowTable ] = useState(false)
    const { publicKey } = useWallet()
    // const [symbols, setSymbols] = useState<string[]>([]);
    const [mints, setMints] = useState<string[]>([]);
    const { addLoading, loading } = useDashboard()

    const onPoolItemClicked = (item: any) => {
        setShowTable(true)
    }

    const query = useGetPools({ address: publicKey || undefined })
    // const pricesQuery = useGetPrices({ symbols })
    const predictionsQuery = useGetPredictions({ mints })
    
    useEffect(() => {
        addLoading(true)
        if (publicKey) {
            query.refetch();

            const interval = setInterval(() => {
                console.log("Auto refetching pools...");
                query.refetch();
            }, 10000);
    
            return () => clearInterval(interval);
        }
        
        return () => {};
    }, [publicKey]);


    useEffect(() => {
        if( query.data ) {

            const mintsDeposits = query.data.pools.map((pool: any) => {
                return pool.deposits.map((deposit: any) => deposit.mint);
            }).flat();
            const mintsBorrows = query.data.pools.map((pool: any) => {
                return pool.borrows.map((borrow: any) => borrow.mint);
            }).flat();


            const uniqueMints = [...new Set<string>(mintsDeposits) as unknown as string[],...new Set<string>(mintsBorrows) as unknown as string[]];

            setMints(uniqueMints)
        }
    }, [ query.data ])


    useEffect(() => {
        if( loading && (query.data || !query.isLoading || predictionsQuery.data || !predictionsQuery.isLoading) ) {
            addLoading(false)
        }
    }, [query.isLoading, predictionsQuery.isLoading, query.data, predictionsQuery.data])


    return (
        <div className="w-full py-4 lg:py-8">
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
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full glass-container rounded-2xl border border-white/10 p-6"
                        >
                            <div className="text-white text-xl font-medium mb-4">AI Summary</div>
                            <div className="w-full flex items-center gap-5 text-white">
                                <AnimatedBrain size={40} color="#c9f31d"/>
                                <span className="text-md text-white/80">
                                    {query.data?.message?.analysis || "No Summary"}
                                </span>
                            </div>
                        </motion.div>
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